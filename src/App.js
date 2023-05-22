import './App.css';
import SignUp from './Components/SignUpPage/SignUp';
import NavBar  from './Components/NavBar/NavBar';
import SingIn from './Components/SignInPage/SingIn';
import Home from './Components/Home/Home';
import Order from './Components/Order/Order';

// import CustomeContext
import CustomeContex from './context';

// Router Imports
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import Cart from './Components/Cart/Cart';


function App() {
  const router = createBrowserRouter([
    {path : '/' , element : <NavBar />, children : [
      {path : '/' , element: <Home />},
      {path : "/singUp" , element : <SignUp />},
      {path : '/singIn' , element : <SingIn />},
      {path : '/cart' , element : <Cart />},
      {path : 'order' , element : <Order />}

    ]}
  ])
  return (
    <CustomeContex>
      <div className="App">
      
      
      <RouterProvider router={router} />
    
     </div>
    </CustomeContex>
  );
}

export default App;
