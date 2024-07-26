import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { PrimeReactContext } from "primereact/api";
import { Button } from "primereact/button";

const ButtonComponent = ({
    badge,
    badgeClassName,
    children,
    disabled = false,
    icon,
    iconPos = "left",
    label,
    link = false,
    loading = false,
    loadingIcon,
    outlined = false,
    plain = false,
    pt,
    ptOptions,
    raised = false,
    rounded = false,
    severity,
    size,
    text = false,
    tooltip,
    tooltipOptions,
    unstyled = false,
    visible = true,
    onClick,
    className,
}) => {
    const { setRipple } = useContext(PrimeReactContext);

    useEffect(() => {
        setRipple(true);
    }, [setRipple]);

    return (
        <Button
            badge={badge}
            badgeClassName={badgeClassName}
            disabled={disabled}
            icon={icon}
            iconPos={iconPos}
            label={label}
            link={link}
            loading={loading}
            loadingIcon={loadingIcon}
            outlined={outlined}
            plain={plain}
            pt={pt}
            ptOptions={ptOptions}
            raised={raised}
            rounded={rounded}
            severity={severity}
            size={size}
            text={text}
            tooltip={tooltip}
            tooltipOptions={tooltipOptions}
            unstyled={unstyled}
            visible={visible}
            onClick={onClick}
            className={className}
            style={{ borderRadius: "8px" }}
        >
            {children}
        </Button>
    );
};

ButtonComponent.propTypes = {
    badge: PropTypes.string,
    badgeClassName: PropTypes.string,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    iconPos: PropTypes.oneOf(["left", "top", "bottom", "right"]),
    label: PropTypes.string,
    link: PropTypes.bool,
    loading: PropTypes.bool,
    loadingIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    outlined: PropTypes.bool,
    plain: PropTypes.bool,
    pt: PropTypes.object,
    ptOptions: PropTypes.object,
    raised: PropTypes.bool,
    rounded: PropTypes.bool,
    severity: PropTypes.oneOf([
        "success",
        "help",
        "warning",
        "secondary",
        "info",
        "danger",
    ]),
    size: PropTypes.oneOf(["small", "large"]),
    text: PropTypes.bool,
    tooltip: PropTypes.string,
    tooltipOptions: PropTypes.object,
    unstyled: PropTypes.bool,
    visible: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default ButtonComponent;
