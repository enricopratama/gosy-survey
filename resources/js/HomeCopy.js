import React, { useState, useEffect } from "react";
import BreadcrumbComponent from "./components/BreadcrumbComponent";
import "../css/Home.css";
import axios from "axios";
import { CircularProgress } from "@chakra-ui/react";

export default function HomeCopy() {
    const userLogin = window.userData;
    console.log(userLogin);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios
            .get("/api/user")
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the user details!",
                    error
                );
            });
    }, []);
    return (
        <div className="">
            <div className="d-flex flex-row justify-content-between bg-white rounded flex-wrap-reverse align-items-center">
                <div className="d-flex flex-column m-4 m-md-5">
                    <BreadcrumbComponent pageName="Home" />
                    <div className="text-muted">Welcome Back,</div>
                    {user ? (
                        <h1 className="">{user.user_login}</h1> // Display the user's name
                    ) : (
                        <CircularProgress isIndeterminate color="green.300" />
                    )}
                </div>
                <div className="m-4 m-md-5">
                    <img
                        src="/images/gonusa-logo-fit.png"
                        alt="logo-gonusa"
                        className="img-fluid"
                        style={{ width: "250px" }}
                    />
                </div>
            </div>
            <div className="mt-4">
                <div
                    className="d-flex bd-highlight flex-wrap"
                    style={{ gap: "15px" }}
                >
                    <div
                        className="p-2 text-center flex-fill bd-highlight bg-white rounded"
                        style={{ minWidth: "49%" }}
                    >
                        Flex item
                    </div>
                    <div
                        className="p-2 text-center flex-fill bd-highlight bg-white rounded"
                        style={{ minWidth: "49%" }}
                    >
                        Flex item
                    </div>
                </div>
            </div>
        </div>
    );
}
