require("bootstrap");
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HelloReact from "./components/HelloReact";
// import Login from "./Login";
import Register from "./Register";
import SidebarComponent from "./components/SidebarComponent";

// import "bootstrap/dist/css/bootstrap.min.css";

/* <script src="{{asset('/modern/assets/libs/bootstrap/js/bootstrap.bundle.min.js')}}"></script> */

// import "./modern/assets/libs/bootstrap/js/bootstrap.bundle.min.js";

export default function App() {
    return (
        <>
            <SidebarComponent />

            <Router>
                <Routes>
                    <Route exact path="/home" element={<HelloReact />} />
                    <Route exact path="/register" element={<Register />} />

                    {/* <Route
                    path="/login"
                    element={<Login name="PT GONUSA PRIMA DISTRIBUSI" />}
                /> */}
                    {/* <Route path="/register" element={<Register />} /> */}
                    {/* Add more routes as needed */}
                </Routes>
            </Router>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
