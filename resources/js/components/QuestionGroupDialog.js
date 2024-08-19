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
            <div className="field" style={{ marginBottom: "35px" }}>
                <label htmlFor="question_group_name" className="font-bold">
                    Question Group Name
                </label>
                <InputText
                    id="question_group_name"
                    value={customQuestionGroup}
                    placeholder="Enter Question Group Name"
                    onChange={onQuestionGroupInputChange}
                    required
                    className={classNames({
                        "p-invalid": submitted && !customQuestionGroup,
                    })}
                />
                {submitted && !customQuestionGroup && (
                    <small className="p-error">
                        Question Group Name is required
                    </small>
                )}
            </div>

            <div className="field" style={{ marginBottom: "35px" }}>
                <label htmlFor="data_status" className="font-bold">
                    Status
                </label>
                <InputNumber
                    id="data_status"
                    value={customQuestionGroupStatus}
                    onValueChange={(e) => setCustomQuestionGroupStatus(e.value)}
                    required
                    className={classNames({
                        "p-invalid":
                            submitted && customQuestionGroupStatus == null,
                    })}
                />
                {submitted && customQuestionGroupStatus == null && (
                    <small className="p-error">Status is required</small>
                )}
            </div>
        </Dialog>
    );
}
