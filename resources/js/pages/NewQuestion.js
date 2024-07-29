import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import axios from "axios";

export default function NewQuestion() {
    const stepperRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        getQuestions();
        getSurveys();
    }, []);

    return (
        <div className="card d-flex justify-content-center">
            <Stepper linear ref={stepperRef} style={{ flexBasis: "60rem" }}>
                <StepperPanel header="Survey Type">
                    <div className="d-flex flex-column">
                        <div
                            className="rounded surface-ground flex-auto d-flex font-medium"
                            style={{ height: "50vh" }}
                        >
                            <div className="d-flex flex-column">
                                <h5 className="text-muted">Step 1</h5>
                                <h1>Pilih Nama Tipe Survey</h1>
                                {surveys.map((survey, index) => (
                                    <div key={index}>{survey.survey_name} </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-end">
                        <Button
                            label="Next"
                            className="rounded"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            onClick={() => stepperRef.current.nextCallback()}
                        />
                    </div>
                </StepperPanel>
                <StepperPanel header="Header II">
                    <div className="d-flex flex-column">
                        <div
                            className="rounded surface-ground flex-auto d-flex font-medium"
                            style={{ height: "50vh" }}
                        >
                            <div className="d-flex flex-column">
                                <h5 className="text-muted">Step 2</h5>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-between">
                        <Button
                            label="Back"
                            className="rounded"
                            icon="pi pi-arrow-left"
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                        <Button
                            label="Next"
                            className="rounded"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            onClick={() => stepperRef.current.nextCallback()}
                        />
                    </div>
                </StepperPanel>
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
        </div>
    );
}
