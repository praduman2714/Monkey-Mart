import Style from './SignIn.module.css'

function SignIn() {
    return (
        <>
           <div className={Style.form}>
            <h1>Sign In</h1>
                <form>
                   
                    <input type="email" placeholder="Email"/> <br />
                    <input type="password" placeholder="Password" /> <br />
                    <button type="submit">Sign IN</button>
                </form>
           </div>
        </>
    )
}

export default SignIn;