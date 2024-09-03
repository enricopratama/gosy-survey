import React, { useEffect, useState } from "react";
import { Tree } from "primereact/tree";
import axios from "axios";
import "../../css/DSOSelection.css";
import RangeCalendar from "./RangeCalendar";
import { Button } from "primereact/button";

export default function DSOSelection() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [localDates, setLocalDates] = useState({});
    const [surveyCompanies, setSurveyCompanies] = useState({});
    const [updateUI, setUpdateUI] = useState(false);
    const [branches, setBranches] = useState({});
    const [selectedKeys, setSelectedKeys] = useState({});

    const handleDateChange = (wilayah, newDates) => {
        setLocalDates((prevDates) => ({
            ...prevDates,
            [wilayah]: newDates,
        }));
    };

    // Key format:
    // `${BranchCode}, ${Wilayah}, ${BranchName}`
    const getBranches = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/branchesJoined");
            const branches = response.data;
            setBranches(branches);

            const wilayahMap = {};
            const selectedKeysTemp = {};

            branches.forEach((branch) => {
                const { Wilayah, BranchName, BranchCode, is_active } = branch;

                if (!wilayahMap[Wilayah]) {
                    wilayahMap[Wilayah] = {
                        key: Wilayah,
                        label: (
                            <div className="d-flex align-items-center flex-wrap flex-column">
                                <h5>{Wilayah}</h5>
                                <RangeCalendar
                                    wilayahKey={Wilayah}
                                    dates={localDates[Wilayah] || null}
                                    onDateChange={(newDates) =>
                                        handleDateChange(Wilayah, newDates)
                                    }
                                />
                            </div>
                        ),
                        children: [],
                    };
                }

                // Change the format of the key to "branch code, wilayah, branch name"
                const branchKey = `${BranchCode},${Wilayah},${BranchName}`;
                wilayahMap[Wilayah].children.push({
                    key: branchKey,
                    label: BranchName,
                    code: BranchCode,
                });

                if (is_active) {
                    selectedKeysTemp[branchKey] = {
                        checked: true,
                        partialChecked: false,
                    };
                }
            });

            const treeNodes = Object.values(wilayahMap);

            treeNodes.forEach((node) => {
                const allChecked = node.children.every(
                    (child) =>
                        selectedKeysTemp[child.key] &&
                        selectedKeysTemp[child.key].checked
                );
                const someChecked = node.children.some(
                    (child) =>
                        selectedKeysTemp[child.key] &&
                        selectedKeysTemp[child.key].checked
                );

                if (allChecked) {
                    selectedKeysTemp[node.key] = {
                        checked: true,
                        partialChecked: false,
                    };
                } else if (someChecked) {
                    selectedKeysTemp[node.key] = {
                        checked: false,
                        partialChecked: true,
                    };
                } else {
                    selectedKeysTemp[node.key] = {
                        checked: false,
                        partialChecked: false,
                    };
                }
            });

            setNodes([...treeNodes]);
            setSelectedKeys({ ...selectedKeysTemp });
        } catch (error) {
            console.error("There was an error fetching the branches!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBranches();
    }, []);

    // If a branch is checked, it will select is_active = 1 for all records in table
    // mst_survey_company with that branchname wilayah and branch name (regardless of Branch Code)
    // TODO: use this endpoint in backend /editSurveyCompanyActive/{CompanyCode}
    const handleSave = () => {
        const allNodeStates = [];

        const traverseNodes = (node) => {
            const nodeState = {
                key: node.key,
                label: node.label,
                checked: selectedKeys[node.key]?.checked || false,
                partialChecked: selectedKeys[node.key]?.partialChecked || false,
            };

            allNodeStates.push(nodeState);

            if (node.children && node.children.length > 0) {
                node.children.forEach((child) => traverseNodes(child));
            }
        };

        nodes.forEach((node) => traverseNodes(node));

        console.log("All node states:", allNodeStates);
        setUpdateUI(!updateUI);
    };

    return (
        <>
            <div className="flex justify-content-center overflow-auto mt-2">
                <div className="d-flex align-items-center">
                    <Tree
                        value={nodes}
                        selectionMode="checkbox"
                        selectionKeys={selectedKeys}
                        onSelectionChange={(e) => setSelectedKeys(e.value)}
                        loading={loading}
                        className="tree-container"
                        filter
                        filterMode="lenient"
                        filterPlaceholder="Search By Company Name..."
                    />
                </div>
                <div className="d-flex pt-4 justify-content-end mt-2">
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        iconPos="left"
                        severity="primary"
                        onClick={handleSave}
                        className="rounded flex-fill"
                        title="Save"
                    />
                </div>
            </div>
        </>
    );
}
