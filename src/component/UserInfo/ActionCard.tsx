import React, { useCallback, useEffect, useState } from "react";


interface ActionCardProps {
    name: string,
    description: string,
}

const ActionCard: React.FC<ActionCardProps> = (props) => {

    return (

        <div className="cardBorder contentWrapper">
            <h2>Акция, {props.name}!</h2>
            <h2>Описание, {props.description} бонусных балов!</h2>
        </div>

    );
}

export default ActionCard;