import React from 'react';
import Button from "../Button/Button";
import './MenuItem.css';
import { CourseItem } from '../../types/menuDataLoadTypes';


type ProductItemProps = {
    product: CourseItem, 
    className: string, 
    onAdd: (product: CourseItem) => void
}

const MenuItem: React.FC<ProductItemProps> = ({product, className, onAdd}) => {

    const onAddHandler = () => {
        onAdd(product);
    }

    return (
        <div className={'product ' + className}>
            <div className={'img'}/>
            <div className={'title'}>{product.Name}</div>
            <div className={'price'}>
                <span>Стоимость: <b>{product.Price}</b></span>
            </div>
            <Button className={'add-btn'} onClick={onAddHandler}>
                Добавить в корзину
            </Button>
        </div>
    );
};

export default MenuItem;