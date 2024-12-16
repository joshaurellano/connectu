import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';

import {jwtDecode} from 'jwt-decode';

import { API_ENDPOINT } from './Api';
import {
  Nav, Navbar, Container, Button, Form, NavDropdown,
  Card, ListGroup, Row, Col, Modal
} from 'react-bootstrap';

import Swal from 'sweetalert2';


import { FaUser } from "react-icons/fa6";


function Profile() {
  const [user, setUser] = useState({ userId: null, username: 'Guest' });
  const [post, setPost] = useState([]);
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const [showDel, setShowDel] = useState(false);

  const handleCloseDel = () => setShowDel(false);
  const handleShowDel = () => setShowDel(true);


  const [show, setShow] = useState(false);

  // State for holding the form data
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone_number: '',
    password: ''
  });

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Populate the form data when modal is opened
    setFormData({
      fullname: users?.fullname || '',
      username: users?.username || '',
      email: users?.email || '',
      phone_number: users?.phone_number || '',
      password: ''
    });
    setShow(true);
  };

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
      if (!user.userId) return;
      try {
        const { data } = await axios.get(`${API_ENDPOINT}/post/user/${user.userId}`, { headers });
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPost();
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user.userId) return;
      try {
        const { data } = await axios.get(`${API_ENDPOINT}/user/${user.userId}`, { headers });
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [user.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDeleteUser = async () => {
    const isConfirm = await Swal.fire({
      title: 'Confirm your action',
      text: 'This action is irreversible',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
    }).then((result) => result.isConfirmed);
  
    if (!isConfirm) {
      return;
    }
  
    try {
      await axios.delete(`${API_ENDPOINT}/user/${user.userId}`, { headers });
      Swal.fire({
        icon: "success",
        text: "Successfully Deleted",
      });
      handleLogout();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      Swal.fire({
        text: errorMessage,
        icon: "error",
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      let hashedPassword = formData.password;
    if (formData.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(formData.password, salt);
    }

    const payload = { ...formData, password: hashedPassword };
  
      const response = await axios.put(`${API_ENDPOINT}/user/${user.userId}`, payload, { headers });
  
      setIsLoading(false);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          text: response.data.message, // Use `response.data.message`
        });
        setShow(false); // Close the modal

        const { data: updatedUser } = await axios.get(`${API_ENDPOINT}/user/${user.userId}`, { headers });
        setUsers(updatedUser);

      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || 'Failed to update profile'
        : 'Failed to update profile';
        setIsLoading(false);
      Swal.fire({
        text: errorMessage,
        icon: "error",
      });
  
      console.error('Failed to update profile:', error);
    }
  };
  

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading} >
              {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDel} onHide={handleCloseDel}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDel}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseDel}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Navbar variant="dark" expand="lg" style={{ backgroundColor: "#1C1C64", color: "white" }}>
        <Container>
          <Navbar.Brand as={Link} to='/dashboard' style={{ color: "white" }}>Connect U</Navbar.Brand>
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
                <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mb-6">
        <Card className="mt-5 mb-6" style={{
          height: "6rem", border: "none",
          backgroundColor: "#1C1C64", color: "white"
        }}>
          <Card.Body style={{
            fontSize: "1.5rem", display: "flex",
             alignItems: "center"
          }}>
            Profile

            <Button onClick={handleShow} style={{marginLeft:"auto"}}>Edit</Button>
            <Button style={{gap:"10px"}} variant="danger" onClick={handleDeleteUser}>
            Account Deletion
            </Button>
          </Card.Body>
        </Card>

        <Card style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", border: "none" }}>
          <Card.Body>
            <Container>
            <Row>
              <Col lg={3}>
              <div
                className="d-flex justify-content-center align-items-center rounded-circle"
                style={{
                  width: '250px', 
                  height: '250px', 
                  backgroundColor: '#1C1C64', 
                  color: 'white', 
                  fontSize: '8rem' 
                }}
              >
                <FaUser />
              </div>
              </Col>
              <Col lg={9} className="d-flex flex-column">
                {users ? (
                  <ListGroup style={{ height: '250px', flexGrow: 1 }}>
                    <ListGroup.Item style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                      <div>
                        <strong>Name</strong>: {users.fullname}
                      </div>
                      
                    </ListGroup.Item>
                    <ListGroup.Item style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                      <div>
                        <strong>Username</strong>: {users.username}
                      </div>
                      
                    </ListGroup.Item>
                    <ListGroup.Item style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                      <div>
                        <strong>Email</strong>: {users.email}
                      </div>
                      
                    </ListGroup.Item>
                    <ListGroup.Item style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                      <div>
                        <strong>Phone Number</strong>: {users.phone_number}
                      </div>
                      
                    </ListGroup.Item>
                  </ListGroup>
                ) : (
                  <p>No details available</p>
                )}
              </Col>


            </Row>

            </Container>
          </Card.Body>
        </Card>

        <Card className="mt-5 mb-6" 
        style={{
          height: "6rem", 
          border: "none",
          backgroundColor: "#1C1C64", 
          color: "white"
        }}>
          <Card.Body style={{
            fontSize: "1.5rem", display: "flex",
             alignItems: "center"
          }}>
            Posts
          </Card.Body>
        </Card>

        <Card className="mt-3" style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", border: "none" }}>
          <Card.Body>
            <ListGroup>
              {post && post.length > 0 ? (
                post.map((p) => (
                  <ListGroup.Item key={p.post_id}>
                    <strong style={{cursor: 'pointer'}} onClick={() => navigate(`/viewpost`, { state: { post_id: p.post_id } })}>{p.title}</strong> <br />
                    {p.body}
                  </ListGroup.Item>
                ))
              ) : (
                <p>No posts found.</p>
              )}
            </ListGroup>
          </Card.Body>
        </Card>

        <Card className="mt-3" style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", border: "none" }}>
          <Card.Body>
            <h3>Nothing Follows</h3>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Profile;
