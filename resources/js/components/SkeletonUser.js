import axios from "axios";
import React, { useEffect, useState } from "react";
import { Skeleton } from "primereact/skeleton";

export default function SkeletonUser() {
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
        <>
            {user ? (
                <div>Welcome Back, {user.user_login}</div> // Display the user's name
            ) : (
                <Skeleton width="10rem" height="2rem" />
            )}
        </>
    );
}
