import React from "react";
import BreadcrumbComponent from "./components/BreadcrumbComponent";

/**
 * A copy of the home page that is not optimised for the light or dark mode (for testing)
 * @returns HTML component
 */
export default function HomeCopy() {
    const userLogin = window.userData;
    console.log(userLogin);
    return (
        <div className="">
            <div className="d-flex flex-row justify-content-between bg-white rounded flex-wrap-reverse align-items-center">
                <div className="d-flex flex-column m-4 m-md-5">
                    <BreadcrumbComponent />
                    <div className="text-muted">Welcome Back,</div>
                    <h1 className="">Admin Jakbar!</h1>
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
