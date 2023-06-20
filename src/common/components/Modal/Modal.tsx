import React from 'react';
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
          {props.children}
        </div>
      </div>
    )
  } else {
    return null
  }
}