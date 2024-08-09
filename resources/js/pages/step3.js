<div className="d-flex flex-column">
    <div
        className="rounded surface-ground flex-column d-flex font-medium mx-5"
        style={{
            height: "65vh",
            overflow: "auto",
            alignContent: "center",
        }}
    >
        <div
            className="d-flex flex-column"
            style={{
                alignContent: "center",
                textAlign: "left",
            }}
        >
            <h5 className="text-muted">Step 3</h5>
            <h1>Tambah Pertanyaan {response.questionGroup}</h1>
            <div className="d-flex flex-column flex-wrap flex-column align-items-center mt-4">
                <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                    }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="survey_name"
                            required
                            style={{ minWidth: "20rem" }}
                            value={response.surveyType}
                            disabled
                        />
                        <label htmlFor="survey_name" className="font-bold">
                            Survey Name
                        </label>
                    </span>
                </div>
                <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                    }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="question_group_name"
                            required
                            style={{ minWidth: "20rem" }}
                            value={response.questionGroup}
                            disabled
                        />
                        <label
                            htmlFor="question_group_name"
                            className="font-bold"
                        >
                            Question Group Name
                        </label>
                    </span>
                </div>
                {/* <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                    }}>
                    <span className="p-float-label">
                        <InputText
                            id="question_id"
                            required
                            style={{ minWidth: "20rem" }}
                            value={response.questionId}
                            onChange={(e) => onInputChange(e, "questionId")}
                        />
                        <label htmlFor="question_id" className="font-bold">
                            Question ID
                        </label>
                    </span>
                </div> */}
                <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                    }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="question_group_id"
                            required
                            style={{ minWidth: "20rem" }}
                            value={response.questionGroupId}
                            onChange={(e) =>
                                onInputChange(e, "questionGroupId")
                            }
                            className={classNames({
                                "p-invalid":
                                    submitted && !response.questionGroupId,
                            })}
                        />
                        <label
                            htmlFor="question_group_id"
                            className="font-bold"
                        >
                            Question Group ID
                        </label>
                    </span>
                    {submitted && !response.questionGroupId && (
                        <small className="p-error">
                            Question Group ID is required.
                        </small>
                    )}
                </div>
                <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                    }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="question_name"
                            required
                            style={{ minWidth: "20rem" }}
                            value={response.questionName}
                            onChange={(e) => onInputChange(e, "questionName")}
                            className={classNames({
                                "p-invalid":
                                    submitted && !response.questionName,
                            })}
                        />
                        <label htmlFor="question_name" className="font-bold">
                            Question Name
                        </label>
                    </span>
                    {submitted && !response.questionName && (
                        <small className="p-error">
                            Question Name is required.
                        </small>
                    )}
                </div>
                <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                    }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="question_key"
                            required
                            style={{ minWidth: "20rem" }}
                            value={response.questionKey}
                            onChange={(e) => onInputChange(e, "questionKey")}
                            className={classNames({
                                "p-invalid": submitted && !response.questionKey,
                            })}
                        />
                        <label htmlFor="question_key" className="font-bold">
                            Question Key
                        </label>
                    </span>
                    {submitted && !response.questionKey && (
                        <small className="p-error">
                            Question Key is required.
                        </small>
                    )}
                </div>
                <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                    }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="question_type"
                            required
                            style={{ minWidth: "20rem" }}
                            value={response.questionType}
                            onChange={(e) => onInputChange(e, "questionType")}
                            className={classNames({
                                "p-invalid":
                                    submitted && !response.questionType,
                            })}
                        />
                        <label htmlFor="question_type" className="font-bold">
                            Question Type
                        </label>
                    </span>
                    {submitted && !response.questionType && (
                        <small className="p-error">
                            Question Type is required.
                        </small>
                    )}
                </div>
                <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                    }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="sequence"
                            required
                            style={{ minWidth: "20rem" }}
                            value={response.sequence}
                            onChange={(e) => onInputChange(e, "sequence")}
                            className={classNames({
                                "p-invalid": submitted && !response.sequence,
                            })}
                        />
                        <label htmlFor="sequence" className="font-bold">
                            Sequence
                        </label>
                    </span>
                    {submitted && !response.sequence && (
                        <small className="p-error">Sequence is required.</small>
                    )}
                </div>
                <div
                    className="field"
                    style={{
                        marginBottom: "35px",
                        minWidth: "12rem",
                    }}
                >
                    <span className="p-float-label">
                        <InputText
                            id="statuss" // needs altering
                            required
                            style={{ minWidth: "20rem" }}
                            value={response.status}
                            onChange={(e) => onInputChange(e, "status")}
                        />
                        <label htmlFor="question_name" className="font-bold">
                            Status
                        </label>
                    </span>
                    {submitted && !response.status && (
                        <small className="p-error">Status is required.</small>
                    )}
                </div>
            </div>
        </div>
    </div>
    <div className="d-flex pt-4 justify-content-between mx-5">
        <Button
            label="Back"
            className="rounded"
            icon="pi pi-arrow-left"
            severity="secondary"
            onClick={() => stepperRef.current.prevCallback()}
        />
        <Button
            label="Finish"
            className="rounded"
            icon="pi pi-check"
            iconPos="right"
            onClick={() => exportResponsesToJson()}
            disabled={!isFormComplete()}
        />
    </div>
</div>;
