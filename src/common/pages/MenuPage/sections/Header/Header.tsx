import { GurmagLogo, telephone } from '../../../../../assets';
import './Header.css';
export const Header: React.FC = () => {
  return (
    <header className='header'>
      <img
        className="header_logo"
        src={GurmagLogo}
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
        <img src={telephone} />
        <div>
          <h5>8-800-535-35-35</h5>
          <p>Проще позвонить чем у кого-то занимать</p>
        </div>
      </div>
    </header>
  )
}