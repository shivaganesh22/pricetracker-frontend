
import './App.css';
import Header from './views/Header';
import { AllRoutes } from './views/Routes';
import { ToastContainer } from 'react-toastify';
import { generateToken, messaging } from './firebase';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './views/other/AuthContext';
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
function App() {
  const { isLoggedIn, login, logout, storage, setStorage } = useAuth();
  useEffect(()=>{
     if(isLoggedIn) generateToken();
    onMessage(messaging,(payload)=>{
      
    })
  },[])
  return (
    <div className="App">
      <Header></Header>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      <ToastContainer />
      <AllRoutes></AllRoutes>
    </div>
  );
}

export default App;
