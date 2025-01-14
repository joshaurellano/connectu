import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link  } from 'react-router-dom';
import axios from 'axios';

import { API_ENDPOINT } from './Api';
import {
  Nav, Navbar, Container, Button, Form, NavDropdown,
  Row, Col, Card, ListGroup, Modal, InputGroup, Spinner
} from 'react-bootstrap';

import { FaPenToSquare } from "react-icons/fa6";
import Swal from 'sweetalert2';

import {jwtDecode} from 'jwt-decode';

import Cookies from 'js-cookie';

function Post() {
  const [user, setUser] = useState(null);
  const [postLoading, setPostLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { topic_id, subtopic_id, user_id } = location.state || {};



  // Decode user token
  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        const token = Cookies.get('token');
        // const response = JSON.parse(localStorage.getItem('token'));
        // const decodedToken = jwtDecode(response.data.token);
        const decodedToken = jwtDecode(token)
        setUser(decodedToken);
      } catch (error) {
        navigate("/login");
      }
    };
    fetchDecodedUserID();
  }, [navigate]);

  

  // Logout handler
  const handleLogout = async () => {
    try {
      Cookies.remove('token');
      navigate("/login");
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const headers = {
    accept: "application/json",
    Authorization: Cookies.get('token')
  };

  //Create Post

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [validationError,setValidationError] = useState([])

  const addPost = async (e) => {
    setPostLoading(true);
    e.preventDefault();
try{
  await axios.post(`${API_ENDPOINT}/post`,{title,body, user_id, topic_id, subtopic_id},{headers:headers}).then(({data})=>{
    
    console.log(`Topic ID: ${topic_id}`);
    console.log(`Subtopic ID: ${subtopic_id}`);
    console.log(`User ID: ${user_id}`);
    
    setPostLoading(false);
    Swal.fire({
      icon:"success",
      text:data.message
    })
  })
} catch(error) {
    if(error.response.status===422){
      setValidationError(error.response.data.errors)
    }else{
      Swal.fire({
        text: error.response?.data?.message || "An error occurred while creating the post.",
        icon:"error"
      })
    }
  }
}

  return (
    <>
      <Navbar variant="dark" expand="lg" style={{
        backgroundColor: "#1C1C64",
        color: "white",
        display: "flex",
        alignItems: "center"
      }}>
        <Container>
          <Navbar.Brand as={Link} to='/dashboard' style={{ color: "white" }}>Connect U</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0">
              <Nav.Link href='#'>Tell us what you feel</Nav.Link>
              <Nav.Link href='#'>What's New</Nav.Link>
              <Nav.Link href='#'>Chat Us</Nav.Link>
            </Nav>
            <Form className="d-flex ms-auto">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 mt-3"
                aria-label="Search"
                style={{ height: '38px' }}
              />
              <Button variant="outline-success" className='mt-3' style={{
                height: '38px',
              }}>Search</Button>
            </Form>
            <Nav className='ms-lg-3'>
              <NavDropdown
                title={user ? `User: ${user.username}` : 'Dropdown'}
                id="basic-nav-dropdown" align="end">
                <NavDropdown.Item onClick={() => navigate ('/profile')}>Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className='mb-6'>
              <Card className='mt-5' style={{
                height: "6rem",
                textAlign: "center",
                border: "none",
                backgroundColor: "#1C1C64",
                color: "white"
              }}>
                <Card.Body style={{
                  fontSize: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  Post New Thread
                  
                </Card.Body>
              </Card>
            </Container>

        <Container className='mb-6'>
              <Card className='mt-3' style={{
                height: "7rem",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                border: "none",
          
              }}>
                <Card.Body>
                📣 Avoid using all capital letters in your posts; it may be interpreted as shouting. <br />
                🛑 Avoid posting a single smiley or all smileys only, as they may look like spam. <br />
                🗣️ Members can only speak in English or Tagalog.
                  
                </Card.Body>
              </Card>
            </Container>

        <Container className='mb-6'>
              <Card className='mt-3' style={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                border: "none",
                // backgroundColor: "#1C1C64",
                // color: "white"
              }}>
                <Card.Body>
                <div>
                <Form onSubmit={addPost}>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default" style={{ height: "45px", padding: "0.5rem 1rem" }}>
                    Title
                    </InputGroup.Text>
                    <Form.Control
                    className='mb-6' value={title}
                    onChange={(event)=>{setTitle(event.target.value)}} 
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    style={{ height: "45px", 
                      padding: "0.5rem", 
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      }}
                    onFocus={(e) => e.target.style.borderColor = "#1C1C64"}
                    onBlur={(e) => e.target.style.borderColor = "#ccc"}
                    required
                    />
                </InputGroup>
                <Form.Group className="mb-3">
                    <Form.Control as="textarea" 
                    value={body}
                    onChange={(event)=>{setBody(event.target.value)}}
                    style={{
                      height: "500px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "1rem",
                      transition: "border-color 0.3s ease, box-shadow 0.3s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#1C1C64"}
                onBlur={(e) => e.target.style.borderColor = "#ccc"}
               />
                </Form.Group>
                <div>
                  <Button type="submit"
                    style={{
                    borderRadius: "0",
                    padding: "10px 20px",
                    backgroundColor: "#FF8C00",
                    borderColor: "#FF8C00",
                    }}
                    disabled={postLoading}>
                      {postLoading ? (
                        <>
                        <Spinner animation="border" />
                      </>):(
                        <>
                      <FaPenToSquare /> Post
                      </>)}
                    </Button>

                </div>
                </Form>
                </div>
                
                </Card.Body>
              </Card>
            </Container>



      
    </>
  );
}

export default Post;
