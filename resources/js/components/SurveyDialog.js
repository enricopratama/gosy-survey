import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";

export default function SurveyDialog({
    visible,
    onHide,
    customSurvey,
    customSurveyStatus,
    setCustomSurveyStatus,
    submitted,
    footer,
    onSurveyInputChange,
}) {
    return (
        <Dialog
            visible={visible}
            style={{ width: "32rem", maxHeight: "90vh" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Survey Details"
            modal
            className="p-fluid"
            footer={footer}
            onHide={onHide}
        >
            <div className="field" style={{ marginBottom: "35px" }}>
                <label htmlFor="survey_name" className="font-bold">
                    Survey Type/Name
                </label>
                <InputText
                    id="survey_name"
                    value={customSurvey}
                    onChange={onSurveyInputChange}
                    required
                    placeholder="Enter Survey Name"
                    className={classNames({
                        "p-invalid": submitted && !customSurvey,
                    })}
                />
                {submitted && !customSurvey && (
                    <>
                        <Message
                            severity="error"
                            text="Survey Name is required"
                        />
                    </>
                )}
            </div>

            <div className="formgrid grid" style={{ marginTop: "35px" }}>
                <div
                    className="field col"
                    style={{ marginTop: "35px", marginBottom: "35px" }}
                >
                    <span className="p-float-label">
                        <InputNumber
                            id="custom_survey_status"
                            value={customSurveyStatus}
                            required
                            className={classNames({
                                "p-invalid": submitted && !customSurveyStatus,
                            })}
                            onValueChange={(e) =>
                                setCustomSurveyStatus(e.value)
                            }
                        />
                        <label
                            htmlFor="custom_survey_status"
                            className="font-bold"
                        >
                            Status
                        </label>
                    </span>
                    {submitted && !customSurveyStatus && (
                        <small className="p-error">Status is required.</small>
                    )}
                </div>
            </div>
        </Dialog>
    );
}
