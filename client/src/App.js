import React, { useState } from 'react';
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CssBaseline,
  IconButton,
  Toolbar,
  AppBar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StudentsTab from './StudentsTab';
import SubjectsTab from './SubjectsTab';

const drawerWidth = 240;

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
    setMobileOpen(false); // Close drawer on mobile when tab is selected
  };

  const drawerContent = (
    <Box sx={{ backgroundColor: '#000', height: '100%', color: '#fff' }}>
      <Box p={2}>
        <Typography variant="h6" noWrap>
          Student Grading
        </Typography>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={activeTab === 0}
            onClick={() => handleTabChange(0)}
            sx={{
              backgroundColor: activeTab === 0 ? '#333' : 'inherit',
              '&.Mui-selected': { backgroundColor: '#333', color: '#fff', fontWeight: 'bold' },
            }}
          >
            <ListItemText primary="Students" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={activeTab === 1}
            onClick={() => handleTabChange(1)}
            sx={{
              backgroundColor: activeTab === 1 ? '#333' : 'inherit',
              '&.Mui-selected': { backgroundColor: '#333', color: '#fff', fontWeight: 'bold' },
            }}
          >
            <ListItemText primary="Subjects" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar for Mobile Drawer Toggle */}
      <AppBar
        position="fixed"
        sx={{
          display: { sm: 'none' },
          backgroundColor: '#000',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
          Student Grading
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Permanent Drawer for Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Temporary Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    overflow: 'auto', // Ensure content can scroll if it exceeds viewport height
    height: '100vh',  // Make sure it takes up full height
    '@media (max-width:600px)': {
      padding: 2, // Adjust padding for smaller screens if needed
    }
  }}
>
  {/* Spacer for mobile AppBar */}
  <Toolbar />
  <TabPanel value={activeTab} index={0}>
    <StudentsTab />
  </TabPanel>
  <TabPanel value={activeTab} index={1}>
    <SubjectsTab />
  </TabPanel>
  <footer>
    <text>Designed and Developed By Mohamed Ibrahim</text>
  </footer>
</Box>

      
    </Box>
  );
};

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && (
      <Box p={3}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

export default App;
