// LoginModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';  
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress'; 
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import useAuthStore from '../store/AuthStore';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '500px',
  maxWidth: '800px',
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 10px 50px rgba(0,0,0,0.3)',
}));

const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
});

export default function Login({ onClose, onSwitch }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false); 
  const navigate = useNavigate();

  const setLoginData = useAuthStore((state) => state.setLoginData);

    const validateInputs = () => {
     let errors = {};
     if (!email.match(/\S+@\S+\.\S+/)) errors.email = 'Invalid email format';
     if (password.length < 6) errors.password = 'Password must be at least 6 characters';

     if (Object.keys(errors).length > 0) {
       toast.error("Login failed:\n" + Object.values(errors).join('\n'));
       return false;
     }
     return true;
   };

   const handleSubmit = async (event) => {
     event.preventDefault();
     if (!validateInputs()) return;

     setLoading(true);
     try {
       const response = await axios.post("http://localhost:5000/api/user/login", {
         email,
         password,
       });

       if (response.data.token) {
         toast.success('Login successful! Redirecting...');
         setLoginData(response.data);
         navigate('/');
         onClose();
       } else {
         toast.error(response.data.message || 'Login failed');
       }
     } catch (error) {
       console.error('Login error:', error.response?.data || error.message);
       toast.error(error.response?.data?.message || 'Login failed. Please try again.');
     } finally {
       setLoading(false);
     }
   };
   

  return (
    <Overlay>
      <CssBaseline enableColorScheme />
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card variant="outlined">
          <Typography variant="h4" gutterBottom>
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel>Email</FormLabel>
              <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Password</FormLabel>
              <TextField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
            </FormControl>
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <Button type="submit" fullWidth variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign in'}
            </Button>
            <Link component="button" variant="body2">
              Forgot your password?
            </Link>
          </Box>
          <Divider sx={{ width: '100%', my: 2 }}>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Button fullWidth variant="outlined">Sign in with Google</Button>
            <Button fullWidth variant="outlined">Sign in with Facebook</Button>
            <Typography align="center">
              Don't have an account?{' '}
              <Link component="button" onClick={onSwitch} variant="body2">
                Sign up
              </Link>
            </Typography>
          </Box>
          <Button
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 16,
              fontSize: '1.2rem',
              color: 'gray'
            }}
          >
            ✖
          </Button>
        </Card>
      </motion.div>
    </Overlay>
  );
}
