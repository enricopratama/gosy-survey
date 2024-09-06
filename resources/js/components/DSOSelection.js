import React, { useEffect, useRef, useState } from "react";
import { Tree } from "primereact/tree";
import axios from "axios";
import "../../css/DSOSelection.css";
import RangeWilayah from "./RangeWilayah";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function DSOSelection() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [localDates, setLocalDates] = useState({});
    const [branches, setBranches] = useState({});
    const [selectedKeys, setSelectedKeys] = useState({});
    const [surveys, setSurveys] = useState({});
    const toast = useRef(null);

    const handleDateChange = (wilayah, newDates) => {
        setLocalDates((prevDates) => ({
            ...prevDates,
            [wilayah]: newDates,
        }));
    };

    // Fetch branches and map them with Wilayah and CompanyCode
    const getBranches = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/branchesJoined");
            const branches = response.data;
            setBranches(branches);

            const wilayahMap = {};
            const selectedKeysTemp = {};

            branches.forEach((branch) => {
                const { Wilayah, BranchName, is_active, CompanyCode } = branch;

                if (!wilayahMap[Wilayah]) {
                    wilayahMap[Wilayah] = {
                        key: Wilayah,
                        label: (
                            <div className="d-flex align-items-center flex-wrap flex-column">
                                <h5>{Wilayah}</h5>
                                <RangeWilayah
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

                const branchKey = `${Wilayah},${CompanyCode}`;
                wilayahMap[Wilayah].children.push({
                    key: branchKey,
                    label: BranchName,
                    code: CompanyCode,
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
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail:
                    error.response?.data?.message ||
                    "Failed to update DSO Active State",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Format dates into MM/DD/YYYY
    const formatDate = (date) => {
        if (!date) return null;

        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() returns 0-11, so add 1
        const day = date.getDate().toString().padStart(2, "0"); // getDate() returns 1-31
        const year = date.getFullYear(); // getFullYear() returns the 4-digit year

        return `${year}-${month}-${day}`; // Return date in YYYY-MM-DD format
    };

    const getSurveys = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/survey-companies");
            setSurveys(response.data);
        } catch (error) {
            console.error("There was an error fetching the surveys!", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail:
                    error.response?.data?.message || "Failed to update Surveys",
                life: 3000,
            });
        }
    };

    useEffect(() => {
        getBranches();
        getSurveys();
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);

            const allNodeStates = [];

            const traverseNodes = (node) => {
                const nodeState = {
                    key: node.key,
                    label: node.label,
                    checked: selectedKeys[node.key]?.checked || false,
                    partialChecked:
                        selectedKeys[node.key]?.partialChecked || false,
                };
                allNodeStates.push(nodeState);

                if (node.children && node.children.length > 0) {
                    node.children.forEach((child) => traverseNodes(child));
                }
            };

            nodes.forEach((node) => traverseNodes(node));

            const promises = allNodeStates.map(async (node) => {
                const [Wilayah, CompanyCode] = node.key.split(",");

                // Get the start_date and end_date from localDates using only the Wilayah
                const wilayahDates = localDates[Wilayah] || [];
                const startDate = wilayahDates[0]
                    ? formatDate(wilayahDates[0])
                    : null; // Format date as YYYY-MM-DD
                const endDate = wilayahDates[1]
                    ? formatDate(wilayahDates[1])
                    : null; // Format date as YYYY-MM-DD

                const formData = new FormData();
                formData.append("company_code", CompanyCode); // CompanyCode still needs to be sent
                formData.append("is_active", node.checked ? 1 : 0);

                // Append start_date and end_date if they exist
                if (startDate) {
                    formData.append("start_date", startDate);
                }
                if (endDate) {
                    formData.append("end_date", endDate);
                }

                try {
                    const response = await axios.post(
                        `/editSurveyCompanyActive/${CompanyCode}`,
                        formData
                    );

                    if (response.status === 200) {
                        return true;
                    } else {
                        console.error(
                            `Failed to update Company Code ${CompanyCode}`
                        );
                        return false;
                    }
                } catch (error) {
                    console.error(
                        `Error updating Company Code ${CompanyCode}:`,
                        error
                    );
                    return false;
                }
            });

            const results = await Promise.all(
                promises.map((p) => p.catch(() => false))
            );
            const isSuccessOne = results.some((res) => res === true);

            if (isSuccessOne) {
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "DSO Activity State Updated",
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to update DSO Activity",
                    life: 3000,
                });
            }
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message || "Failed to update DSO Activity",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast ref={toast} />
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
                        label="Save Updates"
                        icon="pi pi-check"
                        iconPos="left"
                        severity="primary"
                        onClick={handleSave}
                        className="rounded flex-fill"
                        title="Save"
                        disabled={loading}
                    />
                </div>
            </div>
        </>
    );
}
