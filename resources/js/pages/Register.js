import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import BreadcrumbComponent from "../components/BreadcrumbComponent";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const debugging = false;

    async function signUp() {
        let item = { name, email, password };

        if (debugging) {
            console.warn(item);
        }

        let result = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify(item),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        if (!result.ok) {
            console.warn("Error:", result.statusText);
            return;
        }

        result = await result.json();

        if (debugging) {
            console.warn("result", result);
        }

        localStorage.setItem("user-info", JSON.stringify(result));
        navigate("/");
    }

    return (
        <>
            <BreadcrumbComponent />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-6">
                        <h1 className="text-center">Registration Page</h1>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            placeholder="Name"
                        />
                        <br />
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Email"
                        />
                        <br />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Password"
                        />
                        <br />
                        <div className="d-flex justify-content-center">
                            <button
                                onClick={signUp}
                                className="btn btn-primary"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
