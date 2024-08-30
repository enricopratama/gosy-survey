import React from "react";
import { Button } from "primereact/button";

const LeftToolbar = ({
    openNew,
    confirmDeleteSelected,
    selectedQuestions,
    reorderState,
    isReordering,
}) => {
    return (
        <div className="d-flex flex-wrap gap-2">
            <Button
                label="New"
                icon="pi pi-plus"
                iconPos="left"
                onClick={openNew}
                className="rounded flex-fill"
                title="Add a Question"
            />
            <Button
                label={isReordering ? "Done" : "Reorder"}
                icon={isReordering ? "pi pi-check" : "pi pi-sort-alt"}
                iconPos="left"
                severity={isReordering ? "success" : "primary"}
                onClick={reorderState}
                className="rounded flex-fill"
                title={isReordering ? "Done Reordering" : "Reorder Questions"}
            />
            <Button
                label="Delete"
                icon="pi pi-trash"
                iconPos="left"
                severity="danger"
                onClick={confirmDeleteSelected}
                disabled={
                    !selectedQuestions ||
                    !selectedQuestions.length ||
                    isReordering
                }
                className="rounded flex-fill"
                title="Delete Selected Questions"
            />
        </div>
    );
};

export default LeftToolbar;
