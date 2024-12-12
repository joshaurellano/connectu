import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_ENDPOINT } from './Api';
import { Nav,Navbar,Container,Button,Form, NavDropdown, NavbarBrand, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

function ForgotPass () {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDecodedUserID = async () => {
            try {
                const response = JSON.parse(sessionStorage.getItem('token'))
                setUser(response.data);

                const decoded_token = jwtDecode(response.data.token);
                setUser(decoded_token);
                sessionStorage.removeItem('token');
            } catch (error) {
                navigate ("/login");
            }
        };
    fetchDecodedUserID ();
    }, []);

    const handleVerifyOTP = async () => {
        try {
            const response = await axios.post(`${API_ENDPOINT}/otp/verify`, {
                email,
                otpInput
            });

            sessionStorage.removeItem('token');
            navigate("/login");
        } catch (error) {
            setError(error);
        }
    };
    return (
    <>
        <div>
        <Navbar variant="dark" expand="lg" style={{backgroundColor:"#1C1C64", 
            color:"white",
            display:"flex",
            alignItems:"center"
            }}>
            <Container>
                <Navbar.Brand href = "#home" style={{color:"white"}}>Connect U</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />  
            <Navbar.Collapse id = "navbarScroll">
            <Nav className="me-auto my-2 my-lg-0">
                <Nav.Link href='#'>Tell us what you feel</Nav.Link>
                <Nav.Link  href='#'>Whats New</Nav.Link>
                <Nav.Link  href='#'>Chat Us</Nav.Link>
                </Nav>
                    
                <Form inline className="d-flex ms-auto">
                    <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2 mt-3"
                    aria-label="Search"
                    style={{ height: '38px' }}
                    />
                    <Button variant="outline-success" className='mt-3' style={{
                        height: '38px',}}>Search</Button>
                </Form>

                {/* <Nav className='ms-lg-3'>
                <NavDropdown title={user ? `User: ${user.username}`:'Dropdown'} 
                        id="basic-nav-dropdown"align="end">
                        <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                        <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                        <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
                </Nav> */}
                </Navbar.Collapse>
            
            </Container>
        </Navbar>

       
        </div>

        <div>
        <Container>
            <Form>
            <Form.Group className="mb-3">
                <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ borderRadius: "8px" }}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
                    type="OTP"
                    placeholder="otp"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    style={{ borderRadius: "8px" }}
                    required
                />
            </Form.Group>
            <Button variant='Primary' className='w-100' onClick={handleVerifyOTP}>Submit</Button>
            </Form>
        
            </Container>
        </div>
        
    </> 
    )
}
export default ForgotPass