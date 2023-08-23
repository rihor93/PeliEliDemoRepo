import './MorePage.css';
import Страничка from '../../components/layout/Page';
import { useTheme } from '../../hooks';
import { ChatLight, HistoryDark, HistoryLight, LocationDark, LocationLight, MapPointsDark, MapPointsLight, ProfileDark, ProfileLight, telephone } from '../../../assets';
export const MorePage: React.FC = () => {
  const { theme } = useTheme();
  const isdarkMode = theme === 'dark';
  return (
    <Страничка>
      <ul className='moreList'>
        <li>
          <img src={isdarkMode ? LocationLight : LocationDark} alt="Города" />
          <select name="" id="">
            {['Уфа', 'Агидель', 'Стерлитамак', 'Белебей', 'Набережные Челны'].map((city) =>
              <option key={city} value={city}>{city}</option>
            )}
          </select>
        </li>
        <li>
          <img src={telephone} style={{ height: '24px' }} alt="Телефон" />
          +7 (800) 800-00-00
        </li>
        <li>
          <button className='chatBtn'>
            <img className='chatBtn_img' src={ChatLight} alt="Написать в чат" />
            Написать в чат
          </button>
        </li>
        <li className='mt-1'>
          <img className='me-1' src={isdarkMode ? ProfileLight : ProfileDark} alt="profile" />
          Профиль
        </li>
        <li className='mt-1'>
          <img className='me-1' src={isdarkMode ? MapPointsLight : MapPointsDark} alt="Адреса доставки" />
          Адреса доставки
        </li>
        <li className='mt-1'>
          <img className='me-1' src={isdarkMode ? HistoryLight : HistoryDark} alt="История заказов" />
          История заказов
        </li>
      </ul>
    </Страничка>
  )
}