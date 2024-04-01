import { Popup, Skeleton } from "antd-mobile"
import { FC } from "react"



export const LotteryDescriptionPopup: FC<{ show: boolean, close: () => void }> = ({ show, close }) => {
  const hide = () => close()
  return(
    <Popup
      position='bottom'
      visible={show}
      showCloseButton
      onClose={hide}
      onMaskClick={hide}
      style={{ zIndex: 6 }}
      bodyStyle={{ width: '100vw', height: '100vh'}}
    >
      <Skeleton.Title animated />
      <h2>Todo</h2>
      <Skeleton.Paragraph lineCount={5} animated />
      <Skeleton animated style={{
        '--width': "70%",
        '--height': "100px",
        '--border-radius': '8px',
      }} />
    </Popup>
  )
}