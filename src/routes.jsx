import React from 'react';
import TestProject from './test/testProject.tsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './test/login.tsx';
import SignIn from './test/signIn.tsx';

function RoutesComponent() {
  return (
    <div>
        <Router>
            <Routes>
              <Route exact path="/" element={<SignIn />} />{" "}
              <Route exact path='/login' element={<Login />}/>{" "}
              <Route exact path="/TestProject" element={<TestProject />} />{" "}
            </Routes>{" "}
        </Router>
    </div>
  )
}

export default RoutesComponent