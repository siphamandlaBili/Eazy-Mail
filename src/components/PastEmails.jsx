import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Stack, StackDivider, Box, Spinner, Center } from '@chakra-ui/react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from './firebase'; // Import Firestore configuration

const PastEmails = () => {
    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

    return (
        <div className="container" style={{height:"fit-content"}}>
            <Card>
                <CardHeader>
                    <Heading size='md'>Past Emails</Heading>
                </CardHeader>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        {isLoading ? (
                            <Center>
                                <Spinner size="xl" color="blue.500" />
                            </Center>
                        ) : (
                            emails.map(email => (
                                <Box key={email.id}>
                                    <Heading size='xs' textTransform='uppercase'>
                                        To: {email.recipient_name}
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                        {email.email_content}
                                    </Text>
                                </Box>
                            ))
                        )}
                    </Stack>
                </CardBody>
            </Card>
        </div>
    );
};

export default PastEmails;
