import React from "react";
import SurveyTable from "../components/SurveyTable";
import BreadcrumbComponent from "../components/BreadcrumbComponent";

export default function ViewAll() {
    return (
        <div className="mx-auto">
            <BreadcrumbComponent />
            <SurveyTable />
        </div>
    );
}
