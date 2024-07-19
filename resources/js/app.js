require("bootstrap");
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import HomeCopy from "./HomeCopy";
import ListUserAccess from "./ListUserAccess";
import ListUserTokens from "./ListUserTokens";
import { ThemeProvider } from "./ThemeContext";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/saga-blue/theme.css"; // or any other theme you prefer
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { NoPage } from "./NoPage";

export default function App() {
    return (
        <ThemeProvider>
            <PrimeReactProvider>
                <Router>
                    <Routes>
                        <Route exact path="/home" element={<HomeCopy />} />
                        <Route exact path="/register" element={<Register />} />
                        <Route
                            exact
                            path="/configs/user-access"
                            element={<ListUserAccess />}
                        />
                        <Route
                            exact
                            path="/configs/user-tokens"
                            element={<ListUserTokens />}
                        />
                        <Route exact path="*" element={<NoPage />} />
                    </Routes>
                </Router>
            </PrimeReactProvider>
        </ThemeProvider>
    );
}

// Testing user information:
const root = ReactDOM.createRoot(document.getElementById("root"));
const data = document.getElementById("root").dataset.userdata;
console.log(data);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
