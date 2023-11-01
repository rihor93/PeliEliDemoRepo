import { Card, NavBar, Space, Tag } from "antd-mobile"
import { observer } from "mobx-react-lite";
import moment from "moment";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { GurmagLogo } from "../../../assets";
import { config } from "../../configuration";
import { replaceImgSrc } from "../../helpers";
import { useStore } from "../../hooks";
import * as uuid from 'uuid';

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
export const OrdersPage: FC = observer(() => {
  const { userStore } = useStore()
  const navigate = useNavigate()
  const onBack = () => {navigate(-1)}
  return(
    <div style={{background: 'var(--tg-theme-secondary-bg-color)', minHeight: '100vh'}}>
      <NavBar 
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
        История заказов
      </NavBar>
      <div style={{height: '45px'}} />
      <Space direction="vertical" style={{...W100, marginTop: '0.75rem'}}>
        {[...userStore.orderHistory].sort((a, b) => new Date(b.DocumentDate).getTime() - new Date(a.DocumentDate).getTime()).map(order =>
          <Card 
            key={order.VCode}
            style={{
              width: 'calc(100% - 1.5rem)', 
              border: '1px solid var(--adm-border-color)', 
              margin: '0 0.75rem 0.25rem 0.75rem',
              background: 'var(--tg-theme-bg-color)'
            }}
            title={`Заказ от ${moment(order.DocumentDate).format('LLL')}`}
            extra={<span style={{marginLeft: '0.25rem'}}>{`№ ${order.VCode}`}</span>}
            onClick={() => {
              userStore.selectedHistoryOrder = order;
              navigate(String(order.VCode));
            }}
          >
            <Space style={W100} justify='between'>
              <Group>
                <Span>Статус заказа:</Span>
                <br />
                <Tag 
                  style={{marginTop: '0.25rem'}} 
                  color={OrderStatusColors[order.StatusOrder] || 'default'}
                >
                  {order.StatusOrder}
                </Tag>
              </Group>
              <Group>
                <Span>Статус оплаты:</Span>
                <br />
                <Tag 
                  style={{marginTop: '0.25rem'}} 
                  color={PaymentStatusColors[order.PaymentStatus] || 'default'}
                >
                  {order.PaymentStatus}
                </Tag>
              </Group>
            </Space>
            <Group>
              <Span>Точка:</Span>
              <P>{order.OrgName}</P>
            </Group>
            <Group>
              <Span>Дата получения:</Span>
              <P>{moment(order.DeliveryTime).format('LLL')}</P>
            </Group>
            
            <Scrollable>
              {order.Courses.map(item => 
                <img 
                  key={item.CourseCode}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginRight: '0.25rem'
                  }}
                  src={`${config.apiURL}/api/v2/image/Material?vcode=${item.CourseCode}&compression=true&random=${uuid.v4()}`}
                  onError={replaceImgSrc(GurmagLogo)}
                />
              )}
            </Scrollable>
          </Card>
        )}
      </Space>
      <div style={{height: '55px'}} />
    </div>
  )
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
