import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";

export default function QuestionGroupDialog({
    visible,
    onHide,
    customQuestionGroup,
    customQuestionGroupStatus,
    setCustomQuestionGroupStatus,
    submitted,
    footer,
    onQuestionGroupInputChange,
}) {
    return (
        <Dialog
            visible={visible}
            style={{ width: "32rem", maxHeight: "90vh" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Question Group Details"
            modal
            className="p-fluid"
            footer={footer}
            onHide={onHide}
        >
            <div
                className="field"
                style={{ marginBottom: "35px", marginTop: "19px" }}
            >
                <span className="p-float-label">
                    <InputText
                        id="question_group_name"
                        value={customQuestionGroup}
                        onChange={onQuestionGroupInputChange}
                        required
                        className={classNames({
                            "p-invalid": submitted && !customQuestionGroup,
                        })}
                    />
                    <label htmlFor="question_group_name" className="font-bold">
                        Question Group Name
                    </label>
                    {submitted && !customQuestionGroup && (
                        <small className="p-error">
                            Question Group Name is required
                        </small>
                    )}
                </span>
            </div>

            <div className="field" style={{ marginBottom: "35px" }}>
                <span className="p-float-label">
                    <InputNumber
                        id="data_status"
                        value={customQuestionGroupStatus}
                        onValueChange={(e) =>
                            setCustomQuestionGroupStatus(e.value)
                        }
                        required
                        className={classNames({
                            "p-invalid":
                                submitted && customQuestionGroupStatus == null,
                        })}
                    />
                    <label htmlFor="data_status" className="font-bold">
                        Status
                    </label>
                    {submitted && customQuestionGroupStatus == null && (
                        <small className="p-error">Status is required</small>
                    )}
                </span>
            </div>
        </Dialog>
    );
}
