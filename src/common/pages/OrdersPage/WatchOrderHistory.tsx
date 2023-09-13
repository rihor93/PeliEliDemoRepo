import { Card, Divider, List, NavBar, Space, Tag } from "antd-mobile";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { GurmagLogo } from "../../../assets";
import { config } from "../../configuration";
import { replaceImgSrc } from "../../helpers";
import { useStore } from "../../hooks";


const OrderStatusColors = {
  'Создан': 'default',
  'В работе': 'primary',
  'Сборка заказа': 'primary',
  'В пути': 'primary',
  'Оплачен': 'success',
  'Отменён': 'danger',
}
const PaymentStatusColors = {
  'Не оплачен': 'default',
  'Оплачен частично': 'warning',
  'Оплачен': 'success',
}

const W100 = {width: '100%'}

export const WatchOrderDetailModal: FC = observer(() => {
  const navigate = useNavigate()
  const { userStore } = useStore();
  const onBack = () => {navigate(-1)}
  if(userStore.selectedHistoryOrder) {
    return(
      <div 
        style={{
          background: 'var(--tg-theme-secondary-bg-color)', 
          minHeight: '100vh'
        }}
      >
        <NavBar 
          back='Заказы'
          onBack={onBack} 
          style={{
            borderBottom: 'solid 1px var(--adm-color-border)', 
            position: 'fixed',
            left: '0',
            right: '0',
            top: '0',
            background: 'var(--tg-theme-bg-color)',
            zIndex: '1'
          }}
        >
          <div>
            <div>{`Заказ № ${userStore.selectedHistoryOrder.VCode}`}</div>
            <div style={{fontSize: '12px'}}>
              {`от ${moment(userStore.selectedHistoryOrder.DocumentDate).format('LLL')}`}
            </div>
          </div>
        </NavBar>
        <div style={{height: '45px'}} />
        <Card 
          style={{
            width: 'calc(100% - 1.5rem)', 
            border: '1px solid var(--adm-border-color)', 
            margin: '0.75rem 0.75rem 0.25rem 0.75rem',
            background: 'var(--tg-theme-bg-color)'
          }}
        >
          <Space style={W100} justify='between'>
            <Group>
              <Span>Статус заказа:</Span>
              <br />
              <Tag 
                style={{marginTop: '0.25rem'}} 
                color={OrderStatusColors[userStore.selectedHistoryOrder.StatusOrder] || 'default'}
              >
                {userStore.selectedHistoryOrder.StatusOrder}
              </Tag>
            </Group>
            <Group>
              <Span>Статус оплаты:</Span>
              <br />
              <Tag 
                style={{marginTop: '0.25rem'}} 
                color={PaymentStatusColors[userStore.selectedHistoryOrder.PaymentStatus] || 'default'}
              >
                {userStore.selectedHistoryOrder.PaymentStatus}
              </Tag>
            </Group>
          </Space>
          <Group>
            <Span>Точка:</Span>
            <P>{userStore.selectedHistoryOrder.OrgName}</P>
          </Group>
          <Group>
            <Span>Дата получения:</Span>
            <P>{moment(userStore.selectedHistoryOrder.DeliveryTime).format('LLL')}</P>
          </Group>
          <Group>
            <Span>Сумма итого:</Span>
            <P>{userStore.selectedHistoryOrder.OrderCost + 'руб'}</P>
          </Group>
          <Divider>Блюда:</Divider>
          <List>
            {userStore.selectedHistoryOrder.Courses.map(item => 
              <List.Item 
                style={{fontSize: '14px'}}
                description={`${item.CourseCost} руб.`}
              >
                {`${item.CourseName} - ${item.CourseQuantity} шт.`}
              </List.Item>
            )}
          </List>
          
          <Divider>Получатель:</Divider>
          <Group>
            <Span>Номер телефона:</Span>
            <P>{userStore.userState.Phone}</P>
          </Group>
        </Card>
        <div style={{height: '55px'}} />
      </div>
    )
  } else {
    return null
  }
})


const Span: FC<WithChildren> = ({ children }) => 
  <span style={{fontWeight: '700', fontSize: '14px'}}>
    {children}
  </span>

const Group: FC<WithChildren> = ({ children }) => 
  <div style={{marginBottom: '0.75rem'}}>
    {children}
  </div>

const P: FC<WithChildren> = ({ children }) => 
  <p style={{marginTop: '0.5rem'}}>{ children }</p>

const Scrollable: FC<WithChildren> = ({ children }) => 
  <div style={{
    display: 'flex',
    overflowX: 'scroll'
  }}>
    {children}
  </div>
