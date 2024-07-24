import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { PrimeReactContext } from "primereact/api";
import { Button } from "primereact/button";
import "../../css/ButtonComponent.css";

const ButtonComponent = ({
    label,
    className = "custom-button",
    icon,
    iconPos,
    onClick,
    severity,
}) => {
    const { setRipple } = useContext(PrimeReactContext);

    useEffect(() => {
        setRipple(true);
    }, [setRipple]);

    return (
        <Button
            label={label}
            className={className}
            icon={icon}
            iconPos={iconPos}
            onClick={onClick}
            severity={severity}
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
};

export default ButtonComponent;
