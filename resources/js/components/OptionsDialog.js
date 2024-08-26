import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import "../../css/DataTable.css";

export default function OptionsDialog({
    visible,
    onHide,
    selectedRow,
    updateResponse,
    questions,
}) {
    const [optionsData, setOptionsData] = useState([]);
    const [questionsFiltered, setQuestionsFiltered] = useState([]);

    // Function to extract unique question group names and corresponding flows
    const getQuestionGroupOptions = () => {
        const uniqueGroups = [];
        const groupMap = {};

        questions.forEach((question) => {
            if (question.is_parent && !groupMap[question.question_group_id]) {
                groupMap[question.question_group_id] = {
                    label: question.question_group_name,
                    value: question.question_key, // Store the question_key as the value
                };
                uniqueGroups.push(groupMap[question.question_group_id]);
            }
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
        const options = extractOptionsData(selectedRow);
        setOptionsData(options);
    }, [selectedRow, questions]);

    const onRowEditComplete = (e) => {
        let _optionsData = [...optionsData];
        let { newData, index } = e;

        _optionsData[index] = newData;

        setOptionsData(_optionsData);
    };

    const handleSave = () => {
        const updatedResponse = { ...selectedRow };
        optionsData.forEach((data, index) => {
            updatedResponse[`option_${index + 1}`] =
                data.option_data !== "" ? data.option_data : null;
            updatedResponse[`option_${index + 1}_flow`] =
                data.option_flow !== "" ? data.option_flow : null;
        });

        updateResponse(updatedResponse);
        onHide();
    };

    const textEditor = (options) => (
        <InputText
            type="text"
            value={options.value || ""}
            onChange={(e) => options.editorCallback(e.target.value)}
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
                highlightOnSelect={false}
                checkmark={true}
                editable={true}
                clearIcon={true}
            />
        );
    };

    const dialogFooterTemplate = () => (
        <div className="mt-2">
            <Button
                label="Save"
                className="rounded me-2"
                icon="pi pi-check"
                onClick={handleSave}
            />
        </div>
    );

    return (
        <Dialog
            header={selectedRow.question_name}
            visible={visible}
            style={{ width: "65vw", maxHeight: "90vh" }}
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
                                (group) => group.value === rowData.option_flow
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
    );
}
