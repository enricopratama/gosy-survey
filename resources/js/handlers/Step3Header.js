import React, { useState, useEffect } from "react";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";

export default function Step3Header({
    initialSize,
    onSizeChange,
    questionGroups,
    onQuestionGroupChange,
    selectedQuestionGroup, // Prop passed from parent
    response,
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
                    ? sizeOptions[1].value
                    : sizeOptions[0].value;
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

    // Filter question groups to match the survey_name from NewQuestions.js
    // const filteredQuestionGroups = questionGroups.filter((group) =>
    //     group.question_group_name.includes(response.survey_name)
    // );
    const filteredQuestionGroups = questionGroups
        .filter((group) =>
            group.question_group_name.includes(response.survey_name)
        )
        .map((group) => {
            const groupNameAfterDash = group.question_group_name
                .substring(group.question_group_name.indexOf("-") + 1)
                .trim();

            // console.log(
            //     "Filtered group:",
            //     group.question_group_name,
            //     "=>",
            //     groupNameAfterDash
            // );

            return {
                label: groupNameAfterDash,
                value: group, // Use full question_group_name as the value
            };
        });

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
                options={filteredQuestionGroups}
                onChange={handleQuestionGroupSelect}
                placeholder="Select Question Group"
                breakpoints={{ "960px": "75vw", "641px": "85vw" }}
            />
        </div>
    );
}
