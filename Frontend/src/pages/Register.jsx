import React, { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Context } from "../main";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios'; // Ensure axios is imported

const Register = () => {

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [nic, setNic] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [password, setPassword] = useState("")

  const navigateTo = useNavigate()
  const handleRegistration = async (e) => {
    e.preventDefault();
    console.log( firstName,          lastName,          email, phone,          nic,                 dob        ,      gender    ,password )
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/patient/register",
        { firstName, lastName, email, phone, nic, dob, gender, password, role:"Patient" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
  
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setPassword("");
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        // Request was made but no response received
        toast.error('No response from server. Please try again later.');
      } else {
        // Something else caused the error
        toast.error(`Error: ${error.message}`);
      }
    }
  }
  
  //if user already registered -> return to Home Page
  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }

  return (
    <>
      <div className="container form-component register-form">
        <h2>Sign Up</h2>
        <p>Please Sign Up To Continue</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat culpa
          voluptas expedita itaque ex, totam ad quod error?
        </p>
        <form onSubmit={handleRegistration}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="NIC"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
            <input
              type={"date"}
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Already Registered?</p>
            <Link
              to={"/signin"}
              style={{ textDecoration: "none", color: "#271776ca" }}
            >
              Login Now
            </Link>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Register
