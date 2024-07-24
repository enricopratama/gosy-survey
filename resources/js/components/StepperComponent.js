import React, { useContext, useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { PrimeReactContext } from "primereact/api";
import "../../css/StepperComponent.css";

export default function StepperComponent() {
    const stepperRef = useRef(null);

    const { setRipple } = useContext(PrimeReactContext);
    setRipple(true);
    return (
        <div className="card flex justify-content-center">
            <Stepper linear ref={stepperRef} style={{ flexBasis: "50rem" }}>
                <StepperPanel header="Header I">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                            Content I
                        </div>
                    </div>
                    <div className="flex pt-4 justify-content-end">
                        <Button
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
                        <Button
                            label="Back"
                            className="custom-button me-2"
                            severity="secondary"
                            icon="pi pi-arrow-left"
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                        <Button
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
                        <Button
                            label="Back"
                            className="custom-button"
                            severity="secondary"
                            icon="pi pi-arrow-left"
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    );
}
