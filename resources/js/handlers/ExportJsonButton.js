import React from "react";

export default function ExportJsonButton({ response }) {
    const exportResponsesToJson = () => {
        if (!response) {
            console.error("No response data to export");
            return;
        }

        const jsonResponse = JSON.stringify(response, null, 2); // Pretty-print JSON for readability
        const blob = new Blob([jsonResponse], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "responses.json";
        link.click();
        URL.revokeObjectURL(url); // Clean up the URL object after downloading
    };

    return (
        <button onClick={exportResponsesToJson}>
            Export Responses to JSON
        </button>
    );
}
