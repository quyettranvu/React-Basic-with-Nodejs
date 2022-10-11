import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//LocalStorage and Cookies
import { isAuthenticated } from "../helpers/setAuthentication";

const Updateuser = () => {
  const [allValues, setAllValues] = useState({
    userID: 0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    newpass: ""
  });

  //new password
  const [newpass, setNewPass] = useState("");

  //Get value id of user on URL link
  const params = useParams();
  const navigate = useNavigate();

  //Prefill Update Form
  useEffect(() => {
    const getUserDetails = async () => {
      const { data } = await axios.get(`/api/user/${params.id}`);
      setAllValues(data);
    };

    getUserDetails();
  }, [params.id]);

  //Change value
  const handleChange = (e) => {
    setAllValues({
      ...allValues,
      [e.target.name]: e.target.value,
    });
  };

  const updateUser = async (e) => {
    e.preventDefault();

    const data = {
      userID: allValues.userID,
      firstName: allValues.firstName,
      lastName: allValues.lastName,
      email: allValues.email,
      password: allValues.password,   //take value from old password
      newpassword: newpass
    };

    let result = await axios.put(`/api/user/${params.id}`, data);
    if (result) {
      if (isAuthenticated() && isAuthenticated().role === 1) {
        navigate("/home");
      } else navigate("/user");
    }
  };

  return (
    <div className="update-content">
      {/* <button className="back-homepage" onClick={()=>window.location="/home"}>{"<<"} Back</button> */}
      <h1>Update User</h1>
      <form>
        <div className="mb-3">
          <label className="form-label">User ID</label>
          <input
            name="userID"
            type="number"
            className="form-control"
            value={allValues.userID}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            name="firstName"
            type="text"
            className="form-control"
            value={allValues.firstName}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            name="lastName"
            type="text"
            value={allValues.lastName}
            className="form-control"
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            value={allValues.email}
            className="form-control"
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            value={allValues.password}
            autoComplete="on"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            name="newpass"
            type="password"
            value={newpass}
            autoComplete="on"
            className="form-control"
            onChange={(e) => setNewPass(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmed Password</label>
          <input
            name="newpass"
            type="password"
            value={newpass}
            autoComplete="on"
            className="form-control"
            onChange={(e) => setNewPass(e.target.value)}
          />
        </div>
        <button
          type="submit"
          onClick={updateUser}
          className="btn btn-primary"
          id="button-update"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default Updateuser;