import React, { useEffect, useState } from 'react';
import { Button,  TextInput } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { resetPass } from '../login/loginSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch } from '../../../app/store';

const ResetPass = () => {
  const dispatch: AppDispatch = useDispatch();
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { userName = '', userID = '' } = useParams();
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    setNewPassword(password);
    setIsPasswordValid(passwordRegex.test(password));
  };

  const handleReset = async () => {
    try {
      if (isPasswordValid) {
        await dispatch(resetPass({ username: userName, id: parseInt(userID), new_password: newPassword }));
        console.log('Password reset successfully');
        navigate('/');
      } else {
        console.error('Password does not meet the requirements');
      }
    } catch (error) {
      console.error('Failed to send password reset request:', error);
    }
  };

  useEffect(() => {
    console.log(userID);
    console.log(userName);
  }, [userName, userID]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh', flexDirection: 'column' }}>
        Hello {userName}
        <TextInput
         
          description={
            <div>
              <p>It must meet the following requirements:</p>
              <ul>
                <li>At least 8 characters</li>
                <li>One special character (!@#$%^&*)</li>
                <li>One digit</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
              </ul>
            </div>
          }
          label="Please Choose your new Password"
          value={newPassword}
          onChange={handlePasswordChange}
          error={!isPasswordValid && newPassword.length > 0 ? 'Password does not meet the requirements' : null}
        />

        <Button onClick={handleReset} color="#2F4858" disabled={!isPasswordValid}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ResetPass;