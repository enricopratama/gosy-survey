import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primereact/resources/primereact.css"; // core css
import "primeicons/primeicons.css"; // icons
import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Register from "./components/Register";
import HomeCopy from "./pages/HomeCopy";
import ListUserAccess from "./pages/ListUserAccess";
import ListUserTokens from "./pages/ListUserTokens";
import ViewSurvey from "./pages/ViewSurvey";
import SurveyQuestions from "./pages/SurveyQuestions";
import Favicon from "react-favicon";
import { NoPage } from "./pages/NoPage";
import { ThemeProvider } from "./ThemeContext";
import { PrimeReactContext, PrimeReactProvider } from "primereact/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrimeReact from "primereact/api";
import NewQuestion from "./pages/NewQuestion";
import { MaxIdProvider } from "./components/MaxIdContext"; // Import the MaxIdProvider
import "../css/app.css";

function App() {
    const { setRipple } = useContext(PrimeReactContext);

    useEffect(() => {
        setRipple(true);
    }, [setRipple]);

    return (
        <>
            <ThemeProvider>
                <MaxIdProvider>
                    <Router>
                        <Routes>
                            <Route exact path="/home" element={<HomeCopy />} />
                            <Route
                                exact
                                path="/register"
                                element={<Register />}
                            />
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
                                path="/survey/questions"
                                element={<SurveyQuestions />}
                            />
                            <Route
                                exact
                                path="/survey/new"
                                element={<NewQuestion />}
                            />
                            <Route exact path="*" element={<NoPage />} />
                        </Routes>
                    </Router>
                </MaxIdProvider>
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
