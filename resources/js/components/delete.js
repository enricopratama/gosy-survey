const formatDateToMMDDYYYY = (date) => {
    if (!date) return null;

    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() returns 0-11, so add 1
    const day = date.getDate().toString().padStart(2, "0"); // getDate() returns 1-31
    const year = date.getFullYear(); // getFullYear() returns the 4-digit year

    return `${month}/${day}/${year}`;
};

const handleSave = async () => {
    try {
        setLoading(true); // Start loading for the entire process
        const allNodeStates = [];

        // Traverse the nodes and gather the necessary data
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

        const promises = allNodeStates.map(async (node) => {
            const [Wilayah, CompanyCode] = node.key.split(",");

            // Get the start_date and end_date from localDates using only the Wilayah
            const wilayahDates = localDates[Wilayah] || [];
            const startDate = wilayahDates[0]
                ? formatDateToMMDDYYYY(wilayahDates[0])
                : null;
            const endDate = wilayahDates[1]
                ? formatDateToMMDDYYYY(wilayahDates[1])
                : null;

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
