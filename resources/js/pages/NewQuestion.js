import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import axios from "axios";
import "../../css/app.css";

export default function NewQuestion() {
    const stepperRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [surveyQuestionGroups, setSurveyQuestionGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({
        surveyType: null,
        questionGroup: null,
    });

    /**
     * Fetch Questions API
     */
    const getQuestions = async () => {
        try {
            const response = await axios.get("/api/questions");
            setQuestions(response.data);
        } catch (error) {
            console.error("There was an error fetching the questions!", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch Survey API
     */
    const getSurveys = async () => {
        try {
            const response = await axios.get("/api/survey");
            setSurveys(response.data);
        } catch (error) {
            console.error("There was an error fetching the surveys!", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch Survey Question Group API
     */
    const getSurveyQuestionGroups = async () => {
        try {
            const response = await axios.get("/api/surveyQuestionGroup");
            setSurveyQuestionGroups(response.data);
        } catch (error) {
            console.error(
                "There was an error fetching the survey question groups!",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuestions();
        getSurveys();
        getSurveyQuestionGroups();
    }, []);

    const handleSurveyClick = (survey) => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            surveyType: survey.survey_name,
        }));
    };

    const handleQuestionGroupClick = (group) => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            questionGroup: group.question_group_name,
        }));
    };

    const exportResponsesToJson = () => {
        const jsonResponse = JSON.stringify(response);
        console.log(jsonResponse);
        // Trigger file download or send it to a server
        const blob = new Blob([jsonResponse], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "responses.json";
        link.click();
    };

    const isFormComplete = () => {
        return (
            response.surveyType !== null &&
            response.questionGroup !== null &&
            questions.length > 0
        ); // Add additional checks as needed
    };

    return (
        <div className="card d-flex justify-content-center">
            <Stepper
                linear
                ref={stepperRef}
                style={{ flexBasis: "60rem", paddingRight: "2rem" }}
            >
                {/* Step 1 - Survey Type */}
                <StepperPanel header="Survey Type">
                    <div className="d-flex flex-column">
                        <div
                            className="rounded surface-ground flex-auto d-flex font-medium ms-5 me-5"
                            style={{ height: "50vh" }}
                        >
                            <div className="d-flex flex-column">
                                <h5 className="text-muted">Step 1</h5>
                                <h1>Apa Nama Tipe Survey Anda?</h1>
                                <div
                                    className="d-flex flex-row flex-wrap"
                                    style={{ gap: "25px" }}
                                >
                                    {surveys.map((survey, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                handleSurveyClick(survey)
                                            }
                                            className={`btn btn-lg m-2 flex-fill ${
                                                response.surveyType ===
                                                survey.survey_name
                                                    ? "btn-primary"
                                                    : "btn-outline-primary"
                                            }`}
                                            style={{
                                                height: "100px",
                                                minWidth: "200px",
                                                fontSize: "18px",
                                                borderRadius: "30px",
                                            }}
                                        >
                                            {survey.survey_name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-end">
                        <Button
                            label="Next"
                            className="rounded"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            disabled={response.surveyType === null}
                            onClick={() => stepperRef.current.nextCallback()}
                        />
                    </div>
                </StepperPanel>

                {/* Step 2 - Question Group Name */}
                <StepperPanel header="Question Group Name">
                    <div className="d-flex flex-column">
                        <div
                            className="rounded surface-ground flex-auto d-flex font-medium"
                            style={{ height: "50vh" }}
                        >
                            <div className="d-flex flex-column">
                                <h5 className="text-muted">Step 2</h5>
                                <h1>Apakah Grup {response.surveyType} Anda?</h1>
                                <div
                                    className="d-flex flex-row flex-wrap"
                                    style={{ gap: "25px" }}
                                >
                                    {surveyQuestionGroups
                                        .filter((group) =>
                                            group.question_group_name.includes(
                                                response.surveyType
                                            )
                                        )
                                        .map((group, index) => {
                                            const groupNameAfterDash = group.question_group_name
                                                .substring(
                                                    group.question_group_name.indexOf(
                                                        "-"
                                                    ) + 1
                                                )
                                                .trim();
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        handleQuestionGroupClick(
                                                            group
                                                        )
                                                    }
                                                    className={`btn btn-lg m-2 flex-fill ${
                                                        response.questionGroup ===
                                                        group.question_group_name
                                                            ? "btn-primary"
                                                            : "btn-outline-primary"
                                                    }`}
                                                    style={{
                                                        height: "100px",
                                                        minWidth: "200px",
                                                        fontSize: "18px",
                                                        borderRadius: "30px",
                                                    }}
                                                >
                                                    {groupNameAfterDash}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-between">
                        <Button
                            label="Back"
                            className="rounded"
                            icon="pi pi-arrow-left"
                            severity="secondary"
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                        <Button
                            label="Next"
                            className="rounded"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            disabled={response.questionGroup === null}
                            onClick={() => stepperRef.current.nextCallback()}
                        />
                    </div>
                </StepperPanel>

                {/* Step 3 - Rest of Survey */}
                <StepperPanel header="Header III">
                    <div className="d-flex flex-column">
                        <div
                            className="rounded surface-ground flex-auto d-flex justify-content-center align-items-center font-medium"
                            style={{ height: "50vh" }}
                        >
                            Content III
                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-start">
                        <Button
                            label="Back"
                            className="rounded"
                            icon="pi pi-arrow-left"
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                    </div>
                </StepperPanel>
            </Stepper>

            {/* Export Button */}
            <div className="d-flex justify-content-center pt-4">
                <Button
                    label="Export Responses"
                    className="rounded"
                    severity="success"
                    onClick={exportResponsesToJson}
                    disabled={!isFormComplete()}
                />
            </div>
        </div>
    );
}
