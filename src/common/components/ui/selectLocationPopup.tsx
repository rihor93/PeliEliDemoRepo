import { Button, Divider, Popup, Radio, Space, Toast } from "antd-mobile";
import { observer } from "mobx-react-lite";
import { useState } from 'react'
import { useStore } from "../../hooks";


export const SelectLocationPopup = observer(() => {
  const [askedAddr, setAskedAddr] = useState(0)
  const { userStore } = useStore()
  return(
    <Popup 
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
        <Radio.Group onChange={e => setAskedAddr(e as number)}>
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
              userStore.currentOrg = askedAddr;
              userStore.saveCurrentOrg(askedAddr)
            }
          }}
        >
          Сохранить
        </Button>
      </div>
    </Popup>
  )
})