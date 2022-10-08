import { Link,useNavigate } from 'react-router-dom';
import React,{useState} from 'react';
import axios from 'axios';

/*React Toastify for showing messages*/
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup=()=>{
    const [data,setData]=useState({
        userID:"",
        firstName:"",
        lastName:"",
        email:"",
        password:""
    });

    const navigate=useNavigate();

    const handleChange=({currentTarget:input})=>{
        setData({...data,[input.name]:input.value});
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();

        try {
			await axios.post("/api/users", data);
            //console.log(res.data);
            toast.success("Register Successfully",{
                position:toast.POSITION.TOP_RIGHT,
                theme: 'dark',
                autoClose:2000
            })
            navigate("/login"); //after registering navigate to login page
        } catch (error) {
            //alert(error.response.data.msg)
            toast.error("Password not matched the pattern numbers and letters alternate and start from number!",{
                autoClose:2000
            })
        }

    }
    return(
        <div className="signup_container">
            <div className="signup_form_container">
                {/*Left side: Sign in*/}
                <div className="left">
                    <h1>Welcome back</h1>
                    <Link to="/login">
                        <button type="button" className="white_btn">
                            Sign in
                        </button>
                    </Link>
                </div>

                {/*Right side: Sign up*/}
                <div className="right">
                    <form className="form_container" onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="number"
                            placeholder="ID"
                            name="userID"
                            onChange={handleChange}
                            value={data.userID}
                            required
                            className="input"
                        />

                        <input
                            type="text"
                            placeholder="First name"
                            name="firstName"
                            onChange={handleChange}
                            value={data.firstName}
                            required
                            className="input"
                        />

                        <input
                            type="text"
                            placeholder="Last name"
                            name="lastName"
                            onChange={handleChange}
                            value={data.lastName}
                            required
                            className="input"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className="input"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className="input"
                        />

                        <button type="submit" className="green_btn">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;