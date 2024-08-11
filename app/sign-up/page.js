"use client"
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import { Login } from '@mui/icons-material';

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
        const res = await createUserWithEmailAndPassword(email, password)
        if (res?.user) {
          console.log({res})
          sessionStorage.setItem('user', true)
          router.push('/dashboard')
          setEmail('')
          setPassword('')
        } else {
          throw new Error('Authentication failed!');
        }        
    } catch(e) {
        setError("*Something went wrong*")
        setTimeout(() => {
          setError('')
        }, 2000)
    }
  };

  return (
    <>
      <Header Button={<Button 
      variant="contained" 
      sx={{
        backgroundColor: '#0fa4af',
        '&:hover': {
          backgroundColor: '#0C7E87'
        }
      }}
      onClick={
          () => {
            router.push('/')
        }} startIcon={<Login />}>Sign in</Button>
      }/>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100vw"
        minHeight="95vh"
        bgcolor='#024950'
        gap={1.5}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="50vw"
          height='60vh'
          border="1px solid #333"
          borderRadius='16px'
          boxShadow={4}
          bgcolor='#003135'
          padding={2}
        >
          <Typography variant="h4" component="h1" gutterBottom color='white'>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email}
              sx={{
                input: {
                  color: 'white',
                  backgroundColor: '#024950'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0C7E87',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0fa4af',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                }
              }}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              fullWidth
              value={password}
              sx={{
                input: {
                  color: 'white',
                  backgroundColor: '#024950'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0C7E87',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0fa4af',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                }
              }}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Typography variant="h7" color='#F35773'>
              {error}
            </Typography>
            <Box marginTop={2}>
              <Button 
                type="submit" 
                variant="contained" 
                sx={{
                  backgroundColor: '#0fa4af',
                  '&:hover': {
                    backgroundColor: '#0C7E87'
                  }
                }}
                fullWidth>
                Sign Up
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}