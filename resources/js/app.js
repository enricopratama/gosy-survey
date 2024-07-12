require("bootstrap");
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
// import Home from "./Home";
import HomeCopy from "./HomeCopy";
import { ThemeProvider } from "./ThemeContext";
// import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route exact path="/home" element={<HomeCopy />} />
                    {/* <Route exact path="/home" element={<Home />} /> */}
                    <Route exact path="/register" element={<Register />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
