import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_ENDPOINT } from './Api';
import {
  Nav, Navbar, Container, Button, Form, NavDropdown,
  Row, Col, Card, ListGroup
} from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubTopics] = useState({});
  const navigate = useNavigate();

  // Decode user token
  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        const response = JSON.parse(localStorage.getItem('token'));
        const decodedToken = jwtDecode(response.data.token);
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
      localStorage.removeItem('token');
      navigate("/login");
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Fetch topics
  const headers = {
    accept: "application/json",
    Authorization: JSON.parse(localStorage.getItem('token')).data.token
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
                <NavDropdown.Item href="#">Profile</NavDropdown.Item>
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
              <Button style={{
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
                            ) : (<p>No subtopics Available</p>)
                        }
                    </ListGroup>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No topics available. Please check back later.</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
