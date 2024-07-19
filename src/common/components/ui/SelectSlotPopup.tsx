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
    slots
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


  function renderList() {
    if(isToday) {
      const nearest2hSlot: Slot = { 
        VCode: '-1', 
        Name: 'Ближайшие два часа',
        Start: '',
        End: '',
        EndTimeOfWork: '',
        StartCook: '',
      }
      return <>
        {availbaleSlots.length
          ? <List.Item key="-1" onClick={() => selectSlot(nearest2hSlot)}>
            {nearest2hSlot.Name}
          </List.Item>
          : null
        }
         
         {availbaleSlots.map(slot => 
            <List.Item key={slot.VCode} onClick={() => selectSlot(slot)}>
              {`${getTimeString(slot)} сегодня`}
            </List.Item>
          )}

        {!availbaleSlots.length
          ? <List.Item>Сегодня уже нет доступных слотов</List.Item>
          : null
        }
      </>
    } else {
      return availbaleSlots.map(slot => 
        <List.Item key={slot.VCode} onClick={() => selectSlot(slot)}>
          {`${getTimeString(slot)} ${moment(orderDate).format("DD-MM-YYYY")}`}
        </List.Item>
      )
    }
  }
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
        {renderList()}
      </List>
    </Popup>
  )
})