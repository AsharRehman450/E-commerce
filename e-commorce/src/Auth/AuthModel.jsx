import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import Login from '../Auth/Login';
import SignUp from '../Auth/Signup';

const AuthModal = ({ open, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSwitch = () => setIsLoginView(!isLoginView);

  return (
    <Modal open={open} onClose={onClose}>
     
        {isLoginView ? (
          <Login onClose={onClose} onSwitch={handleSwitch} />
        ) : (
          <SignUp onClose={onClose} onSwitch={handleSwitch} />
        )}
      {/* </Box> */}
    </Modal>
  );
};

export default AuthModal;
