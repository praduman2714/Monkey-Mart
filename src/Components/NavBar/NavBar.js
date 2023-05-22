import Style from './NavBar.module.css';



import Logo from '../../Assests/logo.webp'
import {  NavLink, Outlet } from 'react-router-dom';
import { useValue } from '../../context';
function NavBar(){
    const {signUp, toggleSignUp , userPresent , handleLogout} = useValue();
    return (
        <>
            
                <div className={Style.navBar}>
                    <div className={Style.firstDiv}>
                        <img src={Logo} alt='Logo' />
                        <NavLink className= 'styleLink' to= '/'><h3>MonkeyMart</h3></NavLink>
                    </div>
                    <div className={Style.secondDiv}>
                        <div> 
                            <NavLink className= 'styleLink' to='/'><h3> Home </h3></NavLink>
                        </div>
                        <div> 
                            {userPresent ? 
                            <NavLink className= 'styleLink' to='order'>
                                <h3> Order </h3>
                            </NavLink> : null}
                        </div>
                        <div> 
                            {userPresent ? 
                            <NavLink className= 'styleLink' to='cart'>
                            <h3> Cart </h3>
                            </NavLink> : 
                            null}
                        </div>
                        <div > 
                            {!userPresent ? 
                            <NavLink className= 'styleLink' to= {signUp ? '/singUp' : 'singIn'}> 
                            <h3 onClick={toggleSignUp}> {signUp ? 'SingUp' : 'SingIn'}  </h3>
                        </NavLink> : 
                        <NavLink  className='styleLink' to = '/'>
                            <h3 onClick={handleLogout}>LogOut</h3>
                        </NavLink>}
                        </div>
                    </div>
                </div>
                <Outlet />
            
        </>
    )
}

export default NavBar;