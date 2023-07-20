import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionsDark, ActionsLight, CartDark, CartLight, MainDark, MainLight, MenuDark, MenuLight, MoreDark, MoreLight } from '../../../../assets';
import { useStore, useTheme } from '../../../hooks';
import './Toolbar.css';

export const Toolbar: React.FC = observer(() => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const { cartStore } = useStore();

  const path = window.location.pathname;
  if (path === '/cart' || path === '/more') return null

  return (
    <section className='toolbar'>
      <div className='toolbar_item' onClick={() => navigate('/')}>
        <img
          src={
            isDarkMode
              ? MainLight
              : MainDark
          }
          alt="Главная"
        />
        <span>Главная</span>
      </div>

      <div className='toolbar_item' onClick={() => navigate('/menu')}>
        <img
          src={
            isDarkMode
              ? MenuLight
              : MenuDark
          }
          alt="Меню"
        />
        <span>Меню</span>
      </div>
      <div className='toolbar_item' onClick={() => navigate('/actions')}>
        <img
          src={
            isDarkMode
              ? ActionsLight
              : ActionsDark
          }
          alt="Акции"
        />
        <span>Акции</span>
      </div>
      <div className='toolbar_item' onClick={() => navigate('/more')}>
        <img
          src={
            isDarkMode
              ? MoreLight
              : MoreDark
          }
          alt="Еще"
        />
        <span>Еще</span>
      </div>
      <div
        className={'toolbar_item cartBtn'}
        onClick={() => navigate('/cart')}
      >
        <img
          src={
            isDarkMode
              ? CartLight
              : CartDark
          }
          alt="Корзина"
        />
        <span>Корзина</span>
        <span className='lobel'>{cartStore.items.length}</span>
      </div>
    </section>
  )
})