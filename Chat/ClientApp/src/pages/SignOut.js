
import { useDispatch } from 'react-redux'
import { Link } from "react-router-dom";
import { doSignOut } from '../app/User/userSlice'
import { Logo } from '../components/logo/Logo'


export function SignOut() {
    const dispatch = useDispatch();

    const handleSignOut = async () => {

        let response = await fetch("/api/user/signchatout", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.ok) dispatch(doSignOut())
    }

    return (
        <div className="d-flex flex-column align-items-center" style={{ marginTop: 120 }}>
            <Logo />
            <div className="border border-1 border-secondary my-3 rounded-1 p-3">
                <p className="fs-3 p-3 text-muted text-center" style={{ maxWidth: 350 }}>Are you sure you want to sign out?</p>
                <div className="text-center">
                    <button type="button" className="btn btn-warning btn-lg btn-block w-75" onClick={handleSignOut}>Sign Out</button>
                </div>
                <div className="text-center"><Link to="/">Back to chat</Link></div>
            </div>
        </div>
    )
}