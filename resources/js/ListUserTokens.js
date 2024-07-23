import React, { useEffect, useState } from "react";
import BreadcrumbComponent from "./components/BreadcrumbComponent";
import UserTokensTable from "./components/UserTokensTable";
// import { CircularProgress } from "@chakra-ui/react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
// import { Spinner } from "@chakra-ui/react";

export default function ListUserTokens() {
    var [date, setDate] = useState(new Date());
    const [user, setUser] = useState(null);

    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer);
        };
    });

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
        <div>
            <BreadcrumbComponent pageName="List User Access" />
            <div className="d-flex p-2 justify-content-between bg-white rounded flex-wrap pt-4 pb-4">
                <div className="text-muted">Welcome Back,</div>
                {user ? (
                    <p className="">{user.user_login}</p> // Display the user's name
                ) : (
                    <CircularProgress color="secondary" />
                )}

                <div>
                    Time : {date.toLocaleTimeString()}, Date :{" "}
                    {date.toLocaleDateString()}
                </div>
            </div>
            <div className="pt-4">
                <UserTokensTable />
            </div>
        </div>
    );
}
