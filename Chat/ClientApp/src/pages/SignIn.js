import { useState } from "react"
import { Navigate } from "react-router-dom";
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

        <form className="row g-3">
            <div>
                <div className="col-5">
                    <label className="form-label">User
                        <input type="text" className="form-control" onChange={e => setUserId(e.target.value)} />
                    </label>
                </div>
            </div>
            <div>
                <div className="col-5">
                    <label className="form-label">Password
                        <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} />
                    </label>
                </div>
            </div>
            <div className="col-12">
                <button type="submit" className="btn btn-primary btn-lg" onClick={e => handleSubmit(e)}>Sign in</button>
            </div>
        </form>

    )
}