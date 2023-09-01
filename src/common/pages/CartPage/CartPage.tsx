import { Popup, Toast, Divider, Radio, Space, Skeleton, Dropdown, Selector, Input, DatePicker, Form, Collapse, Picker } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import Button from 'antd-mobile/es/components/button';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import Страничка from '../../components/layout/Page';
import { useStore, useTelegram } from '../../hooks';
import { Optional, Undef } from '../../types';
import CartItem from './cartItem/CartItem';
import './CartPage.css';
import { ConfirmOrderModal } from './modals/confirmOrderModal';
import type { PickerValue } from 'antd-mobile/es/components/picker'
import { toJS } from 'mobx';



export const CartPage: React.FC = observer(
  () => {
    const { userId } = useTelegram();
    const { cartStore: cart, userStore, mainPage } = useStore();
    /** Если надо спросить домашнюю кухню */
    const [askedAddr, setAskedAddr] = React.useState(0);

    /** Показывать ли датапикер для ввода даты */
    const [visible, setVisible] = React.useState(false);

    /** сама дата */
    const [date, setDate] = React.useState(new Date());

    /** время заказа */
    const [time, setTime] = React.useState(moment(new Date()).format('HH:MM'));

    const [
      contactPhone, 
      setContactPhone
    ] = React.useState<string>('');

    React.useEffect(() => {
      const fixedDate = cart.items
        .map(({ couse, quantity }) => couse.NoResidue ? false : quantity > couse.EndingOcResidue)
        .includes(true)
          ? moment().add(1,'days').toDate()
          : new Date()
      
      setDate(fixedDate)
    }, [cart.items.length, cart.items])

    return (
      <Страничка>
      <DatePicker 
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={(isoStr) => setDate(isoStr)}
        defaultValue={new Date()}
        min={
          cart.items
            .map(({ couse, quantity }) => couse.NoResidue ? false : quantity > couse.EndingOcResidue)
            .includes(true)
            ? moment().add(1,'days').toDate()
            : new Date()
        }
        confirmText='Сохранить'
        cancelText='Закрыть'
      />
        <ConfirmOrderModal />
        {userStore.needAskAdress 
          ? <Popup 
              visible={userStore.needAskAdress} 
              onMaskClick={() => {
                Toast.show({
                  content: 'Пожалуйста, выберите местоположение',
                  position: 'center',
                })
              }}
              bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                padding:'0 0.5rem 0.5rem 0.5rem'
              }}
            >
              <div>
                <Divider>Выберите вашу домашнюю кухню:</Divider>
                <Radio.Group 
                  onChange={(e) => setAskedAddr(e as number)}
                >
                  <Space direction='vertical' block>
                    {userStore.organizations.map((org) => 
                      <Radio block value={org.Id} key={org.Id}>
                        {org.Name}
                      </Radio>
                    )}
                  </Space>
                </Radio.Group>
                <Button 
                  block 
                  color='primary' 
                  size='large'
                  className="mt-1"
                  onClick={() => {
                    if(askedAddr == 142 || askedAddr == 0) {
                      Toast.show({
                        content: 'Выберите местоположение',
                        position: 'center',
                      })
                    } else {
                      userStore.currentOrg = askedAddr
                    }
                  }}
                >
                  Сохранить
                </Button>
              </div>
            </Popup>
          : null
        }
        <Страничка.Тело>
        {mainPage.isLoading && mainPage.cookIsLoading 
          ? preloader()
          : <>
            {!cart.isEmpty
              ? cart.items.map((item, index) =>
                <CartItem
                  key={`cart_item_${index}`}
                  courseInCart={item}
                  add={() => cart.addCourseToCart(item.couse)}
                  remove={() => cart.removeFromCart(item.couse.VCode)}
                />
              )
              : <div 
                style={{
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '1rem'
                }}>
                <p>Корзина пуста 🛒</p>
              </div>
            }
          </>
        }
        
        {cart.isEmpty 
          ? null 
          : <div style={{width: '100%'}}>
            <Divider contentPosition='left'>
              Проверьте детали заказа
            </Divider>
            <Collapse style={{width: '100%'}}>
              {cart.items.map((cartItem, index) => { 
                const { 
                  dishSet, 
                  allCampaign, 
                  dishDiscounts, 
                  percentDiscounts 
                } = userStore.userState
                
                /** ищем детали для этой скидки в скидках на блюда */
                const campaignAllInfo = allCampaign.find((camp) =>
                  camp.VCode === cartItem.campaign
                )
                /** ищем детали для этой скидки в скидках на блюда */
                const dishDiscount = dishDiscounts.find((dishDiscount) =>
                  dishDiscount.vcode === cartItem.campaign
                )

                /** ищем детали для этой скидки в процентных скидках */
                const percentDiscount = percentDiscounts.find((percentDiscount) =>
                  percentDiscount.vcode === cartItem.campaign
                )

                /** ищем детали для этой скидки в скидках на сеты */
                const setDish = dishSet.find((setDish) =>
                  setDish.vcode === cartItem.campaign
                )

                let text: Optional<string> = null;
                let dishArr: Undef<CourseItem>[] = []; 

                // должна найтись только одна из трех 
                // если это скидка 
                // на одно блюдо
                if (dishDiscount && !percentDiscount && !setDish) {
                  const targetDish = mainPage.getDishByID(dishDiscount.dish)
                  if (targetDish?.Name) 
                    text = `Cкидка ${dishDiscount.price}руб на "${targetDish?.Name}"`
                  
                }

                // если это процентная скидка
                if (!dishDiscount && percentDiscount && !setDish) {
                  const { MaxSum, MinSum, discountPercent, bonusRate } = percentDiscount;
                  text = `Cкидка ${discountPercent}% на сумму от ${MinSum} до ${MaxSum} руб`;
                  if (bonusRate) text = text + ` + ${bonusRate} бонусных баллов`
                }

                // если это скидка на сет
                if (!dishDiscount && !percentDiscount && setDish) {
                  text = `Cкидка на ${setDish.dishCount} блюда из списка:`;
                  dishArr = setDish.dishes.map((dishDiscount) =>
                    mainPage.getDishByID(dishDiscount.dish)
                  )
                }
                return(
                  <Collapse.Panel 
                    key={String(index)} 
                    title={`${cartItem.couse.Name} - ${cartItem.quantity}шт.:`}
                  >
                    <Form>
                      {campaignAllInfo 
                        ? <Form.Item label='Акция'>
                          <span>{campaignAllInfo.Name}</span><br />
                          <span>{campaignAllInfo.Description}</span><br />
                          <span>{text}</span><br />
                        </Form.Item>
                        : null
                      }
                      <Form.Item label={`цена со скидкой за ${cartItem.quantity} шт`}>
                        <Input                       
                          readOnly
                          value={String(cartItem.priceWithDiscount)}
                        />
                      </Form.Item>
                      <Form.Item label={`цена без скидки за 1шт`}>
                        <Input                       
                          readOnly
                          value={String(cartItem.couse.Price)}
                        />
                      </Form.Item>
                    </Form>
                  </Collapse.Panel>
                )
              })}
            </Collapse>
            <Divider contentPosition='left'>Способ доставки</Divider>
            <Selector
              options={cart.deliveryOptions}
              value={[cart.receptionType]}
              onChange={(arr) => cart.setReceptionType(arr[0])}
            />
            {cart.receptionType === 'pickup' 
              ? <>
                <Divider contentPosition='left'>Где хотите забрать?</Divider>
                <Dropdown>
                  <Dropdown.Item 
                    key='sorter'                     
                    title={
                      <span style={{fontSize: '17px'}}>
                        {userStore.currentOrganizaion?.Name}
                      </span>
                    }
                  >
                    <div style={{ padding: 12, fontSize: '12px' }}>
                      <Radio.Group 
                        value={userStore.currentOrg}
                        onChange={(e) => userStore.currentOrg = e as number}
                      >
                        <Space direction='vertical' block>
                          {userStore.organizations.map((org) => 
                            <Radio block value={org.Id} key={org.Id}>
                              {org.Name}
                            </Radio>
                          )}
                        </Space>
                      </Radio.Group>
                    </div>
                  </Dropdown.Item>
                </Dropdown>
              </>
              : <>
                <Divider contentPosition='left'>Введите адрес доставки</Divider>
                <Form>
                  <Form.Item label='Ваш адрес, чтобы доставщик мог вас найти'>
                    <Input 
                      placeholder='Ул. Пушикна, Дом Колотушшкина 273819237'
                    />
                  </Form.Item>
                </Form>
              </>
            }
            <Divider contentPosition='left'>Контактный телефон</Divider>
            <Input 
              style={{ '--text-align': 'center' }}
              placeholder='Введите ваш номер'
              onChange={(str) => setContactPhone(str)}
              value={contactPhone}
              type='tel'
            />
          </div>
        }
        <div className='row' style={{width: '100%', padding: '1rem'}}>
          <h5>Итого:</h5>
          <h5>{`${Math.ceil(cart.totalPrice * 10) / 10} ₽`}</h5>
        </div>
        {cart.isEmpty 
          ? null 
          : <Form layout='horizontal' style={{width: '100%'}}>
            <Form.Item label='Дата заказа:' childElementPosition='right'>
              <span onClick={() => setVisible(true)}>
                {moment(date).format('DD-MM-YYYY')}
              </span>
            </Form.Item>
            <Form.Item label='Время' childElementPosition='right'>
              <Input 
                type={'time'}
                value={time}
                onChange={(e) => setTime(e)}
                placeholder={moment(new Date()).format('HH-MM')}
              />
            </Form.Item>
          </Form>
        }

        
        {cart.isEmpty 
          ? null
          : <Button 
            block 
            color='primary' 
            size='large' 
            className='mt-1'
            style={{borderRadius: '8px'}}
            onClick={() => cart.postOrder({
              itemsInCart: toJS(cart.items),
              userId, 
              currentOrg: String(userStore.currentOrg),
              contactPhone,
              orderDate: (() => {
                const [hours, minets] = time.split(':')
                const orderDate = date;
                orderDate.setHours(Number(hours));
                orderDate.setMinutes(Number(minets));
                return orderDate.toISOString()
              })()
            })}
          >
            Заказать
          </Button>
        }
        </Страничка.Тело>
      </Страничка>
    )
  }
)



const preloader = () => <> 
  <Skeleton animated style={skeletonStyle} />
  <Skeleton animated style={skeletonStyle} />
</>

const skeletonStyle = {
  width: '100%', 
  height: '100px', 
  borderRadius: '8px', 
  marginTop: '1rem'
}