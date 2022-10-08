import React,{useState} from "react";
import axios from 'axios';

/*React Toastify for showing messages*/
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Popup = ({ onClose }) => {

  //const navigate=useNavigate();
  const [data,setData]=useState({
    userID:"",
    firstName:"",
    lastName:"",
    email:""
  });

  
  const handleChange=({currentTarget:input})=>{
    setData({...data,[input.name]:input.value});
  }

  const handleAdd=async()=>{
    try {
        await axios.post("/api/user", data);
        toast.success("Add new user with null password successfully",{
            position: toast.POSITION.TOP_RIGHT,
            autoClose:2000
        })
        setTimeout(()=>window.location.reload(),3000);
    } catch (error) {
        //alert(error.response.data.msg)
        toast.error("Error in adding new user",{
            autoClose:2000
        })
    }
  }

  return (
    <div className="over-lay">
      <div className="modalContainer">
        <label className="form-label">UserID</label>
        <input type="number" name="userID" value={data.userID} onChange={handleChange}/>
        <label className="form-label">First Name</label>
        <input type="text"  name="firstName" value={data.firstName} onChange={handleChange}/>
        <label className="form-label">Last Name</label>
        <input type="text"  name="lastName" value={data.lastName} onChange={handleChange}/>
        <label className="form-label">Email</label>
        <input type="email" name="email" value={data.email} onChange={handleChange}/>
        <button className="popup-submit" onClick={handleAdd}>Submit</button>
      </div>
      <button className="closeBtn" onClick={onClose}>X</button>/>
    </div>
  );
};

export default Popup;
