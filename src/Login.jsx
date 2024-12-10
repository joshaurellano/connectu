import './Login.css';

import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_ENDPOINT } from './Api';
import { Navbar,Container,Button,Form, Row, Col,Nav,Modal, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2';

import bgimg from '/5072612.jpg';

function Login () {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
        try {
            const response = JSON.parse(localStorage.getItem('token'))
            setUser(response.data);

                navigate("/dashboard");
        } catch (error) {
            localStorage.removeItem('token');
            navigate("/login");
        }
        
    };
    fetchUser();

}, []);
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

const [error, setError] = useState('');

{/*const for loading state of login */}
const [loading, setLoading] = useState(false); // State to track loading

const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true); // Set loading to true when login starts

try{
const response = await axios.post(`${API_ENDPOINT}/admin/login`, {
    username,
    password,
});
localStorage.setItem("token",JSON.stringify(response));
setError('');

setLoading(false);

await Swal.fire({
    title: "Log in Success!",
    text: "Click the button to continue!",
    icon: "success"
  });
navigate("/dashboard");
} catch (error) {
    setLoading(false);
    await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid username or password!",
      });
    setError('Invalid username or password');
    }
};

{/*const for registration*/}

const clearField = () => {
    setFullname('');
    setPhonenumber('');
    setEmail('');
    setrusername('');
    setrpassword('');
    setRePassword('');
    setRegisterError('');
};

{/*for modal */}
const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setRegisterError ('');
        clearField ();
    }
    const [registerError,setRegisterError] = useState('');
    
    const [fullname, setFullname] = useState('');
    const [phone_number, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [rusername, setrusername] = useState('');
    const [rpassword, setrpassword] = useState('');
    const [repassword, setRePassword] = useState('');

    {/*const for loading state of registration */}
    const [regloading, setRegLoading] = useState(false); // State to track loading

const handleRegister = async (e) =>{
    e.preventDefault();

    setRegLoading(false);

    if (rpassword !== repassword) {
        await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Passwords do not match!",
          });
        setRegisterError('Passwords do not match');
        return;
    }

    setRegLoading(true);

    try {
        const response = await axios.post(`${API_ENDPOINT}/admin/register`, {
            fullname,
            phone_number,
            email,
            username : rusername,
            password : rpassword
        });

        setRegLoading(false);

        await Swal.fire({
            title: "Register Success!",
            icon: "success"
          });
        clearField ();

        handleClose ();

    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            setRegLoading(false)
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.message
              }); 
            setRegisterError(error.response.data.message);
        } else {
            await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred while registering. Please try again.",
        });
            setRegisterError('An error occurred while registering. Please try again.');
        }
    }
    finally {
        setRegLoading(false)
    };
};
const [passwordError, setPasswordError] = useState(null);

const handleRePassword = async (e) => {
    const value = e.target.value;
    setRePassword(value);
    setPasswordError(rpassword !== value ? 'Passwords do not match': null);
       
}

{/*for password toggle visibility*/}
const [ showPassword, setShowPasword ] = useState(false);
    const handlePasswordToggle = () => {
        setShowPasword(!showPassword)
    };
const [ showRePassword, setShowRePassword ] = useState(false);
    const handleRePasswordToggle = () => {
        setShowRePassword(!showRePassword)
    };

return (
    <div style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100vw",
        position:"relative"
    }}>
        <Navbar>
            <Container>
                <Navbar.Brand href = "#home" style={{color:"white", textShadow:"2px 2px 4px rgba(0, 0, 0, 0.7)"}}>Connect U</Navbar.Brand>
                <Nav className="justify-content-end">
                <Nav.Item>
                <Nav.Link onClick={handleShow} style={{color:"white"}} className='nav-link'>Register</Nav.Link>
                </Nav.Item>
                </Nav>
            </Container>
        </Navbar>

        {/*Registration Modal */}
        <div>
        <Modal show={show} onHide={handleClose} dialogClassName='custom-modal-width' size="md" centered>
    <Modal.Header closeButton className="p-4" style={{ backgroundColor: "#3b3b98", color: "#fff" }}>
        <Modal.Title style={{ fontWeight: "bold" ,textShadow:"2px 2px 4px rgba(0, 0, 0, 0.7)"}}>Sign Up Now</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-4" style={{ backgroundColor: "#f7f9fc"}}>
        <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    style={{ borderRadius: "8px" }}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
                    type="tel"
                    placeholder="Phone Number"
                    value={phone_number}
                    onChange={(e) => setPhonenumber(e.target.value)}
                    style={{ borderRadius: "8px" }}
                    required
                />
            </Form.Group>
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
                    type="text"
                    placeholder="Username"
                    value={rusername}
                    onChange={(e) => setrusername(e.target.value)}
                    style={{ borderRadius: "8px" }}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" style={{ position: "relative" }}>
                <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={rpassword}
                    onChange={(e) => setrpassword(e.target.value)}
                    style={{ borderRadius: "8px" }}
                    required
                />
                <FaEye
                    onClick={handlePasswordToggle}
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#555",
                    }}
                />
            </Form.Group>
            <Form.Group className="mb-3" style={{ position: "relative" }}>
                <Form.Control
                    type={showRePassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={repassword}
                    onChange={handleRePassword}
                    style={{ borderRadius: "8px" }}
                    required
                />
                <FaEye
                    onClick={handleRePasswordToggle}
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#555",
                    }}
                />
            </Form.Group>
            {registerError && <p style={{ color: "red", fontSize: "0.9rem" }}>{registerError}</p>}
            <Button
                type="submit"
                className="w-100 mt-3"
                style={{
                    backgroundColor: "#3b3b98",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "none",
                }}
                disabled={regloading}>
                {regloading ? (
                    <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                    "Register"
                )}
            </Button>
        </Form>
    </Modal.Body>
</Modal>
            </div>
        <Container>
        <Row className="align-items-center" style={{ minHeight: "100vh" }}>
        <Col>
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <div>
            <h1 style={{color:"white",fontSize:"3rem", textShadow:"2px 2px 4px rgba(0, 0, 0, 0.7)"}}>Connect with Everyone</h1> <br />
            </div>
            <div>
            <p style ={{color:"white", fontSize:"1.5rem",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.7)"}}> Ask anything. Feel free to tell what you feel </p>
            </div>      
        </div>

        </Col>
        <Col>
        <div style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            minHeight:"100vh"}}>
        <div style = {{width:"350px",height:"450px"}}>
        <Form onSubmit = {handleSubmit} 
        style={{
        border: "0.5px solid white",
        borderColor:"white",
        borderRadius: "8px",
        padding: "20px", 
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}}>

            <h4 style={{color:"white",paddingBottom: "20px",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.7)"}}>Login</h4>

            <div style={{marginBottom:"20px"}}>
            <Form.Group controlId="formUsername">
                <Form.Control 
                className="form-control border-0 border-bottom formcontrol"
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} required 
                style={{
                    backgroundColor: "transparent",
                    color: "#fff", 
                    borderBottom: "2px solid rgba(255, 255, 255, 0.7)", 
                    outline: "none",
                    borderRadius: 0,
                  }}
                  autoComplete="off"
                   />
            
            </Form.Group> <br />
            </div>
            <div style={{position: 'relative'}}>
            <Form.Group controlId="formPassword">
                <Form.Control 
                className="form-control border-0 border-bottom formcontrol"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} required 
                style={{
                    backgroundColor: "transparent", 
                    color: "white", 
                    borderBottom: "2px solid rgba(255, 255, 255, 0.7)", 
                    outline: "none",
                    borderRadius: 0,
                  }}/>
                  <div onClick={handlePasswordToggle}
                    style={{
                    position: 'absolute',
                    right: '10px',
                    top: '25%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',}}>
                    {showPassword ? <FaEyeSlash style={{color:"white"}} /> : <FaEye style={{color:"white"}} />}
                    </div>
            </Form.Group> <br />
            </div>
            <p style={{color:"white",paddingBottom: "10px"}}>Forgot Password?</p>
            <Form.Group controlId="formButton">
                {error && <p style={{color: 'red'}}>{error}</p>}
                <Button 
                type="submit" 
                style={{
                    width: "300px",
                    backgroundColor: "white",
                    color: "black",
                }}
                disabled={loading} // Disable the button while loading
            >
                {loading ? ( // Show spinner if loading
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /> Loading...
                    </>
                ) : (
                    "Login"
                )}
            </Button>
            </Form.Group>
            <div style={{display:"flex",justifyContent:"center",paddingTop: "20px"}}>
                <p style={{color:"white"}}>Dont have an account? <span onClick={handleShow} role="button" >Register</span></p>
            </div>
        </Form> 
        </div>
        </div>
        </Col>
        </Row>
        </Container>
    </div>
    )
}
export default Login