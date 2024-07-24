import React, { useEffect, useState } from "react";
import UserAccessTable from "../components/UserAccessTable";
import BreadcrumbComponent from "../components/BreadcrumbComponent";
import UserAccessTableCompany from "../components/UserAccessTableCompany";
import SkeletonUser from "../components/SkeletonUser";

export default function ListUserAccess() {
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
                <SkeletonUser />
                <div>
                    Time : {date.toLocaleTimeString()}, Date :{" "}
                    {date.toLocaleDateString()}
                </div>
            </div>
            <div className="pt-4">
                <UserAccessTable />
                {/* <UserAccessTableCompany /> */}
            </div>
        </div>
    );
}
