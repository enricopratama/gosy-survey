import "primereact/resources/themes/lara-light-indigo/theme.css"; // light mode
// import "primereact/resources/themes/lara-dark-indigo/theme.css"; // dark mode
import "primereact/resources/primereact.css"; // core css
import "primeicons/primeicons.css";
import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Register from "./pages/Register";
import HomeCopy from "./pages/Home";
import ListUserAccess from "./pages/ListUserAccess";
import ListUserTokens from "./pages/ListUserTokens";
import ViewAll from "./pages/ViewAll";
import PreviewQuest from "./pages/PreviewQuest";
import Favicon from "react-favicon";
import { NoPage } from "./pages/NoPage";
import { ThemeProvider } from "./components/ThemeContext";
import { PrimeReactContext, PrimeReactProvider } from "primereact/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewQuestion from "./pages/NewQuestion";
import "../css/app.css";

function App() {
    const { setRipple } = useContext(PrimeReactContext);

    useEffect(() => {
        setRipple(true);
    }, [setRipple]);

    return (
        <>
            <ThemeProvider>
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
                            element={<ViewAll />}
                        />
                        <Route
                            exact
                            path="/survey/preview"
                            element={<PreviewQuest />}
                        />
                        <Route
                            exact
                            path="/survey/new"
                            element={<NewQuestion />}
                        />
                        <Route exact path="*" element={<NoPage />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <Favicon url="/favicon.ico" />
        <PrimeReactProvider>
            <App />
        </PrimeReactProvider>
    </React.StrictMode>
);
