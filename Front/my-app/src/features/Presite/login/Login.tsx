import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Group, Anchor } from '@mantine/core';
import { loginAsync, selectLogged, selectError } from './loginSlice'; 
import ForgotPass from '../forgotPass/ForgotPass';

export function Login() {
    const logged = useAppSelector(selectLogged);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const error = useAppSelector(selectError); 
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (logged) {
            navigate('/App/Profile');
        }
    }, [logged, navigate]);

    const handleLogin = () => {
        dispatch(loginAsync({ username, password }));
    };

    const handleKeyPress = (event:any) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };
    
    return (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{backgroundColor:"#feedd3"}}>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>} 
            <TextInput
                label="Username"
                placeholder="Username"
                required
                value={username}
                onChange={(event) => setUserName(event.currentTarget.value)}
                onKeyPress={handleKeyPress}
            />
            <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                onKeyPress={handleKeyPress}
            />
            <Group justify="space-between" mt="lg">
                <Anchor component="button" size="sm">
                    <ForgotPass></ForgotPass>
                </Anchor>
            </Group>
            <Button fullWidth mt="xl" onClick={handleLogin}>
                Sign in
            </Button>
        </Paper>
    );
}
