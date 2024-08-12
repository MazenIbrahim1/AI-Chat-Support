"use client"
import { useState, useRef, useEffect } from "react"
import { Box, Button, Stack, TextField, Modal } from "@mui/material"
import ReactMarkdown from 'react-markdown'
import SendIcon from '@mui/icons-material/Send'
import { Logout } from "@mui/icons-material"
import RateReviewIcon from '@mui/icons-material/RateReview';
import Header from "./components/header"
import FeedbackModal from "./components/feedbackModal"

export default function Home() {
  // State for Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // When to show feedback button
  const [isFeedbackButton, setIsFeedbackButton] = useState(false);

  // Messages
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm the Headstarter support assistant. How can I help you today?` }
  ])

  // Textfield message
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  var enoughMessages = 3;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmitFeedback = (feedbackData) => {
    console.log('Feedback Data:', feedbackData);
    // gotta add feedback to firebase
    handleCloseModal();
  };

  const handleOpenFeedbackButton = () => {
    setIsFeedbackButton(true);
  };

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
    if (messages.length === enoughMessages) { // check here as it's pre-update count
      setMessages(messages => [
        ...messages,
        { role: 'assistant', content: 'We have been talking for a while. Please feel free to leave a feedback using the button under the logout button.' }
      ]);
      handleOpenFeedbackButton();
      handleOpenModal();
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
              // FUNCTIONALITY STILL REQUIRED
              console.log('Logging out')
            }} startIcon={<Logout />}>Logout</Button>
      } />
      <Box
        width='100vw'
        height='100vh'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        bgcolor='#024950'
      >
        {isFeedbackButton && (<Box width="90vw" display={"flex"} justifyContent={"flex-end"}>
          <Button
            variant="contained"
            onClick={handleOpenModal}
            disabled={isLoading}
            startIcon={<RateReviewIcon />}
            sx={{
              backgroundColor: '#0fa4af',
              '&:hover': {
                backgroundColor: '#0C7E87'
              },
              mb: 2
            }}
          >
            Leave Feedback
          </Button>
        </Box>)}
        <Stack
          direction='column'
          width="90vw"
          height="85vh"
          border='1px solid black'
          borderRadius='16px'
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
                  color: 'black',
                }
              }}
              style={{

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
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </Stack>
        </Stack>
      </Box>
      {isModalOpen && !isLoading && (
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </>
  )
}
