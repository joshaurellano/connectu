import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_ENDPOINT } from './Api';
import {
  Nav, Navbar, Container, Button, Form, NavDropdown,
  Row, Col, Card, ListGroup, Modal, Placeholder
} from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState({});
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Decode user token
  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        // const response = JSON.parse(localStorage.getItem('token'));
        // const decodedToken = jwtDecode(response.data.token);
        // setUser(decodedToken);

        const token = Cookies.get('token')
        const decodedToken = jwtDecode(token);
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
      // localStorage.removeItem('token');

      Cookies.remove('token');
      navigate("/login");
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Fetch topics
  const headers = {
    accept: "application/json",
    // Authorization: JSON.parse(localStorage.getItem('token')).data.token
    Authorization: Cookies.get('token')
  };

  const fetchTopics = async () => {
    try {
      const { data } = await axios.get(`${API_ENDPOINT}/get/topic`, { headers });
      setTopics(data);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  };

  const fetchSubtopics = async (topics) => {
    try {
      const subtopicData = {};
      for (const topic of topics) {
        const { data } = await axios.get(`${API_ENDPOINT}/get/subtopic/${topic.topic_id}`, { headers });
        subtopicData[topic.topic_id] = data; // Store subtopics under the corresponding topic_id
      }
      setSubTopics(subtopicData);
    } catch (error) {
      console.error('Failed to fetch subtopics:', error);
    }
  };
  
  useEffect(() => {

    fetchTopics();
  }, []);

  useEffect(() => {
    if (topics.length > 0) {
      fetchSubtopics(topics);
    }
  }, [topics]);

  return (
    <>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Post New Thread</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {topics.length > 0 ? (
              topics.map((t, key) => (
                <Card key={t.topic_id} style={{ marginBottom: "15px" }}>
                  <Card.Body>
                    <h5>{t.topic_name}</h5>
                    <ListGroup>
                        {
                            subtopics[t.topic_id] && subtopics[t.topic_id].length > 0 ? (
                                subtopics[t.topic_id].map((s, key) => (
                                    <ListGroup.Item 
                                    key={s.subtopic_id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/post`, { state: { topic_id: t.topic_id, subtopic_id: s.subtopic_id,user_id: user?.user_id } })}>
                                        {s.subtopic_name}
                                    </ListGroup.Item>
                                ))
                            ) : (<p>No subtopics Available</p>)
                        }
                    </ListGroup>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No topics available. Please check back later.</p>
            )}
            </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Navbar variant="dark" expand="lg" style={{
        backgroundColor: "#1C1C64",
        color: "white",
        display: "flex",
        alignItems: "center"
      }}>
        <Container>
          <Navbar.Brand href="#home" style={{ color: "white" }}>Connect U</Navbar.Brand>
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
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
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
            Trending Topics
            <div style={{ display: "flex", gap: "10px" }}>
              <Button style={{
                borderRadius: "0",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50"
              }}>New Posts</Button>
              <Button onClick={handleShow} style={{
                borderRadius: "0",
                padding: "10px 20px",
                backgroundColor: "#FF8C00",
                borderColor: "#FF8C00"
              }}>Post New Thread</Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

      <Container>
        <Row style={{ marginTop: "30px" }}>
          <Col lg={9}>
            {topics.length > 0 ? (
              topics.map((t, key) => (
                <Card key={t.topic_id} style={{ marginBottom: "15px" }}>
                  <Card.Body>
                    <h5>{t.topic_name}</h5>
                    <ListGroup>
                        {
                            subtopics[t.topic_id] && subtopics[t.topic_id].length > 0 ? (
                              subtopics[t.topic_id].map((s, key) => (
                                    <ListGroup.Item key={s.subtopic_id}>
                                        {s.subtopic_name}
                                    </ListGroup.Item>
                                ))
                            ) : (<>
                              <Placeholder as="p" animation="glow">
                                <Placeholder xs={12} />
                              </Placeholder>
                            </>)
                        }
                    </ListGroup>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <>
                <Placeholder as="p" animation="glow">
                <Placeholder xs={12} />
                </Placeholder>
              </>
            )}
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
    </>
  );
}

export default Dashboard;
