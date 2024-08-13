import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { SelectButton } from "primereact/selectbutton";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import LeftToolbar from "./LeftToolbar";
import RightToolbar from "./RightToolbar";

export default function SurveyTable() {
    const [questions, setQuestions] = useState([]);
    const [questionDialog, setQuestionDialog] = useState(false);
    const [deleteQuestionDialog, setDeleteQuestionDialog] = useState(false);
    const [deleteQuestionsDialog, setDeleteQuestionsDialog] = useState(false);
    const [question, setQuestion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestions, setSelectedQuestions] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [editState, setEditState] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    const [sizeOptions] = useState([
        { label: "Small", value: "small" },
        { label: "Normal", value: "normal" },
        { label: "Large", value: "large" },
    ]);
    const initialSize =
        window.innerHeight > 640 && window.innerWidth > 540
            ? sizeOptions[1].value // "Normal" for tablets and larger
            : sizeOptions[0].value; // "Small" for mobile

    const [size, setSize] = useState(initialSize);

    // Handle the change f Window Size
    useEffect(() => {
        const handleResize = () => {
            setSize(
                window.innerHeight > 640 && window.innerWidth > 540
                    ? sizeOptions[1].value
                    : sizeOptions[0].value
            );
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        question_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    /**
     * Initialise an empty question
     */
    const initialEmptyQuestion = {
        question_key: "",
        question_group_id: null,
        sequence: null,
        question_name: "",
        question_type: "",
        data_status: null,
    };

    /**
     * Fetch Questions API and POST Max ID
     */
    const getQuestions = async () => {
        try {
            const response = await axios.get("/api/questions");
            setQuestions(response.data);
            setQuestion({
                ...initialEmptyQuestion,
            });
        } catch (error) {
            console.error("Error fetching the questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuestions();
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || "";
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { ...prevFilters.global, value },
        }));
        setGlobalFilterValue(value);
    };

    const openNew = () => {
        setQuestion({
            ...initialEmptyQuestion,
        });
        setSubmitted(false);
        setQuestionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setQuestionDialog(false);
        setEditState(false);
    };

    const hideDeleteQuestionDialog = () => {
        setDeleteQuestionDialog(false);
        setEditState(false);
    };

    const hideDeleteQuestionsDialog = () => {
        setDeleteQuestionsDialog(false);
        setEditState(false);
    };

    const saveQuestion = async () => {
        setSubmitted(true);

        if (question.question_name.trim()) {
            let _questions = [...questions];
            let _question = { ...question };

            if (_question.question_id) {
                const index = findIndexById(_question.question_id);
                if (index >= 0) {
                    _questions[index] = _question;
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Question Updated",
                        life: 2000,
                    });
                } else {
                    _questions.push(_question);
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Question Created",
                        life: 2000,
                    });
                }
            }

            var formData = new FormData(); // JS built in FormData
            formData.append("question_group_id", _question.question_group_id);
            formData.append("question_name", _question.question_name);
            formData.append("question_key", _question.question_key);
            formData.append("question_type", _question.question_type);
            formData.append("sequence", _question.sequence);
            formData.append("status", _question.status);
            formData.append("data_status", _question.data_status);
            var url = "/addQuestion";
            var hasil = await axios({
                method: "post",
                url: url,
                data: formData,
            }).then(function (response) {
                return response;
            });
            setQuestions(_questions);
            setQuestionDialog(false);
            setQuestion(initialEmptyQuestion);
            setEditState(false);
            getQuestions();
        }
    };

    const editQuestion = (question) => {
        setQuestion({ ...question });
        setQuestionDialog(true);
        setEditState(true);
    };

    const confirmDeleteQuestion = (question) => {
        setQuestion(question);
        setDeleteQuestionDialog(true);
        setEditState(false);
    };

    const deleteQuestion = () => {
        let _questions = questions.filter(
            (val) => val.question_id !== question.question_id
        );

        setQuestions(_questions);
        setDeleteQuestionDialog(false);
        setQuestion(initialEmptyQuestion);
        setEditState(false);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Question Deleted",
            life: 2000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < questions.length; i++) {
            if (questions[i].question_id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteQuestionsDialog(true);
        setEditState(false);
    };

    const deleteSelectedQuestions = () => {
        let _questions = questions.filter(
            (val) => !selectedQuestions.includes(val)
        );

        setQuestions(_questions);
        setDeleteQuestionsDialog(false);
        setSelectedQuestions(null);
        setEditState(false);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Questions Deleted",
            life: 2000,
        });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _question = { ...question };
        _question[`${name}`] = val;
        setQuestion(_question);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _question = { ...question };
        _question[`${name}`] = val;
        setQuestion(_question);
    };

    const leftToolbarTemplate = () => {
        return (
            <LeftToolbar
                openNew={openNew}
                confirmDeleteSelected={confirmDeleteSelected}
                selectedQuestions={selectedQuestions}
            />
        );
    };

    const rightToolbarTemplate = () => {
        return <RightToolbar exportCSV={exportCSV} />;
    };

    const paginatorLeft = (
        <Button
            type="button"
            icon="pi pi-refresh"
            text
            onClick={getQuestions}
        />
    );
    const paginatorRight = (
        <Button type="button" icon="pi pi-download" text onClick={exportCSV} />
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="me-2 rounded-pill"
                    outlined
                    onClick={() => {
                        setEditState(true);
                        editQuestion(rowData);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    className="rounded-pill"
                    onClick={() => confirmDeleteQuestion(rowData)}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="d-flex gap-2 justify-content-between align-items-center flex-wrap">
            <h4 className="m-0">Manage Questions</h4>
            <IconField iconPosition="left" className="me-3">
                <InputIcon className="pi pi-search" />
                <InputText
                    value={globalFilterValue}
                    type="search"
                    onChange={onGlobalFilterChange}
                    placeholder="Search..."
                />
            </IconField>
        </div>
    );

    const questionDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                iconPos="left"
                className="ms-2 rounded"
                outlined
                onClick={hideDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="ms-2 rounded"
                iconPos="left"
                onClick={saveQuestion}
            />
        </React.Fragment>
    );

    const deleteQuestionDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                iconPos="left"
                className="ms-2"
                outlined
                onClick={hideDeleteQuestionDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                iconPos="left"
                severity="danger"
                className="ms-2"
                onClick={deleteQuestion}
            />
        </React.Fragment>
    );

    const deleteQuestionsDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                iconPos="left"
                outlined
                onClick={hideDeleteQuestionsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                className="ms-2"
                iconPos="left"
                severity="danger"
                onClick={deleteSelectedQuestions}
            />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <div className="d-flex justify-content-center mb-4 mt-4">
                    <SelectButton
                        value={size}
                        onChange={(e) => setSize(e.value)}
                        options={sizeOptions}
                    />
                </div>
                <Toolbar
                    className="mb-4"
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>

                <DataTable
                    ref={dt}
                    value={questions}
                    selection={selectedQuestions}
                    onSelectionChange={(e) => setSelectedQuestions(e.value)}
                    dataKey="question_id"
                    paginator
                    size={size}
                    removableSort
                    paginatorLeft={paginatorLeft}
                    paginatorRight={paginatorRight}
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown showGridlines"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} questions"
                    filters={filters}
                    header={header}
                    stripedRows
                    sortField="question_id"
                    sortOrder={1}
                    dragSelection
                >
                    <Column
                        selectionMode="multiple"
                        exportable={false}
                    ></Column>
                    <Column
                        header="No."
                        headerStyle={{ width: "3rem" }}
                        body={(data, options) => options.rowIndex + 1}
                        exportable={false}
                    />
                    <Column
                        field="question_id"
                        header="Question ID"
                        sortable
                        style={{ width: "2rem" }}
                    ></Column>
                    <Column
                        field="question_name"
                        header="Question Name"
                        sortable
                        style={{ minWidth: "20rem" }}
                    ></Column>
                    <Column
                        field="question_key"
                        header="Question Key"
                        sortable
                        style={{ width: "2rem" }}
                    ></Column>
                    <Column
                        field="question_group_id"
                        header="Question Group ID"
                        sortable
                        style={{ width: "2rem" }}
                    ></Column>
                    <Column
                        field="sequence"
                        header="Sequence"
                        sortable
                        style={{ width: "4rem" }}
                    ></Column>

                    <Column
                        field="data_status"
                        header="Status"
                        sortable
                        style={{ width: "12rem" }}
                    ></Column>
                    <Column
                        field="question_type"
                        header="Question Type"
                        sortable
                        style={{ width: "8rem" }}
                    ></Column>
                    <Column
                        body={actionBodyTemplate}
                        field="Edit"
                        exportable={false}
                        style={{ minWidth: "12rem" }}
                        frozen
                        alignFrozen="right"
                    ></Column>
                </DataTable>
            </div>

            {/* Add Question Dialog */}
            <Dialog
                visible={questionDialog}
                style={{ width: "32rem", maxHeight: "90vh" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Add Question"
                modal
                className="p-fluid"
                footer={questionDialogFooter}
                onHide={hideDialog}
            >
                <div
                    className="field"
                    style={{ marginBottom: "35px", marginTop: "20px" }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="question_group_id"
                            value={question.question_group_id}
                            onChange={(e) =>
                                onInputChange(e, "question_group_id")
                            }
                            required
                            autoFocus
                            className={classNames({
                                "p-invalid":
                                    submitted && !question.question_group_id,
                            })}
                        />
                        <label
                            htmlFor="question_group_id"
                            className="font-bold"
                        >
                            Question Group ID
                        </label>
                    </span>
                    {submitted && !question.question_group_id && (
                        <small className="p-error">
                            Question Group ID is required.
                        </small>
                    )}
                </div>

                <div className="field" style={{ marginBottom: "35px" }}>
                    <span className="p-float-label">
                        <InputText
                            id="question_name"
                            value={question.question_name}
                            onChange={(e) => onInputChange(e, "question_name")}
                            required
                            className={classNames({
                                "p-invalid":
                                    submitted && !question.question_name,
                            })}
                        />
                        <label htmlFor="question_name" className="font-bold">
                            Question Name
                        </label>
                    </span>
                    {submitted && !question.question_name && (
                        <small className="p-error">
                            Question Name is required.
                        </small>
                    )}
                </div>

                <div className="field" style={{ marginBottom: "35px" }}>
                    <span className="p-float-label">
                        <InputText
                            id="question_key"
                            value={question.question_key}
                            onChange={(e) => onInputChange(e, "question_key")}
                            required
                            className={classNames({
                                "p-invalid":
                                    submitted && !question.question_key,
                            })}
                        />
                        <label htmlFor="question_key" className="font-bold">
                            Question Key
                        </label>
                    </span>
                    {submitted && !question.question_key && (
                        <small className="p-error">
                            Question Key is required.
                        </small>
                    )}
                </div>

                <div
                    className="field mb-3 mt-3"
                    style={{ marginBottom: "35px" }}
                >
                    <label htmlFor="question_type" className="font-bold">
                        Question Type:
                    </label>
                    <select
                        id="question_type"
                        name="question_type"
                        // value={question.question_type}
                        onChange={(e) => onInputChange(e, "question_type")}
                        required
                        className={classNames({
                            "p-invalid": submitted && !question.question_type,
                        })}
                    >
                        <option value="Choice">Choice</option>
                        <option value="Text">Text</option>
                        <option value="Paragraph">Paragraph</option>
                        <option value="Checkboxes">Checkboxes</option>
                        <option value="Dropdown">Dropdown</option>
                    </select>
                    {submitted && !question.question_type && (
                        <small className="p-error">
                            Question type is required.
                        </small>
                    )}
                </div>

                <div className="formgrid grid" style={{ marginTop: "35px" }}>
                    <div className="field col">
                        <span className="p-float-label">
                            <InputNumber
                                id="sequence"
                                name="sequence"
                                value={question.sequence}
                                required
                                onValueChange={(e) =>
                                    onInputNumberChange(e, "sequence")
                                }
                            />
                            <label htmlFor="sequence" className="font-bold">
                                Sequence
                            </label>
                        </span>
                        {submitted && !question.sequence && (
                            <small className="p-error">
                                Sequence is required.
                            </small>
                        )}
                    </div>
                    <div className="field col" style={{ marginTop: "35px" }}>
                        <span className="p-float-label">
                            <InputNumber
                                id="data_status"
                                value={question.data_status}
                                required
                                onValueChange={(e) =>
                                    onInputNumberChange(e, "data_status")
                                }
                            />
                            <label htmlFor="data_status" className="font-bold">
                                Status
                            </label>
                        </span>
                        {submitted && !question.data_status && (
                            <small className="p-error">
                                Status is required.
                            </small>
                        )}
                    </div>
                </div>
            </Dialog>

            {/* Delete Question Dialog */}
            <Dialog
                visible={deleteQuestionDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Confirm"
                modal
                footer={deleteQuestionDialogFooter}
                onHide={hideDeleteQuestionDialog}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle me-3"
                        style={{ fontSize: "2rem" }}
                    />
                    {question && (
                        <span>
                            Are you sure you want to delete{" "}
                            <b>{question.question_name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            {/* Delete Questions Dialog */}
            <Dialog
                visible={deleteQuestionsDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Confirm"
                modal
                footer={deleteQuestionsDialogFooter}
                onHide={hideDeleteQuestionsDialog}
            >
                <div className="d-flex align-middle">
                    <div className="confirmation-content">
                        <i
                            className="pi pi-exclamation-triangle me-3"
                            style={{ fontSize: "2rem" }}
                        />
                        {question && (
                            <span className="">
                                Are you sure you want to delete the selected
                                questions?
                            </span>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
