import './Header.css';
export const Header: React.FC = () => {
  return (
    <header className='header page_header'>
      <img
        className="header_logo"
        src="./gurmag.png"
      />
      <div className="header_slogan">
        <h4>Гурмаг</h4>
        <q className="slogan_quote">Какой-то слоган</q>
      </div>
      <div className="header_advantage">
        <h5>Доставка еды за 30 минут</h5>
        <p>Работаем круглосуточно 24/7</p>
      </div>
      <div className="header_contacts">
        <img src="./telephone.svg" />
        <div>
          <h5>8-800-535-35-35</h5>
          <p>Проще позвонить чем у кого-то занимать</p>
        </div>
      </div>
      <img 
        className='header_cart'
        src="./cart.svg" 
      />
    </header>
  )
}