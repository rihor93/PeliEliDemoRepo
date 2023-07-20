import React from 'react';
import { CrossDark, CrossLight } from '../../../assets';
import { useTheme } from '../../hooks';
import './Modal.css';

type E = React.MouseEvent<HTMLDivElement, MouseEvent>

export const Modal: React.FC<{
  children: React.ReactNode,
  show: boolean,
  onHide: () => void
}> = (props) => {
  if (props.show) {
    const close = (event: E) => {
      event.stopPropagation();
      props.onHide();
    }
    return (
      <div className='modal_background' onClick={close}>
        <div className='modal' onClick={e => e.stopPropagation()}>
          <CloseButton onClick={close} />
          {props.children}
        </div>
      </div>
    )
  } else {
    return null
  }
}

const CloseButton = (props: { onClick: (event: E) => void }) => {
  const { theme } = useTheme();
  return (
    <div className='modal_close_button' onClick={props.onClick}>
      <img src={theme === 'dark' ? CrossLight : CrossDark} alt="Close" />
    </div>
  )
}