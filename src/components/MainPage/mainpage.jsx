//React, React Router, React Hooks
import React,{useState,useEffect} from 'react';
import { useLocation,useNavigate} from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { CSVLink } from "react-csv";

//Papaparse for converting imported CSV files to datas in json
import Papa from "papaparse";

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown,faSortUp } from '@fortawesome/free-solid-svg-icons';



const Mainpage = () => {

    const [user, setUser] = useState([]);
    const navigate=useNavigate();
    let location = useLocation();
    //const { id } = useParams();

    const handleLogout=()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }


    //Get Users
    useEffect(()=>{
        const getUsers=async () => {
            const result = await axios.get('/api/allusers');
            setUser(result.data);
        }

        getUsers();
    },[]);

    //Delete User
    const handleDelete= async (id) =>{
        //To avoid page "Cannot POST/" change type="button" in the button HTML tag
        if(window.confirm("Do you want to delete this product?")){
            await axios.delete(`/api/user/${id}`);
            setUser(
                user.filter((user) => {
                   return user._id !== id;
                })
            );
            navigate("/home");
        }
    }

    //Sorting
    const sortAscending=async ()=>{
        const result = await axios.get('/api/allusers');
        setUser(result.data.sort((a, b) => a.firstName.localeCompare(b.firstName)));
    }

    const sortDescending=async()=>{
        const result = await axios.get('/api/allusers');
        setUser(result.data.sort((a, b) => b.firstName.localeCompare(a.firstName)));
    }

    const sortAscendingID=async()=>{
        const result = await axios.get('/api/allusers');
        setUser(result.data.sort((a, b) => a.userID-b.userID));
    }

    const sortDescendingID=async()=>{
        const result = await axios.get('/api/allusers');
        setUser(result.data.sort((b, a) => a.userID-b.userID));
    }

    //Searching and Filtering
    const handleSearch =async(e)=>{
        let value = e.target.value.toLowerCase();

        const result = await axios.get('/api/allusers');
        const final_result = result.data.filter((item) => {
        return item.email.search(value) !== -1;
        });
        setUser(final_result);
    }

    //Pagination using React Hooks(react-paginate)
    const [currentUsers, setCurrentUsers] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage= 5;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentUsers(user.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(user.length / itemsPerPage));
    }, [itemOffset, itemsPerPage,user]);

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
            complete: async (results)=> {
             try {
                await axios.post('/api/user',results.data[0],{headers:{"Content-Type" : "application/json"}}); 
             } catch (error) {
                console.error(error.response.data);  
             }
            }
        });
    };

    const handleParse=()=>{
        alert("Import Successfully!");
        window.location.reload();
    }


    /*Export Datas to Excel File */
    const headers = [
        { label: 'UserID', key: 'userID' },
        { label: 'First Name', key: 'firstName' },
        { label: 'Last Name', key:  'lastName' },
        { label: 'Email', key: 'email' },
        { label: 'Password', key: 'password'}
      ];

      const csvReport={
        filename:'User_Report.csv',
        headers:headers,
        data: user
      }

    return(
        <>
            <div className="main_container">
            <nav className="navbar">
                <h1>Quyet Tran Page</h1>
                <h3>Home</h3>

                <h2>Welcome {location.state}</h2>
                <button className="white_btn_in" onClick={handleLogout}>
                    Logout
                </button>
            </nav>
        </div>

        <div className="site-main">
            <div className="container">
               <input type="text" placeholder="Search user by email" className="search_filter" onChange={(e)=>handleSearch(e)} />

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
                </div>

               <form action="/" method="POST">
                   <table className="main-content">
                       <thead>
                           <tr>
                               <th>ID
                                    <FontAwesomeIcon icon={faSortUp} onClick={sortAscendingID} className="icon-additional"/>
                                    <FontAwesomeIcon icon={faSortDown} onClick={sortDescendingID} className="icon-second-additional"/>
                                </th>
                               <th>First Name
                                    <FontAwesomeIcon icon={faSortUp} onClick={sortAscending} className="icon-additional"/>
                                    <FontAwesomeIcon icon={faSortDown} onClick={sortDescending} className="icon-second-additional"/>
                               </th>
                               <th>Last Name</th>
                               <th>Email</th>
                               <th>Action</th>
                           </tr>
                       </thead>
                       <tbody>
                               {
                                    currentUsers.map(item=>(
                                    <tr key={item._id}>
                                        <td>{item.userID}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <button type="button" className="click-update" onClick={()=>navigate(`/update/${item._id}`)}>Edit</button>
                                            <button type="button" className="click-delete" onClick={()=>handleDelete(item._id)}>Delete</button>
                                        </td>
                                    </tr>
                                   ))
                               }
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
        </>
    )
}

export default Mainpage;