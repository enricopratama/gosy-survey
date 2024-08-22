import { Button } from "primereact/button";

export const PageControlButtons = ({
    showBack = true,
    backLabel = "Back",
    onBackClick = () => {},
    showNext = true,
    doneLabel = "Done",
    onNextClick = () => {},
    disabledBack = false,
    disabledNext = false,
}) => {
    return (
        <div className="d-flex pt-4 justify-content-between mx-5">
            {showBack && (
                <Button
                    label={backLabel}
                    className="rounded"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    onClick={onBackClick}
                    disabled={disabledBack}
                />
            )}
            {showNext && (
                <Button
                    label={doneLabel}
                    className="rounded"
                    icon="pi pi-check"
                    iconPos="right"
                    onClick={onNextClick}
                    disabled={disabledNext}
                />
            )}
        </div>
    );
};
