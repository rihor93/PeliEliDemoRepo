import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../Hook/useTelegram";
import { telegramBotUrl } from "../../constant/constant";
import './MenuList.css'
import MenuItem, { Course } from "../MenuItem/MenuItem";

interface Action {
    Name: string,
    Description: string,
    VCode: number,
}


const products = [
    { VCode: 1, Name: 'Джинсы', Price: 5000, description: 'Синего цвета, прямые' },
    { VCode: 2, Name: 'Куртка', Price: 12000, description: 'Зеленого цвета, теплая' },
    { VCode: 3, Name: 'Джинсы 2', Price: 5000, description: 'Синего цвета, прямые' },
    { VCode: 4, Name: 'Куртка 8', Price: 122, description: 'Зеленого цвета, теплая' },
    { VCode: 5, Name: 'Джинсы 3', Price: 5000, description: 'Синего цвета, прямые' },
    { VCode: 6, Name: 'Куртка 7', Price: 600, description: 'Зеленого цвета, теплая' },
    { VCode: 7, Name: 'Джинсы 4', Price: 5500, description: 'Синего цвета, прямые' },
    { VCode: 8, Name: 'Куртка 5', Price: 12000, description: 'Зеленого цвета, теплая' },
]

const getTotalPrice = (items: Course[] = []) => {
    return items.reduce((acc, item) => {
        return acc += item.Price
    }, 0)
}

const MenuList: React.FC = () => {
    const { tg, userID } = useTelegram();

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [userName, setUserName] = useState('');

    const [addedItems, setAddedItems] = useState<Course[]>([]);

    useEffect(() => {
        tg.ready();
        tg.MainButton.text = "Закрыть";
        tg.onEvent('mainButtonClicked', onClose);
        tg.MainButton.show();

        return () => {
            tg.offEvent('mainButtonClicked', onClose);
            //tg.MainButton.hide();
        }
    })

    useEffect(() => {
        console.log('загрузка данных с сервера')
        //userMenuInfo();
    }, [])

    const onClose = () => {
        tg.close();
    }



    const loadUserMenu = async () => {
        /* try {
             const response = await fetch(telegramBotUrl + 'elipelibot/getUserInfo/' + userID, {
                 method: 'get',
             })
             //console.log({ FAQData: data });
             if (response.status === 200) {
 
                 let data = JSON.parse(await response.text()).recordsets;
                 console.log(data);
                 //const blob = await response.
                 if (data[0].length > 0) {
                     setUserAuthorized(true);
                     setUserName(data[0][0].NAME)
                     setUserBosuses(data[0][0].Bonuses.toFixed(2))
                 }
                 setUserActions(data[1])
                 setLoading(false);
             }
         } catch (ex) {
             console.error(ex);
             setError(true);
         }*/
    }

    const onAdd = (product: Course) => {
        const alreadyAdded = addedItems.find(item => item.VCode === product.VCode);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.VCode !== product.VCode);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (


        <div className={'list'}>
            {/*<div className="contentWrapper">
                {
                    loading ?
                        <div>Идёт загрузка, пожалуйста подождите</div> : <></>

                }
            
            </div>*/}
            {products.map(item => (
                <MenuItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>


    );
}

export default MenuList;