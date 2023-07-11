import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, useTheme } from '../../../hooks';
import './Toolbar.css';

export const Toolbar: React.FC = observer(() => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const { cartStore } = useStore();
  return(
    <section className='toolbar'>
      <div className='toolbar_item'>
        <img 
          src={
            isDarkMode 
            ? './MainLight.png' 
            : './MainDark.png'
          } 
          alt="Главная" 
        />
        <span>Главная</span>
      </div>
      
      <div className='toolbar_item'>
        <img 
          src={
            isDarkMode 
            ? './MenuLight.png' 
            : 'MenuDark.png'
          } 
          alt="Меню" 
        />
        <span>Меню</span>
      </div>
      <div className='toolbar_item'>
        <img 
          src={
            isDarkMode 
            ? './ActionsLight.png' 
            : './ActionsDark.png'
          } 
          alt="Акции" 
        />
        <span>Акции</span>
      </div>
      <div className='toolbar_item'>
        <img 
          src={
            isDarkMode 
              ? './MoreLight.png' 
              : './MoreDark.png'
          } 
          alt="Еще" 
        />
        <span>Еще</span>
      </div>
      <div className='toolbar_item cartBtn'>
        <img 
          src={
            isDarkMode 
              ? './CartLight.png' 
              : './CartDark.png'
          } 
          alt="Корзина" 
          onClick={() => navigate('/cart')}
        />
        <span>Корзина</span>
        <span className='lobel'>{cartStore.items.length}</span>
      </div>
    </section>
  )
})