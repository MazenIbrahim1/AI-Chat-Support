"use client"
import { useState } from "react"
import { Box, Button, Stack, TextField } from "@mui/material"

export default function Home() {
  // Messages
  const [messages, setMessages] = useState([
    {role: 'assistant', content: `Hi! I'm the Headstarter support assistant. How can I help you today?`}
  ])

  // Textfield message
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [...messages, {role: 'user', content: message}, {role: 'assistant', content: ''}])
    const response = fetch('api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}])
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''
      return reader.read().then(function processText({done, value}) {
        if(done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        console.log(text)
        setMessages((messages) => {
          let lastMsg = messages[messages.length - 1]
          let otherMsges = messages.slice(0, messages.length - 1)

          return [
            ...otherMsges,
            {...lastMsg, content: lastMsg.content + text}
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

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
          width="500px" 
          height="700px" 
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
          </Stack>
          <Stack direction='row' spacing={2}>
            <TextField 
              label="Message" 
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button 
              variant="contained"
              onClick={sendMessage}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
