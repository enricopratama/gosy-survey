import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

export default function OptionsDialog({
    visible,
    onHide,
    selectedRow,
    updateResponse,
}) {
    const [optionsData, setOptionsData] = useState([]);

    useEffect(() => {
        if (selectedRow) {
            // Extract the options data from the selectedRow
            const extractedOptions = [];

            for (let i = 1; i <= 9; i++) {
                if (selectedRow[`option_${i}`]) {
                    extractedOptions.push({
                        option_num: `option_${i}`,
                        option_data: selectedRow[`option_${i}`],
                        option_flow: selectedRow[`option_${i}_flow`],
                    });
                }
            }

            setOptionsData(extractedOptions);
        }
    }, [selectedRow]);

    const onRowEditComplete = (e) => {
        let _optionsData = [...optionsData];
        let { newData, index } = e;

        _optionsData[index] = newData;

        setOptionsData(_optionsData);

        // Update the selectedRow in parent component
        const updatedResponse = { ...selectedRow };
        _optionsData.forEach((data) => {
            updatedResponse[data.option_num] = data.option_data;
            updatedResponse[`${data.option_num}_flow`] = data.option_flow;
        });

        updateResponse(updatedResponse);
    };

    const textEditor = (options) => {
        return (
            <InputText
                type="text"
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
            />
        );
    };

    const dialogFooterTemplate = () => {
        return (
            <div className="mt-2">
                <Button
                    label="Done"
                    className="rounded me-2"
                    icon="pi pi-check"
                    onClick={onHide}
                />
            </div>
        );
    };

    return (
        <Dialog
            header="Question Options"
            visible={visible}
            style={{ width: "50vw" }}
            maximizable
            modal
            contentStyle={{ height: "200px" }}
            onHide={onHide} // setOptionDialogVisible(false)
            footer={dialogFooterTemplate()}
        >
            <div className="card p-fluid">
                <DataTable
                    value={optionsData}
                    editMode="row"
                    onRowEditComplete={onRowEditComplete}
                    tableStyle={{ minWidth: "20rem" }}
                >
                    <Column
                        field="option_num"
                        header="Option Number"
                        style={{ width: "20%" }}
                    ></Column>
                    <Column
                        field="option_data"
                        header="Option Data"
                        editor={(options) => textEditor(options)}
                        style={{ width: "40%" }}
                    ></Column>
                    <Column
                        field="option_flow"
                        header="Option Flow"
                        editor={(options) => textEditor(options)}
                        style={{ width: "40%" }}
                    ></Column>
                    <Column
                        rowEditor={true}
                        headerStyle={{ width: "10%", minWidth: "2rem" }}
                        bodyStyle={{ textAlign: "center" }}
                    ></Column>
                </DataTable>
                <Button label="Done" className="mt-2" onClick={onHide} />
            </div>
        </Dialog>
    );
}
