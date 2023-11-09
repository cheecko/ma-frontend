import { useState } from 'react'
import { AppBar, Toolbar, Box, Menu, MenuItem, Typography, IconButton, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { MdViewModule } from 'react-icons/md'

const Header = () => {
  return (
    <Box>
      <AppBar position='static' sx={{ backgroundColor: '#545454', color: 'white', boxShadow: 'none' }}>
        <Toolbar variant='dense'>
          <Box>
            <Link to={{ pathname: '/' }} style={{ color: 'inherit', textDecoration: 'unset' }} >
              <Button 
                sx={{ display: 'flex', alignItems: 'center', color: 'white', gap: 1 }}
              >
                <MdViewModule />
                <Typography variant='subtitle2' sx={{ display: { xs: 'none', sm: 'block'} }}>
                  SAP Docs Question Answering
                </Typography>
              </Button>
            </Link>
          </Box>
          <Box>
            <Link to={{ pathname: '/qa' }} style={{ color: 'inherit', textDecoration: 'unset' }} >
              <Button 
                sx={{ display: 'flex', alignItems: 'center', color: 'white', gap: 1 }}
              >
                <MdViewModule />
                <Typography variant='subtitle2' sx={{ display: { xs: 'none', sm: 'block'} }}>
                  Document Question Answering
                </Typography>
              </Button>
            </Link>
          </Box>
          <Box>
            <Link to={{ pathname: '/sap-el' }} style={{ color: 'inherit', textDecoration: 'unset' }} >
              <Button 
                sx={{ display: 'flex', alignItems: 'center', color: 'white', gap: 1 }}
              >
                <MdViewModule />
                <Typography variant='subtitle2' sx={{ display: { xs: 'none', sm: 'block'} }}>
                  SAP Docs Entity Linking
                </Typography>
              </Button>
            </Link>
          </Box>
          <Box>
            <Link to={{ pathname: '/el' }} style={{ color: 'inherit', textDecoration: 'unset' }} >
              <Button 
                sx={{ display: 'flex', alignItems: 'center', color: 'white', gap: 1 }}
              >
                <MdViewModule />
                <Typography variant='subtitle2' sx={{ display: { xs: 'none', sm: 'block'} }}>
                  Document Entity Linking
                </Typography>
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header