import React, { useState, useEffect, useContext } from "react";
import { Step, StepGroup, Stepper } from "@cimpress/react-components";
import axios from "axios";
import { Skeleton } from "primereact/skeleton";
import { RenderQuestion } from "./RenderQuestion";

const StepperDemo = () => {
    const [activeStep, setActiveStep] = useState("0");
    const [verticalActiveStep, setVerticalActiveStep] = useState("0");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currResponse, setCurrResponse] = useState(null);
    const [responses, setResponses] = useState({});

    const setStep = (index) => {
        setActiveStep(index);
    };

    const setVerticalStep = (index) => {
        setVerticalActiveStep(index);
    };

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

    useEffect(() => {
        getQuestions();
    }, []);

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrResponse(
                responses[questions[currentQuestionIndex + 1]?.question_id] ||
                    null
            );
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setCurrResponse(
                responses[questions[currentQuestionIndex - 1]?.question_id] ||
                    null
            );
        }
    };

    const handleInputChange = (e, questionId) => {
        const value = e.target.value;
        setCurrResponse(value);
        setResponses({
            ...responses,
            [questionId]: e.target.value,
        });
    };

    const currentQuestion = questions[currentQuestionIndex];

    /**
     * Renders the options for each question
     * @param {*} question A question
     * @returns A rendered HTML element of 9 options per question
     * RI: count(currentQuestion.option_x) <= 9
     */
    const renderOptions = (question) => {
        const options = [];
        for (let i = 1; i <= 9; i++) {
            const option = question[`option_${i}`];
            if (option && currentQuestion.question_type === "Choice") {
                options.push(
                    <div key={i}>
                        <input
                            type="radio"
                            id={`option_${i}`}
                            name="options"
                            value={option}
                        />
                        <label htmlFor={`option_${i}`}>{option}</label>
                    </div>
                );
            } else if (option && currentQuestion.question_type === "Text") {
                options.push(
                    <div key={i}>
                        <label htmlFor={`text_option_${i}`}>{option}</label>
                        <input
                            type="text"
                            id={`text_option_${i}`}
                            name={`text_option_${question.question_id}`}
                            value={responses[question.question_id] || ""}
                            onChange={(e) =>
                                handleInputChange(e, question.question_id)
                            }
                        />
                    </div>
                );
            }
        }
        return options;
    };

    const checkmarkIcon = "✓";

    return (
        <div className="container-fluid p-5">
            <div className="row">
                <div className="col-12 col-md-4">
                    <div className="overflow-y-auto col-12 h-100">
                        {loading ? (
                            <Skeleton width="10rem" className="mb-2"></Skeleton>
                        ) : (
                            <h3>GOSY Survey Questions</h3>
                        )}

                        {loading ? (
                            <>
                                <Skeleton
                                    width="10rem"
                                    className="mb-2"
                                ></Skeleton>
                                <Skeleton
                                    width="5rem"
                                    className="mb-2"
                                ></Skeleton>
                                <Skeleton
                                    height="2rem"
                                    className="mb-2"
                                ></Skeleton>
                            </>
                        ) : (
                            <p>
                                <strong>
                                    Pellentesque habitant morbi tristique
                                </strong>{" "}
                                senectus et netus et malesuada fames ac turpis
                                egestas. Vestibulum tortor quam, feugiat vitae,
                                ultricies eget, tempor sit amet, ante. Donec eu
                                libero sit amet quam egestas semper.{" "}
                                <em>Aenean ultricies mi vitae est.</em> Mauris
                                placerat eleifend leo. Quisque sit amet est et
                                sapien ullamcorper pharetra. Vestibulum erat
                                wisi, condimentum sed,{" "}
                                <code>commodo vitae</code>, ornare sit amet,
                                wisi. Aenean fermentum, elit eget tincidunt
                                condimentum, eros ipsum rutrum orci, sagittis
                                tempus lacus enim ac dui.{" "}
                            </p>
                        )}
                        {/* Stepper Mobile Only */}
                        <div className="overflow-x-auto d-md-none d-block">
                            {/* <Stepper
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
                           </Stepper> */}
                            <div style={{ height: "50vh" }}>
                                <Stepper
                                    activeStep={verticalActiveStep}
                                    vertical
                                >
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
                                        contents={<div>Step Three</div>}
                                    >
                                        <Step
                                            tip="This step causes Step Three to inherit the danger color"
                                            onClick={() =>
                                                setVerticalStep("2.0")
                                            }
                                        >
                                            <div>Sub-step one</div>
                                        </Step>
                                        <Step
                                            onClick={() =>
                                                setVerticalStep("2.1")
                                            }
                                        >
                                            <div>Sub-step two</div>
                                        </Step>
                                        <Step
                                            onClick={() =>
                                                setVerticalStep("2.2")
                                            }
                                        >
                                            <div>Sub-step three</div>
                                        </Step>
                                    </StepGroup>
                                    <Step
                                        onClick={() => setVerticalStep("3")}
                                        icon={checkmarkIcon}
                                    >
                                        <div>Step With Custom Icon</div>
                                    </Step>
                                </Stepper>
                            </div>
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
                                    contents={<div>Step Three</div>}
                                >
                                    <Step
                                        tip="This step causes Step Three to inherit the danger color"
                                        onClick={() => setVerticalStep("2.0")}
                                    >
                                        <div>Sub-step one</div>
                                    </Step>
                                    <Step
                                        onClick={() => setVerticalStep("2.1")}
                                    >
                                        <div>Sub-step two</div>
                                    </Step>
                                    <Step
                                        onClick={() => setVerticalStep("2.2")}
                                    >
                                        <div>Sub-step three</div>
                                    </Step>
                                </StepGroup>
                                <Step
                                    onClick={() => setVerticalStep("3")}
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
                    <RenderQuestion
                        currentQuestion={currentQuestion}
                        currentQuestionIndex={currentQuestionIndex}
                        questions={questions}
                        handlePrev={handlePrev}
                        handleNext={handleNext}
                        renderOptions={renderOptions}
                        currResponse={currResponse}
                    />
                </div>
            </div>

            {/* Text on Mobile */}
            <div className="row d-md-none d-block p-2">
                <RenderQuestion
                    currentQuestion={currentQuestion}
                    currentQuestionIndex={currentQuestionIndex}
                    questions={questions}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    renderOptions={renderOptions}
                    currResponse={currResponse}
                />
            </div>
        </div>
    );
};

export default StepperDemo;
