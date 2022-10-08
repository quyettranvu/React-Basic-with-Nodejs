//React, React Router, React Hooks
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { CSVLink } from "react-csv";

//Papaparse for converting imported CSV files to datas in json
import Papa from "papaparse";

//Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSortDown,faSortUp,faRightFromBracket,faCircleUser,faCircleInfo,faListCheck} from "@fortawesome/free-solid-svg-icons";

//LocalStorage and Cookies
import { deleteLocalStorage } from "../helpers/setLocationStorage";
import { deleteCookie } from "../helpers/cookies";

//pop-up window to add user
import Popup from "../Popup/popup";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*Images*/
import NTnight from "../images/myphoto/nha-trang-night.jpg";

const Mainpage = () => {
  const [user, setUser] = useState([]);
  const [popup, setPopup] = useState(false);
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
      autoClose:2000
    });
  };

  //Get Users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await axios.get("/api/allusers");
        setUser(result.data);
      } catch (err) {
        //alert(err.response.data.msg);
        toast.error("Error in getting users", {
          autoClose:2000
        });
      }
    };

    getUsers();
  }, []);

  //Delete User
  const handleDelete = async (id) => {
    //To avoid page "Cannot POST/" change type="button" in the button HTML tag
    if (window.confirm("Do you want to delete this product?")) {
      await axios.delete(`/api/user/${id}`);
      setUser(
        user.filter((user) => {
          return user._id !== id;
        })
      );
      toast.success("Delete User Successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
        autoClose:2000
      });
      navigate("/home");
    }
  };

  //Block User
  const handleBlocked = async (id) => {
    const user = await axios.get(`/api/user/${id}`);
    if (user.data.blocked === 0) {
      await axios.put(`/api/block/user/${id}`);
      toast.success("Blocked this user successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
        autoClose:2000
      });
      setTimeout(()=>window.location.reload(),2500);
     }
    else{
        await axios.put(`/api/unblock/user/${id}`);
        toast.success("Unblocked this user successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
        autoClose:2000
      });
      setTimeout(()=>window.location.reload(),2500);
    } 
  };

  //Sorting
  const sortAscending = async () => {
    const result = await axios.get("/api/allusers");
    setUser(result.data.sort((a, b) => a.firstName.localeCompare(b.firstName)));
    toast.success("Sorting successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose:2000
    });
  };

  const sortDescending = async () => {
    const result = await axios.get("/api/allusers");
    setUser(result.data.sort((a, b) => b.firstName.localeCompare(a.firstName)));
    toast.success("Sorting successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose:2000    
    });
  };

  const sortAscendingID = async () => {
    const result = await axios.get("/api/allusers");
    setUser(result.data.sort((a, b) => a.userID - b.userID));
    toast.success("Sorting successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose:2000
    });
  };

  const sortDescendingID = async () => {
    const result = await axios.get("/api/allusers");
    setUser(result.data.sort((b, a) => a.userID - b.userID));
    toast.success("Sorting successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose:2000
    });
  };

  //Searching and Filtering
  const handleSearch = async (e) => {
    let value = e.target.value.toLowerCase();

    const result = await axios.get("/api/allusers");
    const final_result = result.data.filter((item) => {
      return item.email.search(value) !== -1;
    });
    setUser(final_result);
  };

  //Pagination using React Hooks(react-paginate)
  const [currentUsers, setCurrentUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentUsers(user.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(user.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, user]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % user.length;
    setItemOffset(newOffset);
  };

  //Import User and Export User from file .csv
  /*Import Datas from Excel File to Web Application*/
  const handleOnChange = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          await axios.post("/api/user", results.data[0], {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error(error.response.data);
        }
      },
    });
  };

  const handleParse = () => {
    toast.success("Importing successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
      autoClose: 2000
    });
    window.location.reload();
  };

  /*Export Datas to Excel File */
  const headers = [
    { label: "UserID", key: "userID" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Password", key: "password" },
  ];

  const csvReport = {
    filename: "User_Report.csv",
    headers: headers,
    data: user,
  };

  return (
    <>
      <div className="main_container">
        <nav className="navbar">
          <h1>Quyet Tran Home Page</h1>

          {/* <h2>Welcome {location.state}</h2> */}

          <button className="white_btn_in" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </button>
        </nav>
      </div>

      <div className="site-main">
        <div className="container">
          <input
            type="text"
            placeholder="Search user by email"
            className="search_filter"
            onChange={(e) => handleSearch(e)}
          />

          <div className="file_input_output">
            <input
              type="file"
              name="file"
              accept={".csv,.xlsx"}
              className="file_input"
              onChange={handleOnChange}
            />

            <button className="import_to_csv" onClick={handleParse}>
              Import
            </button>

            <CSVLink {...csvReport} className="export_to_csv">
              Export
            </CSVLink>

            <button className="btn_add_user" onClick={() => setPopup(true)}>
              Add User
            </button>
          </div>

          <form action="/" method="POST">
            <table className="main-content">
              <thead>
                <tr>
                  <th>
                    ID
                    <FontAwesomeIcon
                      icon={faSortUp}
                      onClick={sortAscendingID}
                      className="icon-additional"
                    />
                    <FontAwesomeIcon
                      icon={faSortDown}
                      onClick={sortDescendingID}
                      className="icon-second-additional"
                    />
                  </th>
                  <th>
                    First Name
                    <FontAwesomeIcon
                      icon={faSortUp}
                      onClick={sortAscending}
                      className="icon-additional"
                    />
                    <FontAwesomeIcon
                      icon={faSortDown}
                      onClick={sortDescending}
                      className="icon-second-additional"
                    />
                  </th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((item) => (
                  <tr key={item._id}>
                    <td>{item.userID}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.email}</td>
                    <td>
                      <button
                        type="button"
                        className="click-update"
                        onClick={() => navigate(`/update/${item._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="click-delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="click-block"
                        onClick={() => handleBlocked(item._id)}
                      >
                        {item.blocked === 1 ? "Unblock" : "Block"}
                      </button>
                      <button
                        type="button"
                        className="click-restrict"
                        onClick={() => handleDelete(item._id)}
                      >
                        Restrict
                      </button>
                      {/* <button type="button" className="click-block"></button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeLinkClassName="active"
          />
        </div>
      </div>
      {popup ? (
        <Popup className="open-popup-window" onClose={() => setPopup(false)} />
      ) : null}
    </>
  );
};

export default Mainpage;
