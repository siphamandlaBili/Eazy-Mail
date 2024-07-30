import { Card, CardHeader, CardBody, CardFooter ,Heading,Stack,StackDivider,Box,Text} from '@chakra-ui/react'
import "./pastEmails.css";

const PastEmails =()=>{
    return <div style={{overflowY:"scroll"}}><Card w="100vw">
    <CardHeader style={{position:"fixed",top:0,background:"white",width:"100%",marginBottom:"20px",borderBottom:"1px solid gray"}}>
      <Heading size='md'>View Past Emails</Heading>
    </CardHeader>
  
  <div style={{marginTop:"50px"}}>
    <CardBody>
      <Stack divider={<StackDivider />} spacing='4'>
      <Box className="past-email">
          <Heading size='xs' textTransform='uppercase'>
            Mr Dupont
          </Heading>
          <Text pt='2' fontSize='md'>
            heading of the email
          </Text>
          <Text pt='2' fontSize='sm'>
          Thank you for reaching out to us.
          We have received your inquiry regarding order #12345. I apologize for any inconvenience you have experienced. Our team is currently reviewing the issue and will get back to you with a resolution as soon as possible.
          In the meantime, if you have any additional questions or concerns, please don't hesitate to contact us.
          </Text>
        </Box>
        <Box className="past-email">
          <Heading size='xs' textTransform='uppercase'>
            Mr Dupont
          </Heading>
          <Text pt='2' fontSize='md'>
            heading of the email
          </Text>
          <Text pt='2' fontSize='sm'>
          Thank you for reaching out to us.
          We have received your inquiry regarding order #12345. I apologize for any inconvenience you have experienced. Our team is currently reviewing the issue and will get back to you with a resolution as soon as possible.
          In the meantime, if you have any additional questions or concerns, please don't hesitate to contact us.
          </Text>
        </Box>
        <Box className="past-email">
          <Heading size='xs' textTransform='uppercase'>
            Mr Dupont
          </Heading>
          <Text pt='2' fontSize='md'>
            heading of the email
          </Text>
          <Text pt='2' fontSize='sm'>
          Thank you for reaching out to us.
          We have received your inquiry regarding order #12345. I apologize for any inconvenience you have experienced. Our team is currently reviewing the issue and will get back to you with a resolution as soon as possible.
          In the meantime, if you have any additional questions or concerns, please don't hesitate to contact us.
          </Text>
        </Box><Box className="past-email">
          <Heading size='xs' textTransform='uppercase'>
            Mr Dupont
          </Heading>
          <Text pt='2' fontSize='md'>
            heading of the email
          </Text>
          <Text pt='2' fontSize='sm'>
          Thank you for reaching out to us.
          We have received your inquiry regarding order #12345. I apologize for any inconvenience you have experienced. Our team is currently reviewing the issue and will get back to you with a resolution as soon as possible.
          In the meantime, if you have any additional questions or concerns, please don't hesitate to contact us.
          </Text>
        </Box>
        <Box className="past-email">
          <Heading size='xs' textTransform='uppercase'>
            Mr Dupont
          </Heading>
          <Text pt='2' fontSize='md'>
            heading of the email
          </Text>
          <Text pt='2' fontSize='sm'>
          Thank you for reaching out to us.
          We have received your inquiry regarding order #12345. I apologize for any inconvenience you have experienced. Our team is currently reviewing the issue and will get back to you with a resolution as soon as possible.
          In the meantime, if you have any additional questions or concerns, please don't hesitate to contact us.
          </Text>
        </Box>
        <Box className="past-email">
          <Heading size='xs' textTransform='uppercase'>
            Mr Dupont
          </Heading>
          <Text pt='2' fontSize='md'>
            heading of the email
          </Text>
          <Text pt='2' fontSize='sm'>
          Thank you for reaching out to us.
          We have received your inquiry regarding order #12345. I apologize for any inconvenience you have experienced. Our team is currently reviewing the issue and will get back to you with a resolution as soon as possible.
          In the meantime, if you have any additional questions or concerns, please don't hesitate to contact us.
          </Text>
        </Box>
      </Stack>
    </CardBody>
    </div>
  </Card>
  </div>
}

export default PastEmails;