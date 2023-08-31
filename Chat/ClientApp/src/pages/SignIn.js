import { useState } from "react"
import { Navigate, Link } from "react-router-dom";
import { doSignIn } from '../app/SignIn/signInSlice'
import { useSelector, useDispatch } from 'react-redux'

export function SignIn() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch()
    const signInState = useSelector((state) => state.signin)
    //console.log(signInState, "signInState in SignIn page");
    if (signInState?.isSignedIn === true) return <Navigate to="/chat" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (userId === "" || password === "") return;

        const response = await fetch("/api/User/SignIn", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, password }),
        })

        if (response.ok) {
            const signInState = await response.json();
            if (signInState?.data) {
                dispatch(doSignIn({ signedIn: true, token: signInState?.data }))
            }
        }
        else {
            alert("Sign In failed")
        }
    }

    return (
        <form className="d-flex flex-column align-items-center justify-content-center" style={{ marginTop: 100 }}>
            <p className="text-center h1 mb-5 mx-1 mx-md-4 mt-3">Please Sign in</p>
            <div className="col-8 col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 my-3">
                <input type="text" className="form-control" onChange={e => setUserId(e.target.value)} placeholder="User Id" />
            </div>
            <div className="col-8 col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 my-3">
                <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            </div>

            <div className="col-8 col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 my-2">
                <button type="submit" className="btn btn-primary btn-lg w-100" onClick={e => handleSubmit(e)}>Sign in</button>
            </div>
            <div className="col-8 col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 my-3 text-center">
                Not a member? <Link to="/signup">Signup</Link>
            </div>
        </form>
    )
}