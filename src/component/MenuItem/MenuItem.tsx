import React from 'react';
import Button from "../Button/Button";
import './MenuItem.css';
import { CourseItem } from '../../reducers/menuData/menuDataLoadTypes';


type ProductItemProps = {
    product: CourseItem,
    className: string,
    onAdd: (product: CourseItem) => void,
    onDel?: (product: CourseItem) => void,
    quantity?: number,
    price?: number,
}

const MenuItem: React.FC<ProductItemProps> = ({ product, className, onAdd, onDel, quantity, price }) => {

    const onAddHandler = () => {
        if (onAdd != null) onAdd(product);
    }

    const onDelHandler = () => {
        if (onDel != null) onDel(product);
    }

    return (
        <div className={'product ' + className}>
            <div className={'img'} />
            <div className={'title'}>{product.Name}</div>
            {quantity == null ?
                <div>
                    <div className={'price'}>
                        <span>Цена: <b>{product.Price.toFixed(2)}</b></span>
                    </div>
                    <Button className={'add-btn'} onClick={onAddHandler}>
                        Добавить в корзину
                    </Button>
                </div>
                :
                <div>
                    <div className={'price'}>
                        <span>Стоимость: <b>{price?.toFixed(2)}</b></span>
                    </div>
                    <div>
                        <button onClick={onAddHandler}>+</button>
                        <span>{quantity}</span>
                        <button onClick={onDelHandler}>-</button>
                    </div>
                </div>}

        </div>
    );
};

export default MenuItem;