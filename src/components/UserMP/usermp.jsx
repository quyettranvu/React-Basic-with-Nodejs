//React, React Router, React Hooks
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortDown,
  faSortUp,
  faRightFromBracket,
  faCircleUser,
  faCircleInfo,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";

//LocalStorage and Cookies
import { deleteLocalStorage } from "../helpers/setLocationStorage";
import { isAuthenticated } from "../helpers/setAuthentication";
import { deleteCookie } from "../helpers/cookies";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*Images*/
import NTnight from "../images/myphoto/nha-trang-night.jpg";

const Usermp = () => {
  const [user, setUser] = useState([]);
  const [open,setOpen]=useState(false); //handling dropdown menu
  const navigate = useNavigate();
  //let location = useLocation();
  //const { id } = useParams();

  const handleLogout = () => {
    deleteLocalStorage("user");
    deleteCookie("token");
    navigate("/login");
    toast.success("Log out successfully", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose: 2000,
    });
  };

  //Get User that log in
  useEffect(() => {
    const getUserDetails = async () => {
      const { data } = await axios.get(`/api/user/${isAuthenticated()._id}`);
      setUser(data);
    };

    getUserDetails();
  }, []);

  return (
    <>
      <div className="main_container">
        <nav className="navbar">
          <h1>Quyet Tran Home Page</h1>
          <div
            className="menu-trigger"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <img alt="" src={NTnight}></img>
          </div>
          <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
            <h3>
              Quyet Tran
              <br />
              <span>Beloved Energetic Programmer</span>
            </h3>
            <ul>
              <li className="dropdownItem">
                <FontAwesomeIcon icon={faCircleUser} />
                <a href="/Menu/aboutme.html">About Me</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faListCheck} />
                <a href="Menu/task.html">Individual Task</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faCircleInfo} />
                <a href="Menu/instruction.html">Usage Instruction</a>
              </li>
            </ul>
          </div>
          {/* <h2>Welcome {location.state}</h2> */}
          <button className="white_btn_in" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </button>
        </nav>
      </div>

      <div className="site-main">
        <div className="container">
          <form action="/" method="POST">
            <table className="main-content">
              <thead>
                <tr>
                  <th>
                    ID
                    <FontAwesomeIcon
                      icon={faSortUp}
                      className="icon-additional"
                    />
                    <FontAwesomeIcon
                      icon={faSortDown}
                      className="icon-second-additional"
                    />
                  </th>
                  <th>
                    First Name
                    <FontAwesomeIcon
                      icon={faSortUp}
                      className="icon-additional"
                    />
                    <FontAwesomeIcon
                      icon={faSortDown}
                      className="icon-second-additional"
                    />
                  </th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  <tr>
                    <td>{user.userID}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        type="button"
                        className="click-update"
                        onClick={() => navigate(`/update/${user._id}`)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </>
  );
};

export default Usermp;
