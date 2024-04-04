import { Button, DatePicker, Dropdown, PasscodeInput, Radio, Space, SpinLoading, Toast } from 'antd-mobile';
import { Input } from 'antd-mobile/es/components/input/input';
import { observer } from 'mobx-react-lite';
import { useState, FC } from "react";
import {getFormattedNumber, useMask} from "react-phone-hooks";
import { useStore } from '../../hooks';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import moment from 'moment';

const defaultMask = "+7 ... ... .. .."
const defaultPrefix = "+7"
const phoneRegex = /^((\+8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/

const style = {
  input: {
    width: "100%",
    borderRadius: "100px", 
    padding: "0.5rem 1rem",
    fontSize: "18px",
    border: "1px solid var(--громкий-текст)"
  },
  button: {
    width: "100%",
    borderRadius: "100px", 
    padding: "0.5rem 1rem",
    fontSize: "18px"
  },
  hello: {
    fontSize: 18,
    color: "var(--громкий-текст)",
    fontWeight: 500,
    textAlign: "center",
    margin: "1rem 0.5rem"
  },
  label: {
    fontSize: 16,
    color: "var(--тихий-текст)",
    fontWeight: 400,
    textAlign: "left",
    margin: "1rem"
  }
}

export const AuthPage: FC = observer(() => {
  const navigate = useNavigate()
  const { auth } = useStore()
  function getContent() {
    switch (auth.currentStage) {
      case 'authorized_successfully':
        navigate(-1)
        return null
      case 'input_tel_number':
        return <InputNumberComponent />
      case 'input_sms_code':
        return <InputSmsCodeComponent />
      case 'fill_form': 
        return <RegistrationFormComponent />
      default:
        return <Space 
          style={{ width: "100%", height: "40vh" }} 
          align='center' 
          justify='center'
        >
          <SpinLoading color='primary' />
        </Space>
    }
  }
  return(
    <div>
      <div style={{ height: "50px" }}/>
      {getContent()}
    </div>
  )
})

const InputNumberComponent: FC = observer(() => {
  const { auth } = useStore()
  const { tel } = useParams()
  const [number, setNumber] = useState(defaultPrefix)
  const [errored, setErrored] = useState(false)

  function onChange(value: string) {
    setNumber(getFormattedNumber(value, defaultMask))
    phoneRegex.test(number)
      ? setErrored(false)
      : setErrored(true)
  }

  function submit() {
    const clearNumber = number.replace(/\D/g, '')
    auth.login(clearNumber)
  }

  React.useEffect(function() {
    if(tel?.length)setNumber(getFormattedNumber(tel, defaultMask))
  }, [])
  return <div>
    <p style={style.hello as React.CSSProperties}>
      Введите номер телефона, чтобы войти или зарегестироваться
    </p>
    <Space style={{ padding: '0.5rem', boxSizing: 'border-box'}}>
      <Input 
        type={"tel"}
        value={number} 
        onChange={onChange} 
        { ...useMask(defaultMask) } 
        style={style.input}
      />
      <Button 
        disabled={errored || number.length < 10}
        onClick={submit}
        style={style.button} 
        color='primary' 
        shape='rounded'
      >
        Отправить
      </Button>
    </Space>
    
    {errored && 
      <pre style={{
        background: "var(--adm-color-danger)",
        color: 'white',
        padding: 10, marginBottom: 24, marginTop: 15
      }}>
        Номер введен не корректно
      </pre>
    }
  </div>
})

const InputSmsCodeComponent: FC = observer(() => {
  const LENGHT = 4

  const { auth } = useStore()
  function onFill(val: string) {
    auth.inputSmsCode(val)
  }
  return <>
    <p style={style.hello as React.CSSProperties}>
      Мы отправили SMS с кодом на указанный номер. Введите код подтверждения:
    </p>
    <Space justify='center' style={{ width: "100%" }}>
      <PasscodeInput length={LENGHT} onFill={onFill} />
    </Space>
  </>
})

const genderLabels = {
  муж: 'Мужской',
  жен: 'Женский'
}

const RegistrationFormComponent: FC = observer(() => {
  const navigate = useNavigate()
  const { auth } = useStore()
  const [name, setName] = useState('')
  const [birthday, setBirthDay] = useState('')
  const [gender, setGender] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)

  const [showBirthdayInput, setShowBirthdayInput] = useState(false)

  React.useEffect(() => {
    name.length && birthday.length && gender.length
      ? setIsDisabled(false)
      : setIsDisabled(true)
  }, [name, birthday, gender])

  function submit() {
    const preparedBirthday = birthday.replace(/\D/g, '')
    auth.registration({
      name, 
      birthday: preparedBirthday, 
      gender,
    })
  }

  const now = new Date()
  return <>
    <DatePicker 
      visible={showBirthdayInput}
      onClose={() => setShowBirthdayInput(false)}
      onConfirm={isoStr => setBirthDay(isoStr.toISOString())}
      defaultValue={now}
      max={now}
      min={new Date("1924-01-01")}
      confirmText='Сохранить'
      cancelText='Закрыть' 
    />
    <p style={style.hello as React.CSSProperties}>
      Расскажите о себе
    </p>
    <p style={style.label as React.CSSProperties}>
      Как вас зовут?
    </p>
    <Input 
      placeholder='Ваше имя'
      value={name}
      style={style.input}
      onChange={val => { setName(val) }}
    />
    <p style={style.label as React.CSSProperties}>
      Когда у вас день рождения?
    </p>
    <p 
      style={{ ...style.input, padding: '0.75rem 1rem' }}
      onClick={() => setShowBirthdayInput(true)}
    >
      {birthday.length 
        ? moment(birthday).format('DD-MM-YYYY')
        : 'ДД-ММ-ГГГГ'
      }
    </p>
    <p style={style.label as React.CSSProperties}>
      Ваш пол:
    </p>
    <Dropdown style={{ ...style.input, padding: '0.25rem' }}>
      {/* @ts-ignore */}
      <Dropdown.Item key='sorter' title={genderLabels[gender] || 'Выберите пол'}>
        <div style={{ padding: 12 }}>
          <Radio.Group defaultValue='default' onChange={val => { setGender(val.toString()) }}>
            <Space direction='vertical' block>
              <Radio block value='муж'>
                Мужской
              </Radio>
              <Radio block value='жен'>
                Женский
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </Dropdown.Item>
    </Dropdown>
    <Button 
      disabled={isDisabled}
      color='primary' 
      shape='rounded' 
      style={{ ...style.button, marginTop: 24 }}
      onClick={submit}
    >
      Отправить
    </Button>
  </>
})