import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

import { API_ENDPOINT } from './Api';
import {
  Nav, Navbar, Container, Button, Form, NavDropdown,
  Card, ListGroup, Row, Col
} from 'react-bootstrap';

import { FaReply } from "react-icons/fa";

import Swal from 'sweetalert2';



function ViewPost() {
  const [user, setUser] = useState({ userId: null, username: 'Guest' });
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState([]);

  const [users, setUsers] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { post_id } = location.state || {};

  const headers = {
    accept: "application/json",
    Authorization: JSON.parse(localStorage.getItem('token')).data.token
  };


  // Decode user token and set user state
  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem('token'));
        const decodedToken = jwtDecode(tokenData.data.token);
        setUser({ userId: decodedToken.user_id, username: decodedToken.username });
      } catch (error) {
        console.error('Token decoding failed:', error);
        navigate("/login");
      }
    };
    fetchDecodedUserID();
  }, [navigate]);

  // Fetch user posts
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!post_id || !user.userId) return;
      try {
        const { data } = await axios.get(`${API_ENDPOINT}/post/${post_id}`, { headers });
        console.log("Post data:", data);

        setPost(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
  
    fetchPost();
  }, [post_id, user.userId]); 

  // // Fetch Comments
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const { data } = await axios.get(`${API_ENDPOINT}/comment/${post_id}`, { headers });
        setComment(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
  
    fetchComment();
  }, [post_id]); 

   //Create Comment
  
   const [comment_body, setComment_Body] = useState('');
   const [validationError,setValidationError] = useState([])
 
   const addComment = async (e) => {
    e.preventDefault();
  
    try {
      const payload = {
        post_id: Number(post_id), // Explicitly convert post_id to a number
        body: comment_body,
        user_id: Number(user.userId), // Explicitly convert user.userId to a number
      };
  
      const response = await axios.post(`${API_ENDPOINT}/comment`, payload, { headers });
  
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          text: response.data.message,
        });
  
        // Clear the input and re-fetch comments
        setComment_Body(""); // Clear the comment body
        const { data } = await axios.get(`${API_ENDPOINT}/comment/${post_id}`, { headers });
        setComment(data); // Refresh the comments list
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      Swal.fire({
        text: "Failed to add comment. Please try again.",
        icon: "error",
      });
    }
  };
  
  

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  return (
    <>
      <Navbar className='mb-6' variant="dark" expand="lg" style={{ backgroundColor: "#1C1C64", color: "white" }}>
        <Container>
          <Navbar.Brand as={Link} to='/dashboard'style={{ color: "white" }}>Connect U</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              <Nav.Link href="#">Tell us what you feel</Nav.Link>
              <Nav.Link href="#">What's New</Nav.Link>
              <Nav.Link href="#">Chat Us</Nav.Link>
            </Nav>
            <Form className="d-flex ms-auto">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 mt-3"
                style={{ height: '38px' }}
              />
              <Button variant="outline-success" className="mt-3" style={{ height: '38px' }}>
                Search
              </Button>
            </Form>
            <Nav className="ms-lg-3">
              <NavDropdown
                title={user?.username ? `User: ${user.username}` : 'Guest'}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={() => navigate ('/profile')}>Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Title Card */}

      <div className="mb-6">
          <Container className='mt-6' style={{marginTop:"30px"}}>
          {
          post && post.length > 0 ? (
                          post.map((p) => (
                            <div key = {p.post_id}>
                              <Card className="mt-6" style={{
                              height: "6rem",
                              border: "none",
                              backgroundColor: "#1C1C64",
                              color: "white"}}>
                                <Card.Body >
                                <Container>
                                <Row style={{
                                fontSize: "2rem", 
                                display: "flex",
                              }}>
                                  {p.title}
                                  </Row>
                                  <Row>
                                    <p>by {user.username}</p>
                                  </Row>
                                  </Container>

                                </Card.Body>
                              </Card>

                              <Card className="mt-5 mb-6" 
                              style={{
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                              border: "none",
                              minHeight:"300px"}}>
                                <Card.Body style={{display: "flex"}}>
                                  {p.body}
                                </Card.Body>
                              </Card>
                            </div>
                          ))
                        ) : (
                          <p>No posts found.</p>
                        )

          }

       </Container>

       <Container style={{marginTop:"30px"}}> 
       {
          comment && comment.length > 0 ? (
            comment.map((c) => (
                            <div key = {c.comment_id}>
                              <Card className="mt-6" style={{ marginBottom:"30px"}}>
                                <Card.Body >
                                  <ListGroup>
                                    <ListGroup.Item variant="secondary">{c.username}</ListGroup.Item>
                                  <ListGroup.Item>{c.body}</ListGroup.Item>
                                  <ListGroup.Item>{new Date(c.created_at).toLocaleString()}</ListGroup.Item>
                                  </ListGroup>
                                </Card.Body>
                              </Card>
                            </div>
                          ))
                        ) : (
                          <p>No comment found. Be the first one</p>
                        )

          }
       </Container>

        {/* Comment Box */}

       <Container>
        <Card className='mt-6'>
        <Card.Body>
                <div>
                <Form onSubmit={addComment}>
                <Form.Group className="mb-3">
                    <Form.Control as="textarea" 
                    value={comment_body}
                    onChange={(event)=>{setComment_Body(event.target.value)}}
                    style={{
                      height: "200px",
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
                    }}> <FaReply /> Reply</Button>

                </div>
                </Form>
                </div>
                
                </Card.Body>
        </Card>
       </Container>
       
      </div>
    </>
  );
}

export default ViewPost;
