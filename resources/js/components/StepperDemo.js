import React, { useState, useEffect } from "react";
import { Step, StepGroup, Stepper } from "@cimpress/react-components";
import axios from "axios";

const StepperDemo = () => {
    const [activeStep, setActiveStep] = useState("0");
    const [verticalActiveStep, setVerticalActiveStep] = useState("0");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState({});

    const setStep = (index) => {
        setActiveStep(index);
    };

    const setVerticalStep = (index) => {
        setVerticalActiveStep(index);
    };

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

    useEffect(() => {
        getQuestions();
    }, []);

    const checkmarkIcon = "✓";

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid p-5">
            <div className="row">
                <div className="col-12 col-md-4">
                    <div className="overflow-y-auto col-12 h-100">
                        <h5>GOSY Survey Questions</h5>
                        <p>
                            Nested steps with a StepGroup are only supported for
                            full-sized vertical steppers.
                        </p>
                        {/* Stepper Mobile Only */}
                        <div className="overflow-x-auto d-md-none d-block">
                            <Stepper
                                style={{ minWidth: "450px" }}
                                activeStep={activeStep}
                            >
                                <Step onClick={() => setStep("0")}>
                                    <div>Step One</div>
                                    <small>A step</small>
                                </Step>
                                <Step onClick={() => setStep("1")}>
                                    <div>Step Two</div>
                                    <small>It's another step!</small>
                                </Step>
                                <Step
                                    onClick={() => setStep("2")}
                                    tip="Lorem ipsum tipsum"
                                >
                                    <div>Step Three</div>
                                    <small>A third step</small>
                                </Step>
                            </Stepper>
                        </div>

                        {/* Stepper Desktop Only */}
                        <div
                            style={{ height: "330px" }}
                            className="d-none d-md-block"
                        >
                            <Stepper activeStep={verticalActiveStep} vertical>
                                <Step onClick={() => setVerticalStep("0")}>
                                    <div style={{ textAlign: "left" }}>
                                        <div>
                                            Step 1 - Survey Kualitas Outlet
                                        </div>
                                        <small>Produk Kopi</small>
                                    </div>
                                </Step>
                                <Step onClick={() => setVerticalStep("1")}>
                                    <div>Step Two</div>
                                </Step>
                                <StepGroup
                                    onClick={() => setVerticalStep("2")}
                                    tip="Lorem ipsum tipsum"
                                    contents={<div>Apakah Anda Jual Kopi?</div>}
                                >
                                    <Step
                                        tip="This step causes Step Three to inherit the danger color"
                                        onClick={() => setVerticalStep("3")}
                                    >
                                        <div>Sub-step one</div>
                                    </Step>
                                    <Step onClick={() => setVerticalStep("4")}>
                                        <div>Sub-step two</div>
                                    </Step>
                                    <Step onClick={() => setVerticalStep("5")}>
                                        <div>Sub-step three</div>
                                    </Step>
                                </StepGroup>
                                <Step
                                    onClick={() => setVerticalStep("6")}
                                    icon={checkmarkIcon}
                                >
                                    <div>Step With Custom Icon</div>
                                </Step>
                            </Stepper>
                        </div>
                    </div>
                </div>

                {/* Text on Desktop */}
                <div className="col-12 col-md-6 d-md-block d-none ms-4">
                    <div className="">
                        {questions.map((question, index) => (
                            <div>
                                <p>Step {question.question_key}</p>
                                <h2>{question.question_name}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Text on Mobile */}
            <div className="row d-md-none d-block p-2">
                <div className="col-12">
                    <div className="">
                        {questions.map((question, index) => (
                            <div>
                                <p>Step {question.question_key}</p>
                                <h2>{question.question_name}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepperDemo;
