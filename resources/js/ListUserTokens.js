import React, { useEffect, useState } from "react";
import BreadcrumbComponent from "./components/BreadcrumbComponent";
import UserTokensTable from "./components/UserTokensTable";

export default function ListUserTokens() {
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
                <div className="">Welcome back, admin jabar</div>

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
