import { Popup, Toast, Divider, Radio, Space, Skeleton, Dropdown, Selector, Input, DatePicker, Form, Collapse, Modal, Dialog, Picker } from 'antd-mobile';
import Button from 'antd-mobile/es/components/button';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import Страничка from '../../components/layout/Page';
import { useInterval, useStore, useTelegram } from '../../hooks';
import { Optional, Undef } from '../../types';
import CartItem from './cartItem/CartItem';
import './CartPage.css';
import { ConfirmOrderModal } from './modals/confirmOrderModal';
import { toJS } from 'mobx';
import { ToastHandler } from 'antd-mobile/es/components/toast';
import { isDevelopment } from '../../helpers';
import { useNavigate } from 'react-router-dom';




export const CartPage: React.FC = observer(
  () => {
    /** тост с загрузкой */
    const handler = React.useRef<ToastHandler>()
    const { userId } = useTelegram();
    const navigate = useNavigate();
    const { cartStore: cart, userStore, mainPage } = useStore();
    /** Если надо спросить домашнюю кухню */
    const [askedAddr, setAskedAddr] = React.useState(0);

    /** Показывать ли датапикер для ввода даты */
    const [visibleDate, setVisibleDate] = React.useState(false);
    /** Показывать ли датапикер для ввода времени */
    const [visibleTime, setVisibleTime] = React.useState(false);

    /** сама дата */
    const [date, setDate] = React.useState(new Date());

    /** время заказа сразу + 15мин к текущему времени */
    const [time, setTime] = React.useState(moment().add(15, 'minutes').format('HH:mm'));

    /**
     * из двух отдельных инпутов берем 
     * дату и время и слепляем 
     * в один ISO date
     */
    const outputDate = React.useMemo(() => {
      const [hours, minets] = time.split(':')
      const orderDate = date;
      orderDate.setHours(Number(hours));
      orderDate.setMinutes(Number(minets));
      return orderDate.toISOString()
    }, [date, time])

    const [
      contactPhone, 
      setContactPhone
    ] = React.useState<string>(userStore.userState.Phone);

    const validationPhoneErr = React.useCallback(() => {
      if(!contactPhone.length) return 'Введите номер телефона'
      if(contactPhone.length !== 11 ) return 'Номер телефона указан неверно!'
      return null
    }, [contactPhone.length])

    function postOrder() { 
      // при оформлении заказа надо убедится чтобы 
      // на дату заказа были все блюда
      // если сегодня чего-то нет, то заказ на сегодня сделать нельзя
      /**
       * если сегодня нет какого-то блюда
       */
      const isNotAllowToday = cart.items
        .map(({ couse, quantity }) => couse.NoResidue ? false : quantity > couse.EndingOcResidue)
        .includes(true)

      /**
       * если заказ нужен на сегодня
       */
      const isOnToday = moment(outputDate).isSame(new Date(), 'day')
      
      if(isNotAllowToday && isOnToday) {
        // показывем диалог если только
        // сегодня чего-то нет
        // а пользователь поставил сегодня
        Dialog.show({
          title: 'Такой заказ только завтра',
          content: <div>
            <p>{`Некоторые блюда, которые вы хотели заказать сегодня уже закончились(((`}</p>
            <p>{`Вы сможете забрать заказ только завтра или позднее`}</p>
          </div>,
          closeOnAction: true, 
          closeOnMaskClick: true, 
          actions: [
            {
              key: 'tomorrow', 
              text: `Забрать завтра (${moment(outputDate).add(1,'days').format('YYYY-MM-DD HH:mm')})`, 
              onClick() {
                const fixedDate = moment(outputDate).add(1,'days').toDate();
                setDate(fixedDate);
                cart.postOrder({
                  itemsInCart: toJS(cart.items),
                  userId, 
                  currentOrg: String(isDevelopment() ? 146 : userStore.currentOrg),
                  contactPhone,
                  orderDate: fixedDate.toISOString()
                }, handler)
                  .then(() => {
                    Modal.confirm({
                      content: 'Поздравляем! Заказ оформлен!',
                      cancelText: 'Закрыть',
                      confirmText: 'Перейти в заказы',
                      onConfirm: () => {
                        navigate('/orders')
                      },
                    })
                  })
              },
            },
            {
              key: 'chooseAnother', 
              text: 'Выбрать другое время', 
              onClick() { setVisibleDate(true) },
            },
            {
              key: 'backToCart', 
              text: 'Вернуться к корзине'
            }
          ]
        })
        
      } else {
        cart.postOrder({
          itemsInCart: toJS(cart.items),
          userId, 
          currentOrg: String(isDevelopment() ? 146 : userStore.currentOrg),
          contactPhone,
          orderDate: outputDate
        }, handler)
          .then(() => {
            Modal.confirm({
              content: 'Поздравляем! Заказ оформлен!',
              cancelText: 'Закрыть',
              confirmText: 'Перейти в заказы',
              onConfirm: () => {
                navigate('/orders')
              },
            })
          })
      }
    }


    
    const [pickerM, setPickerM] = React.useState(moment().add(15, 'minutes').format('mm'))
    const [pickerH, setPickerH] = React.useState(moment().add(15, 'minutes').format('HH'))



    type pic = { label: string, value: string }
    const workrange = React.useMemo(() => {
      
      let hours: pic[] = [];
      let minutes: pic[] = [];
      function fillMinutes(start: number, end: number) {
        for(let i = start; i <= end; i++) {
          const value = i < 10 ? `0${i}` : `${i}`
          minutes.push({ label: value, value })
        }
      }
      function fillHours(start: number, end: number) {
        for(let i = start; i <= end; i++) { 
          const value = i < 10 ? `0${i}` : `${i}`
          hours.push({ label: value, value })
        }
      }
      const minH = 9;
      const maxH = 21;
      // если выбрана сегодняшняя дата
      if(moment(date).isSame(new Date(), 'day')) {
        // сетаем только диапазон от текущего времени до конца рабочего дня
        const nowH = moment().add(15, 'minutes').hours();
        const nowM = moment().minutes();
        fillHours(nowH, maxH)
        // если это текущий час
        // то мы не должны выбрать минуты раньше чем текущие минуты
        if(pickerH === hours[0].value) {
          if(nowM < 45) {
            fillMinutes(nowM + 15, 59)
          } else {
            fillMinutes(nowM + 15 - 60, 59)
          }
        } else {
          fillMinutes(0, 59)
        }
      } else {
        // иначе сетаем всё время работы
        fillHours(minH, maxH);
        fillMinutes(0, 59)
      }
      
      return [
        hours, 
        minutes 
      ]
    }, [date, time, pickerH, pickerM])

    useInterval(() => {
      // каждую минуту проверяем чтобы время заказа не
      // стало раньше чем текущее время
      // * если заказ на сегодня
      if(moment(date).isSame(new Date(), 'day')) {
        // * если время заказа указано раньше чем 
        // * текущее время + время на готовку
        const [orderHours, orderMinets] = time.split(':')
        const [nowHours, nowMinets] = moment()
          .format('HH:mm')
          .split(':')

        if(
          ((Number(orderHours) * 60) + Number(orderMinets)) < 
          ((Number(nowHours) * 60) + Number(nowMinets) + 15)
        ) {
          setTime(moment().add(15, 'minutes').format('HH:mm'))
        }
      }
    }, 1000 * 60)


    return (
      <Страничка>
      <Picker
        columns={workrange}
        visible={visibleTime}
        onClose={() => {
          setVisibleTime(false)
        }}
        onConfirm={(picked) => { 
          setTime(picked.join(':'))
        }}
        onSelect={val => {
          setPickerM(val[1] as string)
          setPickerH(val[0] as string)
        }}
        confirmText='Сохранить'
        cancelText='Закрыть'
        defaultValue={time.split(':')}
      />
      <DatePicker 
        visible={visibleDate}
        onClose={() => setVisibleDate(false)}
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
                
                /** ищем основную инфу */
                const campaignAllInfo = allCampaign.find(camp =>
                  camp.VCode === cartItem.campaign
                )
                /** ищем детали для этой скидки в скидках на блюда */
                const dishDiscount = dishDiscounts.filter(dishDiscount =>
                  dishDiscount.vcode === cartItem.campaign
                ).find(dishDiscount => 
                  dishDiscount.dish === cartItem.couse.VCode
                )

                /** ищем детали для этой скидки в процентных скидках */
                const percentDiscount = percentDiscounts.find(percentDiscount =>
                  percentDiscount.vcode === cartItem.campaign
                )

                /** ищем детали для этой скидки в скидках на сеты */
                const setDish = dishSet.filter((setDish) =>
                  setDish.vcode === cartItem.campaign
                ).find(setDish =>
                  Boolean(setDish.dishes.find(dishSet =>
                    dishSet.dish === cartItem.couse.VCode
                  ))
                )

                let text: Optional<string> = null;
                let dishArr: Undef<CourseItem>[] = []; 

                // должна найтись только одна из трех 
                // если это скидка 
                // на одно блюдо
                if (dishDiscount && !percentDiscount && !setDish) {
                  const targetDish = mainPage.getDishByID(dishDiscount.dish)
                  if (targetDish?.Name) 
                    if(dishDiscount.price) {
                      text = `Cкидка ${dishDiscount.price}руб на "${targetDish?.Name}"`
                    }
                    // @ts-ignore
                    if(dishDiscount.discountPercent) {
                      // @ts-ignore
                      text = `Cкидка ${dishDiscount.discountPercent}% на "${targetDish?.Name}"`
                    }
                    
                  
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
                        ? <Form.Item label={`Акция - ${campaignAllInfo.Name.replace(/ *\{[^}]*\} */g, "")}`}>
                          <span>{campaignAllInfo.Description.replace(/ *\{[^}]*\} */g, "")}</span><br />
                          <span>{text}</span><br />
                        </Form.Item>
                        : null
                      }
                      <Form.Item 
                        label={`цена со скидкой за ${cartItem.quantity} шт`} 
                        extra={<s>{`${Math.ceil((cartItem.couse.Price * cartItem.quantity) * 100) / 100} руб.`}</s>}
                      >
                        <Input                       
                          readOnly
                          value={String(Math.ceil(cartItem.priceWithDiscount * 100) / 100) + ' руб.'}
                        />
                      </Form.Item>
                    </Form>
                  </Collapse.Panel>
                )
              })}
            </Collapse>
            <Divider contentPosition='left'>Способ доставки</Divider>
            <Selector 
              style={{display: 'flex', justifyContent: 'center'}}
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
              style={{ 
                '--text-align': 'center', 
                border: validationPhoneErr()?.length ?'1px solid var(--adm-color-warning)' : '', 
                borderRadius: '100px'
              }}
              placeholder='Введите ваш номер'
              onChange={(str) => setContactPhone(str)}
              value={contactPhone}
              type='tel'
            />
            {!validationPhoneErr()?.length 
              ? null
              : <span style={{color: 'var(--adm-color-warning)'}}>Введите номер телефона</span>
            }
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
              <span onClick={() => setVisibleDate(true)}>
                {moment(date).format('DD-MM-YYYY')}
              </span>
            </Form.Item>
            <Form.Item label='Время' childElementPosition='right'>
              <span onClick={() => setVisibleTime(true)}>
                {time}
              </span>
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
            onClick={() => validationPhoneErr()?.length 
              ? Toast.show({ content: 'Укажите номер телефона', position: 'center' })
              : postOrder()
            }
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