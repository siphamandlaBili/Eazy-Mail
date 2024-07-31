import React, { useEffect, useState } from 'react';
import './emailchat.css';
import {
    FormControl,
    FormLabel,
    Textarea,
    Select,
    Input,
    Button,
    Container,
    Spinner
} from '@chakra-ui/react';
import { FaClipboard } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from './firebase'; // Import Firestore configuration
import { collection, addDoc } from "firebase/firestore"; 

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;



const EmailChat = () => {
    const [input, setInput] = useState('');
    const handleInputChange = (e) => setInput(e.target.value);

    const [inputC, setInputC] = useState('');
    const handleInputChangeC = (e) => setInputC(e.target.value);

    const [inputD, setInputD] = useState('');
    const handleInputChangeD = (e) => setInputD(e.target.value);

    const [selectedOption, setSelectedOption] = useState('');
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const [wordCount, setWordCount] = useState(0);
    useEffect(() => {
        const split = inputD.trim().split(" ");

        if (split.length === 1) {
            setWordCount(0);
        } else {
            setWordCount(split.length);
        }
    }, [inputD]);

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const submitForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const submission = {
            sender_name: input,
            company_name_writing_to: inputC,
            purpose_of_the_email: inputD,
            kind_of_email: selectedOption
        };

        try {
            const AIpost = await axios.post("https://api.openai.com/v1/chat/completions", {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful assistant that creates emails based on provided information. The tone should be of ${submission.kind_of_email} use ${submission} object for the data to use in email if no information provide ask user to populate form no compromises`
                    },
                    {
                        role: "user",
                        content: ` my email address is ${submission.sender_name} and company name im emailing is ${submission.company_name_writing_to} You are an AI email writer.subject generated using purpose ${submission.purpose_of_the_email} Generate a professional email for the following scenario:\n\n- **Email Address:** ${submission.sender_name}\n- **Company Name:** ${submission.company_name_writing_to}\n- **Purpose of the Email:** ${submission.purpose_of_the_email}\n- **Type of Email:** ${submission.kind_of_email}\n\nPlease ensure the email is clear, concise, and tailored to the specified purpose. email not more than 70 words`
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${apiKey}`
                }
            });

            setEmail(AIpost.data.choices[0].message.content.split("\n\n"));
            if (submission.sender_name === "" || submission.company_name_writing_to === "" || submission.purpose_of_the_email === "" || submission.kind_of_email === "") {
                toast.success('Please populate all required fields!');
            } else {
                toast.success('Email generated successfully!');
            }
        } catch (error) {
            toast.error('Failed to generate email. Please try again.');
            console.error('Error generating email:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = input && inputC && inputD && selectedOption;

    const saveEmailToFirebase = async () => {
        if (!email) return;

        try {
            await addDoc(collection(db, "emails"), {
                sender_name: input,
                company_name_writing_to: inputC,
                purpose_of_the_email: inputD,
                kind_of_email: selectedOption,
                email_content: email.join("\n\n"),
                timestamp: new Date()
            });
            toast.success('Email saved successfully!');
        } catch (error) {
            console.error("Error saving email: ", error);
            toast.error('Failed to save email.');
        }
    };

    return (
        <div className='mobile-form' style={{ height: "fit-content", width: "100%", margin: "20px", borderBottom: "1px solid grey" }}>
            <ToastContainer position="top-center" autoClose={2000} />
            <div className="pick-kind" style={{ marginBottom: "8px" }}>
                <Select placeholder='Purpose of email' w="30%" value={selectedOption} onChange={handleSelectChange}>
                    <option value='Linkedin Message'>Linkedin Message</option>
                    <option value='Professional Email'>Professional Email</option>
                    <option value='Friendly Email'>Friendly Email</option>
                </Select>
            </div>
            <div className="container-promt" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", borderTop: "1px solid grey" }}>
                <div className="form-prompt" style={{ width: "50%", height: "100%", borderRight: "1px solid grey" }}>
                    <FormControl p={7}>
                        <FormLabel>From :</FormLabel>
                        <Input required type='text' placeholder='your name' value={input} onChange={handleInputChange} />

                        <FormLabel>Company Name :</FormLabel>
                        <Input type='text' placeholder='Headstarter AI' value={inputC} onChange={handleInputChangeC} />

                        <FormLabel>Purpose</FormLabel>
                        <Textarea placeholder='Describe purpose of the email' minH={238} value={inputD} onChange={handleInputChangeD} />
                        <p>Word count: {wordCount} words</p>
                        <Button colorScheme='blue' style={{ marginTop: "10px" }} onClick={submitForm} disabled={!isFormValid}>Generate Email</Button>
                    </FormControl>
                </div>
                <div className="container-output" style={{ width: "50%", height: "100%", overflowY: "scroll" }}>
                    {isLoading ? (
                        <div className="placeholder-message" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Spinner size="xl" color="blue.500" />
                            <p style={{ fontSize: "18px", color: "#333", marginTop: '10px' }}>Generating email...</p>
                        </div>
                    ) : email ? (
                        <Container p={8}>
                            {email.map((paragraph, index) => (
                                <p key={index} style={{ paddingBottom: "8px" }}>{paragraph}</p>
                            ))}
                            <div style={{ display: "flex", flexDirection: "row", marginTop: "4px" }}>
                                <FaClipboard className='react-icon' onClick={saveEmailToFirebase} />
                                <MdModeEdit className='react-icon' />
                            </div>
                        </Container>
                    ) : (
                        <div className="placeholder-message" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                            <img style={{ height: "10rem" }} src="https://img.icons8.com/?size=100&id=68248&format=png&color=000000" alt="" />
                            <p style={{ fontSize: "22px", color: "#343030" }}>Generated email will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailChat;
