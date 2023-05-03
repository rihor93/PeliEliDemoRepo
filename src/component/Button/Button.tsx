import { type } from "@testing-library/user-event/dist/type";
import React from "react";
import './Button.css';

interface ComponentProps extends  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}

const Button: React.FC<ComponentProps> = (props) => {
    return (
        <button {...props} className={'button ' + props.className}/>
    );
}

export default Button;