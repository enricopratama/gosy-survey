import React, { useEffect, useRef, useState } from "react";
import { Tree } from "primereact/tree";
import axios from "axios";
import "../../css/DSOSelection.css";
import RangeCalendar from "./RangeCalendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function DSOSelection() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [localDates, setLocalDates] = useState({});
    const [updateUI, setUpdateUI] = useState(false);
    const [branches, setBranches] = useState({});
    const [selectedKeys, setSelectedKeys] = useState({});
    const toast = useRef(null);

    const handleDateChange = (wilayah, newDates) => {
        setLocalDates((prevDates) => ({
            ...prevDates,
            [wilayah]: newDates,
        }));
    };

    // Key format:
    // `${Wilayah},${CompanyCode}`
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

                // Key is now in the format "Wilayah,CompanyCode"
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

    useEffect(() => {
        getBranches();
    }, []);

    // Handle saving of is_active state for all selected company codes
    //TODO: Fix key format --> one to many relationship
    const handleSave = async () => {
        const allNodeStates = [];

        const traverseNodes = (node) => {
            const nodeState = {
                key: node.key,
                label: node.label,
                checked: selectedKeys[node.key]?.checked || false,
                partialChecked: selectedKeys[node.key]?.partialChecked || false,
            };

            allNodeStates.push(nodeState);

            // If node has children, traverse further
            if (node.children && node.children.length > 0) {
                node.children.forEach((child) => traverseNodes(child));
            }
        };

        // Traverse through all nodes and gather state
        nodes.forEach((node) => traverseNodes(node));

        console.log("All node states:", allNodeStates);

        const promises = allNodeStates.map(async (node) => {
            const [Wilayah, CompanyCode] = node.key.split(",");

            const formData = new FormData();
            formData.append("company_code", CompanyCode);
            formData.append("is_active", node.checked ? 1 : 0);

            try {
                const response = await axios.post(
                    `/editSurveyCompanyActive/${CompanyCode}`,
                    formData
                );

                if (response.status === 200) {
                    console.log(
                        `Successfully updated all branches under Company Code ${CompanyCode} in ${Wilayah} to ${
                            node.checked ? "active" : "inactive"
                        } `
                    );
                } else {
                    console.error(
                        `Failed to update branches for Company Code ${CompanyCode} in ${Wilayah}`
                    );
                }
            } catch (error) {
                console.error(
                    `Error updating branches for Company Code ${CompanyCode} in ${Wilayah}:`,
                    error
                );
            }
        });

        await Promise.all(promises.map((p) => p.catch((e) => e)));
        setUpdateUI(!updateUI);
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

// export default function DSOSelection() {
//     const [nodes, setNodes] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [localDates, setLocalDates] = useState({});
//     const [surveyCompanies, setSurveyCompanies] = useState({});
//     const [updateUI, setUpdateUI] = useState(false);
//     const [branches, setBranches] = useState({});
//     const [selectedKeys, setSelectedKeys] = useState({});
//     const toast = useRef(null);

//     const handleDateChange = (wilayah, newDates) => {
//         setLocalDates((prevDates) => ({
//             ...prevDates,
//             [wilayah]: newDates,
//         }));
//     };

//     // Key format:
//     // `${BranchCode},${Wilayah},${BranchName},${CompanyCode}`
//     const getBranches = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get("/branchesJoined");
//             const branches = response.data;
//             setBranches(branches);

//             const wilayahMap = {};
//             const selectedKeysTemp = {};

//             branches.forEach((branch) => {
//                 const {
//                     Wilayah,
//                     BranchName,
//                     BranchCode,
//                     is_active,
//                     CompanyCode,
//                 } = branch;

//                 if (!wilayahMap[Wilayah]) {
//                     wilayahMap[Wilayah] = {
//                         key: Wilayah,
//                         label: (
//                             <div className="d-flex align-items-center flex-wrap flex-column">
//                                 <h5>{Wilayah}</h5>
//                                 <RangeCalendar
//                                     wilayahKey={Wilayah}
//                                     dates={localDates[Wilayah] || null}
//                                     onDateChange={(newDates) =>
//                                         handleDateChange(Wilayah, newDates)
//                                     }
//                                 />
//                             </div>
//                         ),
//                         children: [],
//                     };
//                 }

//                 // Change the format of the key to "branch code, wilayah, branch name, company code"
//                 const branchKey = `${BranchCode},${Wilayah},${BranchName},${CompanyCode}`;
//                 wilayahMap[Wilayah].children.push({
//                     key: branchKey,
//                     label: BranchName,
//                     code: CompanyCode,
//                 });

//                 if (is_active) {
//                     selectedKeysTemp[branchKey] = {
//                         checked: true,
//                         partialChecked: false,
//                     };
//                 }
//             });

//             const treeNodes = Object.values(wilayahMap);

//             treeNodes.forEach((node) => {
//                 const allChecked = node.children.every(
//                     (child) =>
//                         selectedKeysTemp[child.key] &&
//                         selectedKeysTemp[child.key].checked
//                 );
//                 const someChecked = node.children.some(
//                     (child) =>
//                         selectedKeysTemp[child.key] &&
//                         selectedKeysTemp[child.key].checked
//                 );

//                 if (allChecked) {
//                     selectedKeysTemp[node.key] = {
//                         checked: true,
//                         partialChecked: false,
//                     };
//                 } else if (someChecked) {
//                     selectedKeysTemp[node.key] = {
//                         checked: false,
//                         partialChecked: true,
//                     };
//                 } else {
//                     selectedKeysTemp[node.key] = {
//                         checked: false,
//                         partialChecked: false,
//                     };
//                 }
//             });

//             setNodes([...treeNodes]);
//             setSelectedKeys({ ...selectedKeysTemp });
//         } catch (error) {
//             console.error("There was an error fetching the branches!", error);
//             toast.current.show({
//                 severity: "error",
//                 summary: "Error",
//                 detail:
//                     error.response?.data?.message ||
//                     "Failed to update DSO Active State",
//                 life: 3000,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getBranches();
//     }, []);

//     // Handle saving of is_active state for all branches
//     const handleSave = async () => {
//         const allNodeStates = [];

//         const traverseNodes = (node) => {
//             const nodeState = {
//                 key: node.key,
//                 label: node.label,
//                 checked: selectedKeys[node.key]?.checked || false,
//                 partialChecked: selectedKeys[node.key]?.partialChecked || false,
//             };

//             allNodeStates.push(nodeState);

//             // If node has children, traverse further
//             if (node.children && node.children.length > 0) {
//                 node.children.forEach((child) => traverseNodes(child));
//             }
//         };

//         // Traverse through all nodes and gather state
//         nodes.forEach((node) => traverseNodes(node));

//         // console.log("All node states:", allNodeStates);

//         const promises = allNodeStates.map(async (node) => {
//             const [
//                 BranchCode,
//                 Wilayah,
//                 BranchName,
//                 CompanyCode,
//             ] = node.key.split(",");

//             const formData = new FormData();
//             formData.append("company_code", CompanyCode);
//             formData.append("is_active", node.checked ? 1 : 0);

//             try {
//                 const response = await axios.post(
//                     `/editSurveyCompanyActive/${CompanyCode}`,
//                     formData
//                 );

//                 if (response.status === 200) {
//                     toast.current.show({
//                         severity: "success",
//                         summary: "Successful",
//                         detail: `Successfully updated ${BranchName} in ${Wilayah} to ${
//                             node.checked ? "active" : "inactive"
//                         }`,
//                         life: 2000,
//                     });
//                 } else {
//                     console.error(
//                         `Failed to update ${BranchName} in ${Wilayah}`
//                     );
//                 }
//             } catch (error) {
//                 console.error(
//                     `Error updating ${BranchName} in ${Wilayah}:`,
//                     error
//                 );
//                 toast.current.show({
//                     severity: "error",
//                     summary: "Error",
//                     detail:
//                         error.response?.data?.message ||
//                         `Error updating ${BranchName} in ${Wilayah}:`,
//                     life: 3000,
//                 });
//             }
//         });

//         await Promise.all(promises.map((p) => p.catch((e) => e)));
//         setUpdateUI((prev) => !prev);
//     };

//     return (
//         <>
//             <Toast ref={toast} />
//             <div className="flex justify-content-center overflow-auto mt-2">
//                 <div className="d-flex align-items-center">
//                     <Tree
//                         value={nodes}
//                         selectionMode="checkbox"
//                         selectionKeys={selectedKeys}
//                         onSelectionChange={(e) => setSelectedKeys(e.value)}
//                         loading={loading}
//                         className="tree-container"
//                         filter
//                         filterMode="lenient"
//                         filterPlaceholder="Search By Company Name..."
//                     />
//                 </div>
//                 <div className="d-flex pt-4 justify-content-end mt-2">
//                     <Button
//                         label="Save"
//                         icon="pi pi-check"
//                         iconPos="left"
//                         severity="primary"
//                         onClick={handleSave}
//                         className="rounded flex-fill"
//                         title="Save"
//                     />
//                 </div>
//             </div>
//         </>
//     );
// }
