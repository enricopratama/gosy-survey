import React, { useEffect, useState } from "react";
import UserAccessTable from "./components/UserAccessTable";
import BreadcrumbComponent from "./components/BreadcrumbComponent";
import UserAccessTableCompany from "./components/UserAccessTableCompany";
import { CircularProgress } from "@chakra-ui/react";
import axios from "axios";

export default function ListUserAccess() {
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
    var [date, setDate] = useState(new Date());

    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer);
        };
    });
    return (
        <div>
            <BreadcrumbComponent pageName="List User Access" />
            <div className="d-flex p-2 justify-content-between bg-white rounded flex-wrap pt-4 pb-4">
                <div className="text-muted">Welcome Back,</div>
                {user ? (
                    <h1 className="">{user.user_login}</h1> // Display the user's name
                ) : (
                    <CircularProgress isIndeterminate color="green.300" />
                )}
                <div>
                    Time : {date.toLocaleTimeString()}, Date :{" "}
                    {date.toLocaleDateString()}
                </div>
            </div>
            <div className="pt-4">
                <UserAccessTable />
                <UserAccessTableCompany />
            </div>
        </div>
    );
}
