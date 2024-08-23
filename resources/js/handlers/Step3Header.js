import React, { useState, useEffect } from "react";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";

export default function Step3Header({
    initialSize,
    onSizeChange,
    questionGroups,
    onQuestionGroupChange,
    selectedQuestionGroup, // Prop passed from parent
}) {
    const [sizeOptions] = useState([
        { label: "Small", value: "small" },
        { label: "Normal", value: "normal" },
        { label: "Large", value: "large" },
    ]);
    const [size, setSize] = useState(initialSize);

    useEffect(() => {
        const handleResize = () => {
            const newSize =
                window.innerHeight > 640 && window.innerWidth > 540
                    ? sizeOptions[1].value // "Normal" for tablets and larger
                    : sizeOptions[0].value; // "Small" for mobile
            setSize(newSize);
            onSizeChange(newSize);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [sizeOptions, onSizeChange]);

    const handleSizeChange = (e) => {
        setSize(e.value);
        onSizeChange(e.value);
    };

    const handleQuestionGroupSelect = (e) => {
        const selectedGroup = e.value;
        onQuestionGroupChange(selectedGroup);
    };

    return (
        <div className="d-flex justify-content-between mb-4 mt-4 p-toolbar p-component">
            {/* SelectButton for size options */}
            <SelectButton
                value={size}
                onChange={handleSizeChange}
                options={sizeOptions}
            />

            {/* Dropdown for selecting question group */}
            <Dropdown
                value={
                    questionGroups.find(
                        (group) =>
                            group.question_group_name === selectedQuestionGroup
                    ) || null
                }
                options={questionGroups.map((group) => ({
                    label: group.question_group_name,
                    value: group,
                }))}
                onChange={handleQuestionGroupSelect}
                placeholder="Select Question Group"
                className="mr-4"
                style={{ width: "300px" }}
            />
        </div>
    );
}
