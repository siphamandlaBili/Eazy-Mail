import React, { useEffect, useState } from 'react';
import { 
  Card, CardHeader, CardBody, Text, Heading, 
  Stack, StackDivider, Box, Spinner, Center, Button, 
  useToast, Textarea, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
  useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay 
} from '@chakra-ui/react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from './firebase';

const PastEmails = () => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEmail, setEditingEmail] = useState(null);
  const [updatedContent, setUpdatedContent] = useState('');
  const [deletingEmailId, setDeletingEmailId] = useState(null);
  const toast = useToast();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    const testFirestoreConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "emails"));
        toast({
          title: "Firestore Connected",
          description: `${querySnapshot.docs.length} documents fetched successfully.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Firestore Connection Failed",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    testFirestoreConnection();

    const q = query(collection(db, "emails"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const emailsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmails(emailsArray);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = (email) => {
    setEditingEmail(email);
    setUpdatedContent(email.email_content);
    onEditModalOpen();
  };

  const handleSaveEdit = async () => {
    if (!updatedContent.trim()) {
      toast({
        title: "Error",
        description: "Email content cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const emailRef = doc(db, "emails", editingEmail.id);
      await updateDoc(emailRef, { email_content: updatedContent });
      toast({
        title: "Success",
        description: "Email updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onEditModalClose();
      setEditingEmail(null);
      setUpdatedContent('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (emailId) => {
    setDeletingEmailId(emailId);
    onDeleteDialogOpen();
  };

  const confirmDelete = async () => {
    try {
      const emailRef = doc(db, "emails", deletingEmailId);
      await deleteDoc(emailRef);
      toast({
        title: "Success",
        description: "Email deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete email",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteDialogClose();
      setDeletingEmailId(null);
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh", padding: "20px", textAlign: "left", display: "block" }}>
      <Card>
        <CardHeader>
          <Heading size='md' style={{ textAlign: "center", color: "#046586" }}>Past Emails</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing='4'>
            {isLoading ? (
              <Center>
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : emails.length > 0 ? (
              emails.map(email => (
                <Box key={email.id} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  <Heading size='xs' textTransform='uppercase' style={{ marginBottom: "5px" }}>
                    To: {email.company_name_writing_to || "Unknown Company/Person"}
                  </Heading>
                  <Text pt='2' fontSize='sm' style={{ color: "#555", whiteSpace: 'pre-wrap' }}>
                    {email.email_content}
                  </Text>
                  <Text fontSize='xs' style={{ color: "#888", marginTop: "5px" }}>
                    Sent on: {email.timestamp ? new Date(email.timestamp.seconds * 1000).toLocaleString() : "Unknown Date"}
                  </Text>
                  {/* Updated button styles to ensure they are clickable */}
                  <Button 
                    colorScheme="blue" 
                    size="sm" 
                    onClick={() => handleEditClick(email)} 
                    style={{
                      marginRight: "10px",
                      marginTop: "10px",
                      zIndex: 9999,
                      pointerEvents: "auto",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    colorScheme="red" 
                    size="sm" 
                    onClick={() => handleDeleteClick(email.id)} 
                    style={{
                      marginTop: "10px",
                      zIndex: 9999,
                      pointerEvents: "auto",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ))
            ) : (
              <Text style={{ textAlign: "center", color: "#888" }}>No past emails available.</Text>
            )}
          </Stack>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>To: {editingEmail?.company_name_writing_to || "Unknown Company/Person"}</Text>
            <Textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              placeholder="Email content"
              size="sm"
              minHeight="200px"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Email
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this email? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default PastEmails;