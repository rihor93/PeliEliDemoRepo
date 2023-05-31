import React from 'react';
import Button from "../Button/Button";
import './MenuCategory.css';
import { CategoryCourse, CourseItem } from '../../reducers/menuData/menuDataLoadTypes';


type CategoryItemProps = {
    product: CategoryCourse, 
    className: string, 
    onClick: (category: CategoryCourse) => void
}

const MenuCategory: React.FC<CategoryItemProps> = ({product, className, onClick}) => {

    const onClickHandler = () => {
        onClick(product);
    }

    return (
        <div className={'product ' + className}>
            <div className={'img'}/>
            <div className={'title'}>{product.Name}</div>
            <Button className={'add-btn'} onClick={onClickHandler}>
                Выбрать
            </Button>
        </div>
    );
};

export default MenuCategory;