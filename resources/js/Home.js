import React from "react";
import { useTheme } from "./ThemeContext";
import "../css/Home.css"; // Import the CSS file

export default function Home() {
    const { theme } = useTheme();

    return (
        <div className={theme === "light" ? "bg-light" : "bg-dark"}>
            <div className="d-flex flex-row justify-content-between rounded flex-wrap-reverse align-items-center">
                <div className="d-flex flex-column m-4 m-md-5">
                    <nav aria-label="breadcrumb" className="ml-auto">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="#">Home</a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="#">Library</a>
                            </li>
                            <li
                                className="breadcrumb-item active"
                                aria-current="page"
                            >
                                Data
                            </li>
                        </ol>
                    </nav>
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
                        className={`p-2 text-center flex-fill bd-highlight rounded ${
                            theme === "light" ? "bg-white" : "bg-dark-mode"
                        }`}
                        style={{ minWidth: "49%" }}
                    >
                        Flex item
                    </div>
                    <div
                        className={`p-2 text-center flex-fill bd-highlight rounded ${
                            theme === "light" ? "bg-white" : "bg-dark-mode"
                        }`}
                        style={{ minWidth: "49%" }}
                    >
                        Flex item
                    </div>
                </div>
            </div>
        </div>
    );
}
