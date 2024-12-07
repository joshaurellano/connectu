import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_ENDPOINT } from './Api';
import { Nav,Navbar,Container,Button,Form, NavDropdown, NavbarBrand, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

function Dashboard () {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDecodedUserID = async () => {
            try {
                const response = JSON.parse(localStorage.getItem('token'))
                setUser(response.data);

                const decoded_token = jwtDecode(response.data.token);
                setUser(decoded_token);
            } catch (error) {
                navigate ("/login");
            }
        };
    fetchDecodedUserID ();
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            navigate("/login");
        } catch (error) {
            console.error('Logout failed',error);
        }
    };
    return (
    <>
        <div>
        <Navbar variant="dark" expand="lg" className="py-3" style={{backgroundColor:"#1C1C64", color:"white"}}>
            <Container>
                <Navbar.Brand href = "#home" style={{color:"white"}}>Connect U</Navbar.Brand>
                
            <Navbar.Toggle aria-controls="navbar-content" />  
            <Navbar.Collapse id = "navbar-content">
                <Nav className = "ms-auto">

                    <Nav.Link href='#'>Tell us what you feel</Nav.Link>
                    <Nav.Link  href='#'>Whats New</Nav.Link>
                    <Nav.Link  href='#'>Chat Us</Nav.Link>
                </Nav>
                    <Form className="d-flex my-2 my-lg-0">
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        />
                    <Button variant="outline-light">Search</Button>
                    </Form>

                <Nav className='ms-lg-3'>
                <NavDropdown title={user ? `User: ${user.username}`:'Dropdown'} 
                        id="basic-nav-dropdown"align="end">
                        <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                        <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                        <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
                </Nav>
            </Navbar.Collapse>
            
            </Container>
        </Navbar>

       
        </div>
        <div>
        <Container className='mt-3 mb-6'>
        <Card style={{ height: "6rem", 
            textAlign: "center",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            border: "none",
            backgroundColor:"#1C1C64", color:"white"}}>

        <Card.Body style={{fontSize: "1.5rem", display: "flex",justifyContent: "space-between", alignItems: "center"}}>Trending Topics
        <div style={{display: "flex", gap: "10px"}} >
        <Button style={{ borderRadius: "0", padding: "10px 20px", backgroundColor:"#4CAF50", borderColor:"#4CAF50" }}>New Posts</Button>
        <Button style={{ borderRadius: "0", padding: "10px 20px", backgroundColor:"#FF8C00", borderColor:"#FF8C00"}}>Post New Thread</Button>
        </div>
        </Card.Body>
    
        </Card>
        </Container>

        <div>
            <Container>
                <Row style={{marginTop:"30px"}}>
                    <Col lg={9}>
                    <Card>
                    <Card.Body>
                    <Card.Header>
                    <Card.Title>Announcements</Card.Title>
                    </Card.Header>
                    </Card.Body>
                    </Card>
                    <Card className='mt-3'>
                    <Card.Body>
                    <Card.Header>
                    <Card.Title>General Topics</Card.Title>
                    </Card.Header>
                    </Card.Body>
                    </Card>
                    <Card className='mt-3'>
                    <Card.Body>
                    <Card.Header>
                    <Card.Title>Academics</Card.Title>
                    </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Study Tips and Tricks</ListGroup.Item>
                            <ListGroup.Item>Homework Help & Resources</ListGroup.Item>
                            <ListGroup.Item>Career Guidance & Internship Opportunities</ListGroup.Item>
                            <ListGroup.Item>Scholarships & Financial Aid</ListGroup.Item>
                            <ListGroup.Item>College Application Tips</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    </Card>
                    <Card className='mt-3'>
                    <Card.Body>
                    <Card.Header>
                    <Card.Title>Social & Lifestyle</Card.Title>
                    </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Campus Life</ListGroup.Item>
                            <ListGroup.Item>Mental Health & Well-being</ListGroup.Item>
                            <ListGroup.Item>Socializing & Networking</ListGroup.Item>
                            <ListGroup.Item>Roommates & Living Arrangements</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    </Card>
                    <Card className='mt-3'>
                    <Card.Body>
                    <Card.Header>
                    <Card.Title>Fun & Creative</Card.Title>
                    </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Student-Generated Content</ListGroup.Item>
                            <ListGroup.Item>Student Travel Tips</ListGroup.Item>
                            <ListGroup.Item>Student Humor & Memes</ListGroup.Item>
                            <ListGroup.Item>Video Games & Entertainment</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    </Card>
                    <Card className='mt-3'>
                    <Card.Body>
                    <Card.Header>
                    <Card.Title>Technology & Innovation</Card.Title>
                    </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Tech Gadgets for Students</ListGroup.Item>
                            <ListGroup.Item>Coding & Software Development</ListGroup.Item>
                            <ListGroup.Item>Innovation in Education</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    </Card>
                    <Card className='mt-3'>
                    <Card.Body>
                    <Card.Header>
                    <Card.Title>Open Discussions</Card.Title>
                    </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Debate and Opinions</ListGroup.Item>
                            <ListGroup.Item>Book, Movie, and Music Discussions</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    </Card>
                    </Col>
                    <Col lg={3}>
                    <Card>
                    <Card.Body>
                    <Card.Header>
                    <Card.Title>New Topics</Card.Title>
                    </Card.Header>

                    </Card.Body>
                    </Card>

                    <Card className='mt-5'>
                    <Card.Body>
                    <Card.Header>
                    <Card.Title>Page Statistics</Card.Title>
                    </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Total Members</ListGroup.Item>
                            <ListGroup.Item>Total Online Users</ListGroup.Item>
                            <ListGroup.Item>Visitors</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    </Card>
                    </Col>
                </Row>
            </Container>
        </div>
        </div>
        
    </> 
    )
}
export default Dashboard