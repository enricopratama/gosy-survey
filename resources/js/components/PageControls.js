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
    const handleBackClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        onBackClick();
    };

    const handleNextClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        onNextClick();
    };

    return (
        <div className="d-flex pt-4 justify-content-between mx-5">
            {showBack && (
                <Button
                    label={backLabel}
                    className="rounded"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    onClick={handleBackClick}
                    disabled={disabledBack}
                />
            )}
            {showNext && (
                <Button
                    label={doneLabel}
                    className="rounded"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    onClick={handleNextClick}
                    disabled={disabledNext}
                />
            )}
        </div>
    );
};
