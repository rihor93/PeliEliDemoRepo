import { List, Popup } from "antd-mobile";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { FC, useEffect } from "react";
import { useStore } from "../../hooks";


export const SelectSlotPopup: FC<{ orderDate: Date }> = observer(function({ orderDate }) {
  const { cartStore } = useStore()
  const { 
    selectSlotPopup, 
    setSelectedSlot, 
    availbaleSlots, 
    getTimeString, 
    getSlots,
  } = cartStore
  const hide = () => selectSlotPopup.close()
  const isToday = moment(orderDate).isSame(new Date(), 'day')

  function selectSlot(slot: Slot) {
    setSelectedSlot(slot)
    selectSlotPopup.close()
  }

  useEffect(() => {
    getSlots()
  }, [])
  return(
    <Popup
      position='bottom'
      visible={selectSlotPopup.show}
      showCloseButton
      onClose={hide}
      onMaskClick={hide}
      style={{ zIndex: 5 }}
      bodyStyle={{ width: '100vw',  borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
    >
      <h2 style={{ margin: '2rem 0 0 2rem' }}>Когда доставить?</h2>
      <p style={{ margin: '0.5rem 0 0 2rem', color: 'var(--adm-color-weak)' }}>От этого зависит ассортимент</p>
      <List style={{ padding:'1rem' }}>
        {availbaleSlots.map(slot => 
          <List.Item onClick={() => selectSlot(slot)}>
            {`${getTimeString(slot)} ${isToday ? 'сегодня' : moment(orderDate).format("DD-MM-YYYY")}`}
          </List.Item>
        )}
      </List>
    </Popup>
  )
})