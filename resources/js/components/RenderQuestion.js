import React from "react";

export const RenderQuestion = ({
    currentQuestion,
    currentQuestionIndex,
    questions,
    handlePrev,
    handleNext,
    renderOptions,
    wantParent,
}) => {
    return (
        <>
            {currentQuestion && currentQuestion.is_mandatory && (
                <div>
                    <p>Step {currentQuestion.question_key}</p>
                    <h2>{currentQuestion.question_name}</h2>
                    <div>{renderOptions(currentQuestion)}</div>
                </div>
            )}
            <div className="d-flex justify-content-between mt-4">
                <button
                    className="btn btn-primary"
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                    Next
                </button>
            </div>
        </>
    );
};
