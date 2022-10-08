import {Route,Routes,Navigate} from 'react-router-dom';
import MainPage from './components/MainPage/mainpage';
import Signup from './components/Signup/signup';
import Login from './components/Login/login';
import UpdateUser from './components/UpdateUser/updateuser';
import UserMP from './components/UserMP/usermp';

/*React Toastify for showing messages*/
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  //const user=localStorage.getItem("token");
  return (
    <>
      <Routes>
      <Route path="/home" exact element={<MainPage/>} />
      <Route path="/user" exact element={<UserMP/>}/> 
      <Route path="/signup" exact element={<Signup/>} />
      <Route path="/login" exact element={<Login/>} />
      <Route path="/update/:id" exact element={<UpdateUser/>}/>
      <Route path="/" exact element={<Navigate replace to="/login"/>} />
    </Routes>
    <ToastContainer/>
    </>
    
  );
}

export default App;
