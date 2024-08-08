"use client"
import { useState, useRef, useEffect } from "react"
import { Box, Button, Stack, TextField } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';

export default function Home() {
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
    scrollToBottom()
  }, [messages])

  return (
    <>
      <Box
        width='100vw'
        height='100vh'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Stack 
          direction='column' 
          width="90vw" 
          height="90vh" 
          border='1px solid black' 
          p={2}
          spacing={2}
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
                    bgcolor={msg.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                    color='white'
                    borderRadius={16}
                    p={3}
                  >
                    {msg.content}
                  </Box>
                </Box>
              ))
            }
            <div ref={messagesEndRef} />
          </Stack>
          <Stack direction='row' spacing={2}>
            <TextField 
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
            >
              {isLoading? 'Sending...' : 'Send'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
