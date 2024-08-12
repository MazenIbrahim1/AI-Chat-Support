"use client"
import { useState, useRef, useEffect } from "react"
import { Box, Button, Stack, TextField } from "@mui/material"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import ReactMarkdown from 'react-markdown'
import SendIcon from '@mui/icons-material/Send'
import { Logout } from "@mui/icons-material"
import Header from "../components/header"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  // User
  const [user] = useAuthState(auth)
  const router = useRouter()

  if (typeof window !== 'undefined') {
    const userSession = sessionStorage.getItem('user')
    if(!user && !userSession) {
      router.push('/')
    }
  }

  // Messages
  const [messages, setMessages] = useState([
    {role: 'assistant', content: `Hi! I'm the Headstarter support assistant. How can I help you today?`}
  ])

  // Textfield message
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    // Dont send empty messages
    if (!message.trim() || isLoading) return;

    setIsLoading(true)
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)

    // Add messages to database
    
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if(!user) {
      router.push('/')
    }
    scrollToBottom()
  }, [messages])

  return (
    <>
      <Header Button={
        <Button 
          sx={{
            backgroundColor: '#0fa4af',
            '&:hover': {
              backgroundColor: '#0C7E87'
            }
          }}
          variant="contained" 
          onClick={
          () => {
            signOut(auth)
            sessionStorage.removeItem('user')
        }} startIcon={<Logout />}>Logout</Button>
      }/>
      <Box
        width='100vw'
        height='100vh'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        bgcolor='#024950'
      >
        <Stack 
          direction='column' 
          width="90vw" 
          height="90vh" 
          border='1px solid black' 
          borderRadius='16px'
          p={2}
          spacing={2}
          overflow='auto'
        >
          <Stack 
            direction='column' 
            spacing={2} 
            flexGrow={1}
            maxHeight='100%'
            overflow='auto'
          >
            {
              messages.map((msg, index) => (
                <Box
                  key={index}
                  display='flex'
                  justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
                >
                  <Box
                    bgcolor={msg.role === 'assistant' ? '#003135' : '#0fa4af'}
                    color='white'
                    borderRadius={16}
                    p={3}
                    lineHeight={2}
                  >
                    {msg.role === 'assistant' ? 
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                      :
                      msg.content
                    }
                  </Box>
                </Box>
              ))
            }
            <div ref={messagesEndRef} />
          </Stack>
          <Stack direction='row' spacing={2}>
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
              label="Message" 
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              autoComplete="off"
            />
            <Button 
              variant="contained"
              onClick={sendMessage}
              disabled={isLoading}
              startIcon={<SendIcon />}
              sx={{
                backgroundColor: '#0fa4af',
                '&:hover': {
                  backgroundColor: '#0C7E87'
                }
              }}
            >
              {isLoading? 'Sending...' : 'Send'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}