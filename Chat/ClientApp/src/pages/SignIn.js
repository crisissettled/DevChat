import { useState } from "react"
import { Navigate, Link } from "react-router-dom";
import { doSignIn } from '../app/User/userSlice'
import { useSelector, useDispatch } from 'react-redux'

export function SignIn() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const dispatch = useDispatch()
    const userState = useSelector((state) => state.user)
    //console.log(userState, "userState in SignIn page");
    if (userState?.isSignedIn === true) return <Navigate to="/chat" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (userId === "" || password === "") return;

        const response = await fetch("/api/User/SignIn", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, password, keepLoggedIn }),
        })

        if (response.ok) {
            const userState = await response.json();
            if (userState?.data) {
                dispatch(doSignIn({ signedIn: true, token: userState?.data?.token, userId: userState?.data?.userId }))
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
            <div className="col-8 col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 my-3 form-check form-switch">
                <label className="form-check-label">Trust this device
                    <input type="checkbox" className="form-check-input" defaultChecked={false} onChange={e => setKeepLoggedIn(e.target.value === "on" ? true : false)} />
                </label>
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