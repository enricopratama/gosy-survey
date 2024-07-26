import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { PrimeReactContext } from "primereact/api";
import { Button } from "primereact/button";

const ButtonComponent = ({
    label,
    icon,
    iconPos,
    onClick,
    severity,
    className,
    outlined = false,
    text = false,
    rounded = false,
}) => {
    const { setRipple } = useContext(PrimeReactContext);

    useEffect(() => {
        setRipple(true);
    }, [setRipple]);

    return (
        <Button
            label={label}
            icon={icon}
            iconPos={iconPos}
            onClick={onClick}
            severity={severity}
            style={{ borderRadius: "8px" }}
            className={className}
            outlined={outlined}
            text={text}
            rounded={rounded}
        />
    );
};

ButtonComponent.propTypes = {
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    icon: PropTypes.string,
    iconPos: PropTypes.string,
    onClick: PropTypes.func,
    severity: PropTypes.string,
    outlined: PropTypes.bool,
    text: PropTypes.bool,
    rounded: PropTypes.bool,
};

export default ButtonComponent;
