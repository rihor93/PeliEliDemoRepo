import { Button, Divider, Popup, Radio, Space, Toast, Modal } from "antd-mobile";
import { observer } from "mobx-react-lite";
import { useState } from 'react'
import { useStore } from "../../hooks";


export const ChangeLocationModal = observer(() => {
  const [askedAddr, setAskedAddr] = useState(0)
  const { userStore, auth } = useStore()
  return(
    <Modal
      visible={auth.isShowChangeLocationModal}
      closeOnAction
      header='Добрый день!'
      title='Выберите вашу домашнюю кухню:'
      onClose={() => {
        auth.setShowChangeLocationModal(false)
      }}
      content={
        <div style={{ padding: 12 }}>
          <Radio.Group
            onChange={e => setAskedAddr(e as number)}>
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
                  content: 'Выберите вашу домашнюю кухню',
                  position: 'center',
                })
              } else {
                userStore.currentOrg = askedAddr;
                userStore.saveCurrentOrg(askedAddr)
                auth.setShowChangeLocationModal(false)
              }
            }}
          >
            Сохранить
          </Button>
        </div>
      }
    />
  )
})
