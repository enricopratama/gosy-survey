import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import "../../css/DataTable.css";
import { Toast } from "primereact/toast";

export default function OptionsDialog({
    visible,
    onHide,
    selectedRow,
    questions,
}) {
    const [optionsData, setOptionsData] = useState([]);
    const [questionsFiltered, setQuestionsFiltered] = useState([]);

    const toast = useRef(null);

    // Function to extract unique question group names and corresponding flows
    const getQuestionGroupOptions = () => {
        const uniqueGroups = [];
        const groupMap = {};

        questions.forEach((question) => {
            if (question.is_parent && !groupMap[question.question_group_id]) {
                groupMap[question.question_group_id] = {
                    label: question.question_group_name,
                    value: question.question_key,
                };
                uniqueGroups.push(groupMap[question.question_group_id]);
            }
        });

        uniqueGroups.push({
            label: "End Survey",
            value: "99999",
        });

        setQuestionsFiltered(uniqueGroups);
    };

    // Function to reformat options data from selectedRow
    const extractOptionsData = (row) => {
        const extractedOptions = [];

        const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

        if (row) {
            for (let i = 1; i <= 9; i++) {
                extractedOptions.push({
                    option_num: `Jawaban ${alphabet[i - 1]}`,
                    option_data: row[`option_${i}`] || "",
                    option_flow: row[`option_${i}_flow`] || "",
                });
            }
        }

        return extractedOptions;
    };

    useEffect(() => {
        getQuestionGroupOptions(); // Load the unique question groups on mount
        // const options = extractOptionsData(selectedRow);
        setOptionsData(extractOptionsData(selectedRow));
    }, [selectedRow, questions]);

    const onRowEditComplete = async (e) => {
        // Reformat Questions
        const updatedResponse = { ...selectedRow };
        optionsData.forEach((data, index) => {
            updatedResponse[`option_${index + 1}`] =
                data.option_data !== "" ? data.option_data : null;
            updatedResponse[`option_${index + 1}_flow`] =
                data.option_flow !== "" ? data.option_flow : null;
        });

        let _optionsData = [...optionsData];
        let { newData, index } = e; // e contains the new data

        _optionsData[index] = newData;

        try {
            // Make an API call to update the question in the backend
            const result = await axios.post(
                `/editQuestion/${selectedRow.question_id}`,
                updatedResponse
            );

            console.log("Result", result);

            if (result.status === 200) {
                // Update the question in the local state after successful API call (ALWAYS MAKE A COPY, else painful hours of debugging)

                // Optionally, show a success message
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: `Question ID ${selectedRow.question_id} updated successfully`,
                    life: 3000,
                });
            }
        } catch (error) {
            // Handle error, revert the changes in the UI, and notify the user
            console.error("Error updating question:", error);

            toast.current.show({
                severity: "error",
                summary: "Error",
                detail:
                    error.response?.data?.message ||
                    `Failed to update Question ID ${newData.question_id}`,
                life: 3000,
            });
        } finally {
            setOptionsData(_optionsData);
        }
    };

    const textEditor = (options) => (
        <InputText
            type="text"
            value={options.value || ""}
            onChange={(e) => options.editorCallback(e.target.value)}
            style={{ minWidth: "50%" }}
        />
    );

    const optionFlowsEditor = (options) => {
        return (
            <Dropdown
                value={options.value || ""}
                options={questionsFiltered}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Question Group"
                panelStyle={{ maxHeight: "600px", maxWidth: "90%" }}
                filter
                optionLabel="label"
                checkmark={true}
                editable={true}
                clearIcon={true}
                style={{ minWidth: "125%" }}
            />
        );
    };

    const dialogFooterTemplate = () => (
        <div className="mt-2">
            <Button
                label="Close"
                className="rounded me-2"
                outlined
                icon="pi pi-check"
                onClick={onHide}
            />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header={selectedRow.question_name}
                visible={visible}
                style={{ width: "70vw", maxHeight: "100vh" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                maximizable
                modal
                contentStyle={{ height: "60vh" }}
                onHide={onHide}
                footer={dialogFooterTemplate()}
            >
                <div className="card p-fluid">
                    <DataTable
                        value={optionsData}
                        editMode="row"
                        onRowEditComplete={onRowEditComplete}
                        tableStyle={{ minWidth: "60vw" }}
                        stripedRows
                        className="p-datatable-gridlines"
                    >
                        <Column
                            field="option_num"
                            style={{ width: "5%" }}
                            body={(rowData) => (
                                <strong>{rowData.option_num}</strong>
                            )}
                            className="border-left border-right"
                        />
                        <Column
                            field="option_data"
                            header="Option"
                            editor={(options) => textEditor(options)}
                            style={{ width: "10%" }}
                            className="border-left"
                        />
                        <Column
                            field="option_flow"
                            header="Next Question Group"
                            editor={(options) => optionFlowsEditor(options)}
                            body={(rowData) => {
                                const selectedGroup = questionsFiltered.find(
                                    (group) =>
                                        group.value === rowData.option_flow
                                );
                                return selectedGroup ? selectedGroup.label : "";
                            }}
                            style={{ width: "15%" }}
                        />
                        <Column
                            rowEditor={true}
                            headerStyle={{ width: "10%" }}
                            bodyStyle={{ textAlign: "right" }}
                            className=" border-right"
                        />
                    </DataTable>
                </div>
            </Dialog>
        </>
    );
}
