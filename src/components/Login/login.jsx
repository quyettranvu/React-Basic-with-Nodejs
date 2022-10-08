import { Link,useNavigate } from 'react-router-dom';
import React,{useState} from 'react';
import axios from 'axios';

import {setAuthentication,isAuthenticated} from "../helpers/setAuthentication";

/*React Toastify for showing messages*/
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup=()=>{
    const [data,setData]=useState({
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
			await axios.post("/api/auth", data)
                .then((response)=>{
                    setAuthentication(response.data.token,response.data.user);

                    if(isAuthenticated().blocked===1)
                    {
                        toast.error('You are blocked now!',{
                            autoClose:2000
                        });
                    }
                    else if(isAuthenticated().role ===1){
                        navigate("/home");
                        toast.success(`You logged in as an Administrator! Welcome ${response.data.user.email}!`,{
                            position: toast.POSITION.TOP_RIGHT,
                            theme: 'dark',
                            autoClose:2000
                        });
                    }
                    else{
                        navigate("/user");
                        toast.success(`You logged in as a User! Welcome ${response.data.user.email}`,{
                            position: toast.POSITION.TOP_RIGHT,
                            theme: 'dark',
                            autoClose:2000
                        });
                    }
                })
                .catch((err)=>{
                    toast.error("Wrong Email or Password",{
                        autoClose:2000
                    });
                });
            //localStorage.setItem("x-auth-token",res.data);
            //navigate("/home",{state: data_result.email}); //after registering navigate to login page
          
        } catch (error) {
            toast.error("Wrong Email or Password",{
                autoClose:2000
            });
        }
       

    }
    return(
        <div className="login_container">
            <div className="login_form_container">
                <div className="left">
                    <form className="form_container" onSubmit={handleSubmit}>
                            <h1>Login to your Account</h1>
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

                            <button type="submit" className="green_btn" formNoValidate="formNoValidate">
                                Sign In
                            </button>
                    </form>
                </div>

                <div className="right">
                    <h1>New Here?</h1>
                    <Link to="/signup">
                        <button type="button" className="white_btn">
                            Sign up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signup;