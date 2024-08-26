import React from "react";
import { Button } from "primereact/button";

const LeftToolbar = ({ openNew, confirmDeleteSelected, selectedQuestions }) => {
    return (
        <div className="d-flex flex-wrap gap-2">
            <Button
                label="New"
                icon="pi pi-plus"
                iconPos="left"
                onClick={openNew}
                className="rounded"
                title="Add a Question"
            />
            <Button
                label="Delete"
                icon="pi pi-trash"
                iconPos="left"
                severity="danger"
                onClick={confirmDeleteSelected}
                disabled={!selectedQuestions || !selectedQuestions.length}
                className="rounded"
                title="Delete a Question"
            />
        </div>
    );
};

export default LeftToolbar;
