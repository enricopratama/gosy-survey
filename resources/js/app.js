require("bootstrap");
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import HomeCopy from "./pages/HomeCopy";
import ListUserAccess from "./pages/ListUserAccess";
import ListUserTokens from "./pages/ListUserTokens";
import { ThemeProvider } from "./ThemeContext";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/saga-blue/theme.css"; // or any other theme you prefer
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { NoPage } from "./pages/NoPage";
import ViewSurvey from "./pages/ViewSurvey";
import EditSurvey from "./pages/EditSurvey";

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
                        <Route
                            exact
                            path="/survey/view"
                            element={<ViewSurvey />}
                        />
                        <Route
                            exact
                            path="/survey/edit"
                            element={<EditSurvey />}
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
// const data = document.getElementById("root").dataset.userdata;
// console.log(data);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
