import { AppBar, Box, Button, Toolbar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function NavItems() {
    const navItems = [{route:"/",name:'SignIn'}, {route:"./login",name:'Login'}];
    //   const navigate = useNavigate();

  return (
    <div >
        <AppBar component="nav">
        <Toolbar>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
        {navItems.map((item,index) => (
          <Button
            key={index}
            sx={{ color: "#fff" }}
            href={item.route}
          >
            {item.name}
          </Button>
        ))}
      </Box>
        </Toolbar>
      </AppBar>
      
    </div>
  );
}

export default NavItems;
