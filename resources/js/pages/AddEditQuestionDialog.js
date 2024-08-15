import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from "primereact/checkbox";

const AddEditQuestionDialog = ({
    visible = false,
    response = {},
    onInputChange = () => {},
    onInputNumberChange = () => {},
    questionTypes = [],
    saveQuestionFooter = null,
    hideDialog = () => {},
    submitted = false,
    isSubmitted = false,
    onCheckboxChange = () => {},
}) => {
    return (
        <Dialog
            visible={visible}
            style={{ width: "32rem", maxHeight: "90vh" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Question Details"
            modal
            className="p-fluid"
            footer={saveQuestionFooter}
            onHide={hideDialog}
        >
            <div
                className="field"
                style={{ marginBottom: "35px", marginTop: "20px" }}
            >
                <span className="p-float-label">
                    <InputText
                        id="question_name"
                        value={response.question_name || ""}
                        onChange={(e) => onInputChange(e, "question_name")}
                        required
                        autoFocus
                        className={classNames({
                            "p-invalid": submitted && !response.question_name,
                        })}
                    />
                    <label htmlFor="question_name" className="font-bold">
                        Question Name
                    </label>
                </span>
                {submitted && !response.question_name && (
                    <small className="p-error">
                        Question Name is required.
                    </small>
                )}
            </div>

            <div
                className="field col"
                style={{ marginTop: "19px", marginBottom: "30px" }}
            >
                <span className="p-float-label">
                    <InputNumber
                        id="sequence"
                        name="sequence"
                        value={response.sequence}
                        required
                        className={classNames({
                            "p-invalid": submitted && !response.sequence,
                        })}
                        onValueChange={(e) =>
                            onInputNumberChange(e, "sequence")
                        }
                    />
                    <label htmlFor="sequence" className="font-bold">
                        Sequence
                    </label>
                </span>
                {submitted && !response.sequence && (
                    <small className="p-error">Sequence is required.</small>
                )}
            </div>

            <div
                className="field-checkbox d-flex align-items-center"
                style={{ marginTop: "20px", marginBottom: "20px" }}
            >
                <Checkbox
                    inputId="is_parent"
                    onChange={(e) => onCheckboxChange(e, "is_parent")}
                    checked={response.is_parent === 1}
                />
                <label htmlFor="is_parent" className="ms-2 mb-0">
                    Parent Question?
                </label>
            </div>

            <div
                className="field mb-3 mt-5"
                style={{ marginBottom: "35px", marginTop: "35px" }}
            >
                <FloatLabel
                    className={classNames("w-full md:w-14rem", {
                        "p-invalid": isSubmitted && !response.question_type,
                    })}
                >
                    <Dropdown
                        inputId="question_type"
                        value={response.question_type || ""}
                        options={questionTypes}
                        onChange={(e) => onInputChange(e, "question_type")}
                        optionLabel="label"
                        required
                        className={classNames({
                            "p-invalid": isSubmitted && !response.question_type,
                        })}
                    />
                    <label htmlFor="question_type" className="font-bold">
                        Question Type
                    </label>
                </FloatLabel>
                {isSubmitted && !response.question_type && (
                    <small className="p-error">
                        Question type is required.
                    </small>
                )}
            </div>

            <div className="formgrid grid" style={{ marginTop: "35px" }}>
                <div
                    className="field col"
                    style={{ marginTop: "35px", marginBottom: "35px" }}
                >
                    <span className="p-float-label">
                        <InputNumber
                            id="data_status"
                            value={response.data_status || 0}
                            required
                            className={classNames({
                                "p-invalid": submitted && !response.data_status,
                            })}
                            onValueChange={(e) =>
                                onInputNumberChange(e, "data_status")
                            }
                        />
                        <label htmlFor="data_status" className="font-bold">
                            Status
                        </label>
                    </span>
                    {submitted && !response.data_status && (
                        <small className="p-error">Status is required.</small>
                    )}
                </div>

                <hr style={{ width: "100%", margin: "20px 0" }} />

                <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                        marginTop: "40px",
                    }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="question_group_id"
                            value={response.question_group_id || ""}
                            onChange={(e) =>
                                onInputChange(e, "question_group_id")
                            }
                            className={classNames({
                                "p-invalid":
                                    submitted && !response.question_group_id,
                            })}
                        />
                        <label
                            htmlFor="question_group_id"
                            className="font-bold"
                        >
                            Question Group ID
                        </label>
                    </span>
                    {submitted && !response.question_group_id && (
                        <small className="p-error">
                            Question Group ID is required.
                        </small>
                    )}
                </div>

                <div className="field" style={{ marginBottom: "35px" }}>
                    <span className="p-float-label">
                        <InputText
                            id="survey_name"
                            style={{ minWidth: "20rem" }}
                            value={response.survey_name || ""}
                            readOnly={true}
                        />
                        <label htmlFor="survey_name" className="font-bold">
                            Survey Name
                        </label>
                    </span>
                </div>

                <div
                    className="field"
                    style={{ marginBottom: "35px", minWidth: "12rem" }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="question_group_name"
                            style={{ minWidth: "20rem" }}
                            value={response.question_group_name || ""}
                            readOnly={true}
                        />
                        <label
                            htmlFor="question_group_name"
                            className="font-bold"
                        >
                            Question Group Name
                        </label>
                    </span>
                </div>
            </div>
        </Dialog>
    );
};

export default AddEditQuestionDialog;
