"use client"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import Header from "./components/header"
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./firebase";

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)

  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const res = await signInWithEmailAndPassword(email, password)
      if (res?.user) {
        sessionStorage.setItem('user', true);
        setEmail('');
        setPassword('');
        router.push('/dashboard');
      } else {
        throw new Error('Authentication failed!');
      }    
    } catch (err) {
      console.log(err)
      setError('*Incorrect Email or Password*')
      setTimeout(() => {
        setError('')
      }, 2000)
    }
  }

  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100vw"
        minHeight="95vh"
        bgcolor='#024950'
        gap={2}
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
            Sign In
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
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
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0fa4af',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                }
              }}
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
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
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0fa4af',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                }
              }}
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              fullWidth
              autoComplete="off"
              value={password}
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
                fullWidth
              >
                Sign In
              </Button>
            </Box>
          </form>
            <Box marginTop={2} width='100%' display='flex' flexDirection='row' alignItems='center' justifyContent='center' gap={3}>
              <Typography variant='h5' color='white'>
                Don't have an account?
              </Typography>
              <Button 
                variant="contained" 
                sx={{
                  backgroundColor: '#0fa4af',
                  '&:hover': {
                    backgroundColor: '#0C7E87'
                  }
                }}                
                onClick={() => router.push('/sign-up')}>
                Sign Up
              </Button>
            </Box>
        </Box>
      </Box>
    </>
  )
}
