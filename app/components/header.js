"use client"
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../public/logo.png'
import { AppBar, Toolbar, Box } from '@mui/material';

const Header = (props) => {
  const router = useRouter()
  
  return (
    <>
      <AppBar
        style={{
          position: 'sticky',
          backgroundColor: '#003135',
          width: '100vw',
          top: 0,
          left: 0
        }}
      >
        <Toolbar>
          <Box 
            display="flex" 
            flexDirection="row" 
            alignItems="center" 
            flexGrow={1}
          >
            <Image src={logo} alt="AI Chat Support Logo" width={220} height={60}/>
          </Box>
          <Box 
            display="flex" 
            flexDirection="row" 
            alignItems="center"
          >
            {props.Button}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header