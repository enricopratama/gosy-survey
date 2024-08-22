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

    const groupedQuestions = questions.reduce((groups, question) => {
        const group = groups[question.question_group_id] || {
            question_group_name: question.question_group_name,
            items: [],
        };

        group.items.push({
            label: question.question_name,
            value: question.question_key,
        });

        groups[question.question_group_id] = group;
        return groups;
    }, {});

    // Convert grouped questions into the format expected by the Dropdown
    const dropdownOptions = Object.keys(groupedQuestions).map((groupId) => ({
        label: groupedQuestions[groupId].question_group_name,
        items: groupedQuestions[groupId].items,
    }));

    // Function to reformat options data from selectedRow
    const extractOptionsData = (row) => {
        const extractedOptions = [];

        if (row) {
            for (let i = 1; i <= 9; i++) {
                extractedOptions.push({
                    option_num: `option_${i}`,
                    option_data: row[`option_${i}`] || "",
                    option_flow: row[`option_${i}_flow`] || "",
                });
            }
        }

        return extractedOptions;
    };

    useEffect(() => {
        const options = extractOptionsData(selectedRow);
        setOptionsData(options);
    }, [selectedRow]);

    const onRowEditComplete = (e) => {
        let _optionsData = [...optionsData];
        let { newData, index } = e;

        _optionsData[index] = newData;

        setOptionsData(_optionsData);
    };

    const handleSave = () => {
        const updatedResponse = { ...selectedRow };
        optionsData.forEach((data) => {
            updatedResponse[data.option_num] =
                data.option_data !== "" ? data.option_data : null;
            updatedResponse[`${data.option_num}_flow`] =
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
                options={dropdownOptions}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Question"
                panelStyle={{ maxHeight: "600px", maxWidth: "90%" }}
                filter
                optionLabel="label"
                optionGroupLabel="label"
                optionGroupChildren="items"
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
                        header="Next Question"
                        editor={(options) => optionFlowsEditor(options)}
                        body={(rowData) => {
                            // Find the question name based on the stored question key (option_flow)
                            const selectedQuestion = questions.find(
                                (question) =>
                                    question.question_key ===
                                    rowData.option_flow
                            );
                            return selectedQuestion
                                ? selectedQuestion.question_name
                                : "";
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
