import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { CustomerService } from "../service/CustomerService";

export default function DataTableComponent() {
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [representatives] = useState([
        { name: "Amy Elsner" },
        { name: "Anna Fali" },
        { name: "Asiya Javayant" },
        { name: "Bernardo Dominic" },
        { name: "Elwin Sharvill" },
        { name: "Ioni Bowcher" },
        { name: "Ivan Magalhaes" },
        { name: "Onyama Limba" },
        { name: "Stephen Shaw" },
        { name: "XuXue Feng" },
    ]);
    const [statuses] = useState([
        "unqualified",
        "qualified",
        "new",
        "negotiation",
        "renewal",
    ]);

    const getSeverity = (status) => {
        switch (status) {
            case "unqualified":
                return "danger";
            case "qualified":
                return "success";
            case "new":
                return "info";
            case "negotiation":
                return "warning";
            case "renewal":
                return null;
            default:
                return null;
        }
    };

    useEffect(() => {
        const customerService = new CustomerService();
        customerService.getCustomersMedium().then((data) => {
            setCustomers(getCustomers(data));
            setLoading(false);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || ""; // Use empty string instead of null
        let _filters = { ...filters };
        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Search..."
                    />
                </IconField>
            </div>
        );
    };

    const countryBodyTemplate = (rowData) => {
        return <span>{rowData.country.name}</span>;
    };

    const representativeBodyTemplate = (rowData) => {
        return <span>{rowData.representative.name}</span>;
    };

    const representativesItemTemplate = (option) => {
        return <span>{option.name}</span>;
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <Tag
                value={rowData.status}
                severity={getSeverity(rowData.status)}
            />
        );
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const verifiedBodyTemplate = (rowData) => {
        return (
            <i
                className={classNames("pi", {
                    "pi-check-circle": rowData.verified,
                    "pi-times-circle": !rowData.verified,
                })}
            ></i>
        );
    };

    const representativeRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={representatives}
                itemTemplate={representativesItemTemplate}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel="name"
                placeholder="Any"
                className="p-column-filter"
                maxSelectedLabels={1}
                style={{ minWidth: "14rem" }}
            />
        );
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.filterApplyCallback(e.value)}
                itemTemplate={statusItemTemplate}
                placeholder="Select One"
                className="p-column-filter"
                showClear
                style={{ minWidth: "12rem" }}
            />
        );
    };

    const verifiedRowFilterTemplate = (options) => {
        return (
            <TriStateCheckbox
                value={options.value}
                onChange={(e) => options.filterApplyCallback(e.value)}
                unstyled={false} // Ensure unstyled is set to false as a string
            />
        );
    };

    const header = renderHeader();

    return (
        <div className="card border-1 surface-border border-round">
            <DataTable
                value={customers}
                rows={5}
                paginator
                rowsPerPageOptions={[5, 10, 25, 50]}
                dataKey="id"
                stripedRows
                filters={filters}
                filterDisplay="row"
                loading={loading}
                globalFilterFields={[
                    "name",
                    "country.name",
                    "representative.name",
                    "status",
                ]}
                header={header}
                emptyMessage="No customers found."
                className="border-1 surface-border border-round"
            >
                <Column
                    field="name"
                    header="Name"
                    filter
                    filterPlaceholder="Search by name"
                    style={{ minWidth: "12rem" }}
                    sortable
                />
                <Column
                    field="country.name"
                    header="Country"
                    filterField="country.name"
                    style={{ minWidth: "12rem" }}
                    body={countryBodyTemplate}
                    filter
                    sortable
                    filterPlaceholder="Search by country"
                />
                <Column
                    field="representative.name"
                    header="Agent"
                    filterField="representative"
                    showFilterMenu={false}
                    filterMenuStyle={{ width: "14rem" }}
                    style={{ minWidth: "14rem" }}
                    body={representativeBodyTemplate}
                    filter
                    filterPlaceholder="Search by agent"
                    sortable
                />
                <Column
                    field="status"
                    header="Status"
                    showFilterMenu={false}
                    filterMenuStyle={{ width: "14rem" }}
                    style={{ minWidth: "12rem" }}
                    body={statusBodyTemplate}
                    filter
                    filterElement={statusRowFilterTemplate}
                    sortable
                />
                <Column
                    field="verified"
                    header="Verified"
                    dataType="boolean"
                    style={{ minWidth: "6rem" }}
                    body={verifiedBodyTemplate}
                    filter
                    filterElement={verifiedRowFilterTemplate}
                    sortable
                />
            </DataTable>
        </div>
    );
}
