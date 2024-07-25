import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import ButtonComponent from "./ButtonComponent";
import axios from "axios";

export default function StepperCopy() {
    const stepperRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
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

    // runs after each render
    useEffect(() => {
        getQuestions();
    }, []);

    return (
        <div className="card flex justify-content-center mx-auto">
            <Stepper
                linear
                ref={stepperRef}
                style={{ flexBasis: "10rem" }}
                orientation="vertical"
            >
                <StepperPanel header="Header I">
                    <StepperPanel header="Header I">
                        <div className="flex flex-column h-12rem ">
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium mx-auto">
                                Content I
                            </div>
                        </div>
                        <div className="flex pt-4 justify-content-end">
                            <ButtonComponent
                                label="Next"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                className="custom-button"
                                onClick={() =>
                                    stepperRef.current.nextCallback()
                                }
                            />
                        </div>
                    </StepperPanel>
                    <div className="flex pt-4 justify-content-end">
                        <ButtonComponent
                            label="Next"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            className="custom-button"
                            onClick={() => stepperRef.current.nextCallback()}
                        />
                    </div>
                </StepperPanel>
                <StepperPanel header="Header II">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                            Content II
                        </div>
                    </div>
                    <div className="flex pt-4 justify-content-between">
                        <ButtonComponent
                            label="Back"
                            icon="pi pi-arrow-left"
                            iconPos="right"
                            className="custom-button"
                            severity="secondary"
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                        <ButtonComponent
                            label="Next"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            className="custom-button"
                            onClick={() => stepperRef.current.nextCallback()}
                        />
                    </div>
                </StepperPanel>
                <StepperPanel header="Header III">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                            Content III
                        </div>
                    </div>
                    <div className="flex pt-4 justify-content-start">
                        <ButtonComponent
                            label="Back"
                            icon="pi pi-arrow-left"
                            iconPos="right"
                            className="custom-button"
                            severity="secondary"
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    );
}
