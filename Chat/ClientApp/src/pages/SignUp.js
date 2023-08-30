import { useEffect, useState } from "react"
import { Navigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faIdCard, faLock, faKey } from '@fortawesome/free-solid-svg-icons'
import { RESULT_CODE_SUCCESS } from '../utils/Constants'
import signUpImg from "../asset/images/signup.png";

export function SignUp() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [isSuccess, setIsSuccess] = useState(false);
    const [toSignInPage, setToSignInPage] = useState(false);

    useEffect(() => {
        let timer;
        if (isSuccess === true) timer = setTimeout(() => setToSignInPage(true), 2000)

        return () => clearTimeout(timer)

    }, [isSuccess])

    if (toSignInPage === true) return <Navigate to="/signin" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (userId === "" || password === "") return;

        const response = await fetch("/api/User/SignUp", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, password, name }),
        })

        if (response.ok) {
            const result = await response.json();

            console.log(result.code === RESULT_CODE_SUCCESS, result, RESULT_CODE_SUCCESS)
            if (result.code === RESULT_CODE_SUCCESS) {
                setIsSuccess(true);
            }
        }
        else {
            alert("Sign Up failed")
        }
    }

    return (
        <section className="mt-xxl-5 mx-xl-3">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-lg-12 col-xl-11">
                    <div className="card text-black" style={{ borderRadius: 25 }} >
                        <div className="card-body px-md-5">
                            {isSuccess ?
                                (
                                    <div className="alert alert-success">
                                        <strong>Success!</strong> You will redirect to <Link to="/signin">Sign In</Link> page.
                                    </div>
                                ) : (
                                    <div className="row justify-content-center">
                                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                                            <form className="mx-1 mx-md-4">
                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <FontAwesomeIcon icon={faUser} size="xl" fixedWidth />
                                                    <input type="text" className="form-control ms-2" placeholder="User ID" onChange={e => setUserId(e.target.value)} />
                                                </div>
                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <FontAwesomeIcon icon={faIdCard} size="xl" fixedWidth />
                                                    <input type="text" className="form-control ms-2" placeholder="Your Name" onChange={e => setName(e.target.value)} />
                                                </div>
                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <FontAwesomeIcon icon={faLock} size="xl" fixedWidth />
                                                    <input type="password" className="form-control ms-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                                                </div>
                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <FontAwesomeIcon icon={faKey} size="xl" fixedWidth />
                                                    <input type="password" className="form-control ms-2" placeholder="Repeat your password" />
                                                </div>
                                                <div className="form-check d-flex justify-content-center mb-5">
                                                    <input className="form-check-input me-2" type="checkbox" value="" id="inputTermsOfService" />
                                                    <label className="form-check-label" htmlFor="inputTermsOfService">
                                                        I agree all statements in <a href="#!" onClick={e => e.preventDefault()}>Terms of service</a>
                                                    </label>
                                                </div>
                                                <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                    <button type="button" className="btn btn-primary btn-lg" onClick={e => handleSubmit(e)}>Register</button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                            <img src={signUpImg} className="img-fluid rounded" alt="" />
                                        </div>

                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}