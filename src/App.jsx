import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";
import { jwtDecode } from 'jwt-decode';
import Login from './Login';
import Dashboard from './Dashboard';
import ForgotPass from './ForgotPass';
import Post from './Post';
import Profile from './Profile';
import ViewPost from './ViewPost'
import { API_ENDPOINT } from './Api';
import { Row, Col } from 'react-bootstrap';


function App() {

    return (
        <>
        <Router>
        <Routes>
            <Route path = "/" element={<Login />} />
            <Route path = "/login" element = {<Login />}/>
            <Route path = "/dashboard" element = {<Dashboard />}/>
            <Route path = "/otp-verify" element = {<ForgotPass />}/>
            <Route path = "/post" element = {<Post />}/>
            <Route path = "/profile" element = {<Profile />}/>
            <Route path = "/viewpost" element = {<ViewPost />}/>

        </Routes>
        </Router>
        </>
    )
}

export default App