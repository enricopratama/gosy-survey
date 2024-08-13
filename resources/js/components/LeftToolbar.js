import React from "react";
import { Button } from "primereact/button";

// New and Delete (selected) buttons
const LeftToolbar = ({ openNew, confirmDeleteSelected, selectedQuestions }) => {
    return (
        <div className="d-flex flex-wrap gap-2">
            <Button
                label="New"
                icon="pi pi-plus"
                iconPos="left"
                onClick={openNew}
                className="rounded"
            />
            <Button
                label="Delete"
                icon="pi pi-trash"
                iconPos="left"
                severity="danger"
                onClick={confirmDeleteSelected}
                disabled={!selectedQuestions || !selectedQuestions.length}
                className="rounded"
            />
        </div>
    );
};

export default LeftToolbar;
