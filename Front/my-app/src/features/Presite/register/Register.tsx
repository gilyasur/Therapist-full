import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';
import classes from "../register/Register.module.css"
import { selectLogged, loginAsync, selectUserID } from '../login/loginSlice';
import { registerAsync } from './registerSlice';
import { useSelector } from 'react-redux';
import { Anchor, Button, Container, Group, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import {  Typography } from '@mui/material';
import logoImage from "../../../images/DashBoardLogo.jpeg";


export function Register() {
    const logged = useAppSelector(selectLogged);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setfirst_name] = useState("");
    const [last_name, setlast_name] = useState("");
    const [email, setEmail] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const userID = useSelector(selectUserID)
    useEffect(() => {
        if (logged) {
            navigate('/App');
        }
    }, [logged, navigate]);

    const handleRegister = async () => {
        await dispatch(registerAsync({ username, password, first_name, last_name, email }));
        modifyProfile();
    };

    
    const modifyProfile = ()=> {
        dispatch(loginAsync({ username, password }))
        navigate ('/App/profile')  

    }
     const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    
        // Define regular expressions for password validation
        const hasNumber = /\d/.test(newPassword);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        const hasUpperCase = /[A-Z]/.test(newPassword);
    
        // Validate password
        if (
          newPassword.length < 8 ||
          !hasNumber ||
          !hasSpecial ||
          !hasUpperCase
        ) {
          setPasswordError(
            'Password must be at least 8 characters long and contain at least one number, one special character, and one uppercase letter.'
          );
        } else {
          setPasswordError('');
        }
      };

      const handleLogin = () => {
        navigate('/');
      };
    return (
      <div>
          <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
  <Group className={classes.groupContainer} gap="xs">
    <div className={classes.logoContainer}>
      <img
        src={logoImage}
        alt="Logo"
        style={{
          height: "90px",
          borderRadius: "50%",
          border: "1px solid #94b6bf",
        }}
      />
    </div>
    <div className={classes.textContainer}>
      <div className={classes.dmSansCustom}>Therapist DashBoard App</div>
    </div>
  </Group>
</Container>
      </div>
      <div >
         <Container className={classes.formRegister} size={420} my={40} style={{backgroundColor:"#feedd3"}}>
         <Title ta="center" className={classes.title}>
                Please fill all of the fields
            </Title>
      <Paper variant="outlined" style={{ p: 4, mt: 4, borderRadius: 'md', backgroundColor:"#feedd3" }}>
      {passwordError && <Typography color="error" mb={2}>{passwordError}</Typography>}
      <TextInput
  label="Username"
  placeholder="Username"
  required
  value={username}
  onChange={(event) => {
    const newValue = event.target.value.replace(/\s/g, '');
    setUserName(newValue);
  }}
/>

      <PasswordInput
        label="Password"
        placeholder="Your password"
        required

        mt={2}
        value={password}
        onChange={handlePasswordChange}
      />
      <TextInput
        label="First Name"
        placeholder="Your first name"
        required


        value={first_name}
        onChange={(event) => setfirst_name(event.target.value)}
      />
      <TextInput
        label="Last Name"
        placeholder="Your last name"
        required


        value={last_name}
        onChange={(event) => setlast_name(event.target.value)}
      />
      <TextInput
        label="Email"
        placeholder="Your email"
        type="email"
        required


        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button fullWidth mt={3} variant="contained" onClick={handleRegister}>Register</Button>
      <Anchor size="md" component="button" onClick={handleLogin}>
        Have an Account?
      </Anchor>
    </Paper>
    </Container>
      </div>
      </div>

    );
}
