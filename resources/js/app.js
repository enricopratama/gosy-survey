require("bootstrap");
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HelloReact from "./components/HelloReact";
// import Login from "./Login";
// import Register from "./Register";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/home" element={<HelloReact />} />
                {/* <Route
                    path="/login"
                    element={<Login name="PT GONUSA PRIMA DISTRIBUSI" />}
                /> */}
                {/* <Route path="/register" element={<Register />} /> */}
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
