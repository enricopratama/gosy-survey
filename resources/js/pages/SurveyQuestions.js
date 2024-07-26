import React from "react";
import StepperDemo from "../components/StepperDemo";
import BreadcrumbComponent from "../components/BreadcrumbComponent";

export default function SurveyQuestions() {
    return (
        <>
            <BreadcrumbComponent />
            <div className="bg-white rounded" style={{ height: "1200px" }}>
                <StepperDemo />
            </div>
        </>
    );
}
