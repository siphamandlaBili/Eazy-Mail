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
import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore"; 

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const EmailChat = () => {
    const [input, setInput] = useState('');
    const [inputC, setInputC] = useState('');
    const [inputD, setInputD] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [email, setEmail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmail, setEditedEmail] = useState("");

    const handleInputChange = (e) => setInput(e.target.value);
    const handleInputChangeC = (e) => setInputC(e.target.value);
    const handleInputChangeD = (e) => setInputD(e.target.value);
    const handleSelectChange = (event) => setSelectedOption(event.target.value);

    useEffect(() => {
        const words = inputD.trim().split(/\s+/);
        setWordCount(words[0] === '' ? 0 : words.length);
    }, [inputD]);

    const submitForm = async (e) => {
        e.preventDefault();
        
        if (!input || !inputC || !inputD || !selectedOption) {
            toast.error('Please populate all required fields!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("https://api.openai.com/v1/chat/completions", {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful assistant that creates emails. Tone: ${selectedOption}.`
                    },
                    {
                        role: "user",
                        content: `Generate email:
                        - Sender: ${input}
                        - Company: ${inputC}
                        - Purpose: ${inputD}
                        - Tone: ${selectedOption}
                        Keep under 70 words.`
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            setEmail(response.data.choices[0].message.content.split("\n\n"));
            toast.success('Email generated successfully!');
        } catch (error) {
            toast.error('Failed to generate email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const saveEmailToFirebase = async () => {
        if (!email.length) return;

        try {
            await navigator.clipboard.writeText(email.join("\n\n"));
            await addDoc(collection(db, "emails"), {
                sender_name: input,
                company_name_writing_to: inputC,
                purpose_of_the_email: inputD,
                kind_of_email: selectedOption,
                email_content: email.join("\n\n"),
                timestamp: new Date()
            });
            toast.success('Email copied and saved successfully!');
        } catch (error) {
            toast.error('Failed to save email.');
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedEmail(email.join("\n\n"));
    };

    const handleSaveEdit = () => {
        setIsEditing(false);
        setEmail(editedEmail.split("\n\n"));
        toast.success("Email updated successfully!");
    };

    const isFormValid = input && inputC && inputD && selectedOption;

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
                        <Button colorScheme='blue' style={{ marginTop: "10px" }} onClick={submitForm} disabled={!isFormValid || isLoading}>
                            {isLoading ? <Spinner size="sm" /> : 'Generate Email'}
                        </Button>
                    </FormControl>
                </div>
                <div className="container-output" style={{ width: "50%", height: "100%", overflowY: "scroll" }}>
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Spinner size="xl" color="blue.500" />
                            <p style={{ fontSize: "18px", color: "#333", marginTop: '10px' }}>Generating email...</p>
                        </div>
                    ) : email.length > 0 ? (
                        <Container p={8}>
                            {isEditing ? (
                                <Textarea
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    minH={238}
                                />
                            ) : (
                                email.map((paragraph, index) => (
                                    <p key={index} style={{ paddingBottom: "8px" }}>{paragraph}</p>
                                ))
                            )}
                            <div style={{ display: "flex", flexDirection: "row", marginTop: "4px" }}>
                                {isEditing ? (
                                    <Button colorScheme="green" onClick={handleSaveEdit}>Save</Button>
                                ) : (
                                    <MdModeEdit className='react-icon' onClick={handleEditClick} />
                                )}
                                <FaClipboard className='react-icon' onClick={saveEmailToFirebase} />
                            </div>
                        </Container>
                    ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
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