import React from 'react';
export const ErrorPage: React.FC<{ text: string }> = (props) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Ошибка!!!</h1>
      <hr />
      <p>{props.text}</p>
    </div>
  )
}