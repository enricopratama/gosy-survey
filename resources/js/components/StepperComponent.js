import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import ButtonComponent from "./ButtonComponent";
import axios from "axios";

export default function StepperComponent() {
    const stepperRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState({});

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
        if (currentStep < questions.length - 1) {
            stepperRef.current.nextCallback();
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            stepperRef.current.prevCallback();
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleResponseChange = (questionId, response) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: response,
        }));
    };

    const getOptions = (question) => {
        return Object.keys(question)
            .filter((key) => key.startsWith("option_") && question[key] !== "")
            .map((key) => ({
                key,
                value: question[key],
            }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card flex justify-content-center mx-auto">
            <Stepper
                ref={stepperRef}
                activeIndex={currentStep}
                style={{ flexBasis: "50rem" }}
                orientation="vertical"
            >
                {questions.map((question, index) => (
                    <StepperPanel
                        key={question.question_id}
                        header={`Step ${index + 1}, ${
                            question.question_group_name
                        }`}
                    >
                        <div className="flex flex-column h-12rem">
                            <div className="border-2 surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium mx-auto">
                                <div>
                                    <p>{question.question_name}</p>
                                    {question.question_type === "Choice" ? (
                                        getOptions(question).map(
                                            (option, optIndex) => (
                                                <div key={optIndex}>
                                                    <input
                                                        type="radio"
                                                        name={`question_${question.question_id}`}
                                                        value={option.value}
                                                        checked={
                                                            responses[
                                                                question
                                                                    .question_id
                                                            ] === option.value
                                                        }
                                                        onChange={() =>
                                                            handleResponseChange(
                                                                question.question_id,
                                                                option.value
                                                            )
                                                        }
                                                    />
                                                    <label>
                                                        {option.value}
                                                    </label>
                                                </div>
                                            )
                                        )
                                    ) : question.question_type === "Text" ? (
                                        <input
                                            type="text"
                                            name={`question_${question.question_id}`}
                                            value={
                                                responses[
                                                    question.question_id
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                handleResponseChange(
                                                    question.question_id,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={
                                                getOptions(question)[0]
                                                    ?.value || ""
                                            }
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="flex pt-4 justify-content-between">
                            {index > 0 && (
                                <ButtonComponent
                                    label="Back"
                                    severity="secondary"
                                    icon="pi pi-arrow-left"
                                    className="custom-button"
                                    onClick={handleBack}
                                />
                            )}
                            {index < questions.length - 1 && (
                                <ButtonComponent
                                    label="Next"
                                    icon="pi pi-arrow-right"
                                    iconPos="right"
                                    className="custom-button"
                                    onClick={handleNext}
                                />
                            )}
                        </div>
                    </StepperPanel>
                ))}
            </Stepper>
        </div>
    );
}
