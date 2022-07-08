import React from 'react'
import "./App.css";
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";import Routes from './routes';
import NavItems from './navItems.tsx';


function App() {
    return (
    <div>
      <NavItems/>
      <Routes/>
    </div>
  );
}

export default App;
