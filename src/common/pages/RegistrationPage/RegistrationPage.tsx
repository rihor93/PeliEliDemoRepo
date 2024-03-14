import { Button, Form, Input } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const RegistrationPage: React.FC = observer(() => {
  function onFinish() {}
  return(
    <div>
      <div style={{ height: "45px" }}/>
      <Form
        name='form'
        onFinish={onFinish}
        footer={
          <Button block type='submit' color='primary' size='large'>
            Отправить 
          </Button>
        }
      >
        <Form.Item 
          name='name' 
          label='Введите номер телефона, чтобы войти или зарегестироваться' 
          rules={[{ required: true, message: "Номер обязателен" }]}
        >
          <Input placeholder='Введите номер' type="tel" />
        </Form.Item>
      </Form>
    </div>
  )
})