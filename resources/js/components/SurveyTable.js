import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./ProductService";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import ButtonComponent from "./ButtonComponent";
import { SelectButton } from "primereact/selectbutton";
import { FilterMatchMode } from "primereact/api";

export default function SurveyTable() {
    let emptyQuestion = {
        question_id: null,
    };

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        question_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        user_login: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        account_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        company_code: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const [products, setProducts] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [product, setProduct] = useState(emptyProduct);
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [sizeOptions] = useState([
        { label: "Small", value: "small" },
        { label: "Normal", value: "normal" },
        { label: "Large", value: "large" },
    ]);
    const [size, setSize] = useState(sizeOptions[1].value);

    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data));
    }, []);

    /**
     * Fetch Questions API
     */
    const getQuestions = async () => {
        try {
            const response = await axios.get("/api/questions");
            setQuestions(response.data);
        } catch (error) {
            console.error("There was an error fetching the questions!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuestions();
    }, []);

    const currentQuestion = questions[currentQuestionIndex];

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || ""; // Use empty string instead of null
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { ...prevFilters.global, value },
        }));
        setGlobalFilter(value);
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Updated",
                    life: 3000,
                });
            } else {
                _product.id = createId();
                _product.image = "product-placeholder.svg";
                _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Created",
                    life: 3000,
                });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Product Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter(
            (val) => !selectedProducts.includes(val)
        );

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Products Deleted",
            life: 3000,
        });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <ButtonComponent
                    label="New"
                    icon="pi pi-plus"
                    iconPos="left"
                    severity="success"
                    onClick={openNew}
                />
                <ButtonComponent
                    label="Delete"
                    icon="pi pi-trash"
                    iconPos="left"
                    severity="danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedProducts || !selectedProducts.length}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <ButtonComponent
                label="Export"
                icon="pi pi-upload"
                iconPos="left"
                onClick={exportCSV}
            />
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <ButtonComponent
                    icon="pi pi-pencil"
                    className="mr-2"
                    rounded
                    outlined
                    onClick={() => editProduct(rowData)}
                />
                <ButtonComponent
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteProduct(rowData)}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Questions</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </IconField>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <ButtonComponent
                label="Cancel"
                icon="pi pi-times"
                iconPos="left"
                className="ms-2"
                outlined
                onClick={hideDialog}
            />
            <ButtonComponent
                label="Save"
                icon="pi pi-check"
                className="ms-2"
                iconPos="left"
                onClick={saveProduct}
            />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <ButtonComponent
                label="No"
                icon="pi pi-times"
                iconPos="left"
                className="ms-2"
                outlined
                onClick={hideDeleteProductDialog}
            />
            <ButtonComponent
                label="Yes"
                icon="pi pi-check"
                iconPos="left"
                severity="danger"
                className="ms-2"
                onClick={deleteProduct}
            />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <ButtonComponent
                label="No"
                icon="pi pi-times"
                iconPos="left"
                outlined
                onClick={hideDeleteProductsDialog}
            />
            <ButtonComponent
                label="Yes"
                icon="pi pi-check"
                className="ms-2"
                iconPos="left"
                severity="danger"
                onClick={deleteSelectedProducts}
            />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <div className="flex justify-content-center mb-4 mt-4">
                    <SelectButton
                        value={size}
                        onChange={(e) => setSize(e.value)}
                        options={sizeOptions}
                    />
                </div>
                <Toolbar
                    className="mb-4"
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>

                <DataTable
                    ref={dt}
                    value={products}
                    // selection={selectedProducts}
                    // onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id"
                    paginator
                    size={size}
                    removableSort
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column
                        selectionMode="multiple"
                        exportable={false}
                    ></Column>
                    <Column
                        field="question_id"
                        header="Question ID"
                        sortable
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="question_key"
                        header="Question Key"
                        sortable
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="question_group_id"
                        header="Question Group ID"
                        sortable
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="sequence"
                        header="Sequence"
                        body={priceBodyTemplate}
                        sortable
                        style={{ minWidth: "8rem" }}
                    ></Column>
                    <Column
                        field="question_name"
                        header="Question Name"
                        sortable
                        style={{ minWidth: "10rem" }}
                    ></Column>
                    <Column
                        field="question_type"
                        header="Question Type"
                        sortable
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="data_status"
                        header="Status"
                        body={statusBodyTemplate}
                        sortable
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{ minWidth: "12rem" }}
                    ></Column>
                </DataTable>
            </div>

            <Dialog
                visible={productDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Product Details"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}
            >
                {product.image && (
                    <img
                        src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
                        alt={product.image}
                        className="product-image block m-auto pb-3"
                    />
                )}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText
                        id="name"
                        value={product.name}
                        onChange={(e) => onInputChange(e, "name")}
                        required
                        autoFocus
                        className={classNames({
                            "p-invalid": submitted && !product.name,
                        })}
                    />
                    {submitted && !product.name && (
                        <small className="p-error">Name is required.</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea
                        id="description"
                        value={product.description}
                        onChange={(e) => onInputChange(e, "description")}
                        required
                        rows={3}
                        cols={20}
                    />
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="category1"
                                name="category"
                                value="Accessories"
                                onChange={onCategoryChange}
                                checked={product.category === "Accessories"}
                            />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="category2"
                                name="category"
                                value="Clothing"
                                onChange={onCategoryChange}
                                checked={product.category === "Clothing"}
                            />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="category3"
                                name="category"
                                value="Electronics"
                                onChange={onCategoryChange}
                                checked={product.category === "Electronics"}
                            />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="category4"
                                name="category"
                                value="Fitness"
                                onChange={onCategoryChange}
                                checked={product.category === "Fitness"}
                            />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Price
                        </label>
                        <InputNumber
                            id="price"
                            value={product.price}
                            onValueChange={(e) =>
                                onInputNumberChange(e, "price")
                            }
                            mode="currency"
                            currency="USD"
                            locale="en-US"
                        />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Quantity
                        </label>
                        <InputNumber
                            id="quantity"
                            value={product.quantity}
                            onValueChange={(e) =>
                                onInputNumberChange(e, "quantity")
                            }
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog
                visible={deleteProductDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Confirm"
                modal
                footer={deleteProductDialogFooter}
                onHide={hideDeleteProductDialog}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem" }}
                    />
                    {product && (
                        <span>
                            Are you sure you want to delete{" "}
                            <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={deleteProductsDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Confirm"
                modal
                footer={deleteProductsDialogFooter}
                onHide={hideDeleteProductsDialog}
            >
                <div className="d-flex align-middle">
                    <div className="confirmation-content">
                        <i
                            className="pi pi-exclamation-triangle mr-3"
                            style={{ fontSize: "2rem" }}
                        />
                        {product && (
                            <span className="">
                                Are you sure you want to delete the selected
                                products?
                            </span>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
