import React, { useState } from 'react';
import { Button, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useDispatch } from 'react-redux';
import { forgotPass } from '../login/loginSlice';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ForgotPass = () => {
    const [forgotPassword, { open: openForgotPassword, close: closeForgotPassword }] = useDisclosure(false);
    const dispatch = useDispatch();
    const [forgottenUsername, setForgottenUsername] = useState('');

    const handleForgot = async () => {
        try {
            await dispatch(forgotPass({ username: forgottenUsername }) as any);
            


            closeForgotPassword(); 
            
        } catch (error) {
            console.error('Failed to send password reset request:', error);

        }
    };

    return (
        <div>
            <Button onClick={openForgotPassword} color="#2F4858" size="xs" radius="xl" variant="light">
                Forgot Your Password?
            </Button>
            <Modal opened={forgotPassword} onClose={closeForgotPassword} withCloseButton={false}>
                <div>
                    <TextInput
                        label="Enter your username"
                        value={forgottenUsername}
                        onChange={(e) => setForgottenUsername(e.currentTarget.value)}
                    />
                    <Button
                        style={{
                            border: 'none',
                            background: '#F5EEE6',
                            color: '#2F4858',
                            cursor: 'pointer',
                            marginLeft: '0',
                        }}
                        onClick={handleForgot}
                    >
                        Submit
                    </Button>
                </div>
            </Modal>
            <ToastContainer />

        </div>
    );
};

export default ForgotPass;
