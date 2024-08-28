import { Tree } from "primereact/tree";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DSOSelection() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(null);

    const getBranches = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/branches");
            const branches = response.data;

            // Transform the branches data into the format required by the Tree component
            const wilayahMap = {};

            branches.forEach((branch, index) => {
                const { Wilayah, BranchName } = branch;

                if (!wilayahMap[Wilayah]) {
                    wilayahMap[Wilayah] = {
                        key: `${index}`,
                        label: Wilayah,
                        children: [],
                    };
                }

                const branchKey = `${index}-${wilayahMap[Wilayah].children.length}`;

                wilayahMap[Wilayah].children.push({
                    key: branchKey,
                    label: BranchName,
                });
            });

            // Convert the map to an array for the Tree component
            const treeNodes = Object.values(wilayahMap);
            setNodes(treeNodes);
        } catch (error) {
            console.error("There was an error fetching the branches!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBranches();
    }, []);

    return (
        <>
            <div className="card flex justify-content-center overflow-auto">
                <Tree
                    value={nodes}
                    selectionMode="checkbox"
                    selectionKeys={selectedKeys}
                    onSelectionChange={(e) => setSelectedKeys(e.value)}
                    loading={loading}
                />
            </div>
        </>
    );
}
