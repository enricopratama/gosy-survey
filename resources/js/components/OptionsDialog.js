import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const OptionsDialog = ({ visible, onHide, selectedOptions }) => {
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
            onHide={onHide}
            footer={dialogFooterTemplate()}
        >
            <div>
                <h3>{selectedOptions.question_name}</h3>
                <ul>
                    {Object.keys(selectedOptions)
                        .filter((key) => key.startsWith("option_"))
                        .map(
                            (optionKey, index) =>
                                selectedOptions[optionKey] && (
                                    <li key={index}>
                                        {`Option ${index + 1}: ${
                                            selectedOptions[optionKey]
                                        } (Flow: ${
                                            selectedOptions[
                                                `${optionKey}_flow`
                                            ] || "None"
                                        })`}
                                    </li>
                                )
                        )}
                </ul>
            </div>
        </Dialog>
    );
};

export default OptionsDialog;
