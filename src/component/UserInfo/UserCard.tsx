import React from "react";

interface UserCardProps {
    name: string,
    bonuses: string,
}

const UserCard: React.FC<UserCardProps> = (props) => {

    return (

        <div className="contentWrapper">
            <h1>Добрый день, {props.name}!</h1>
            <h1>Вам доступно, {props.bonuses} бонусных балов!</h1>
        </div>

    );
}

export default UserCard;