import { useNavigate } from "react-router-dom";
import { BackDark, BackLight, cart } from "../../../assets";
import { useTheme } from "../../hooks";

export const Page: React.FC<WithChildren> = ({ children }) => 
  <div style={{height: '100vh', width: '100vw'}}>
    {children}
  </div>
// z heccrbq!!!
const Страничка = ({ children }: WithChildren) => {
  return (
    <main className='page'>
      {children}
    </main>
  )
}


const Заголовочек = ({ children, fixed, backButton, Icon }: {
  children: React.ReactNode & string,
  fixed?: boolean,
  backButton?: boolean,
  Icon?: React.ReactNode
}) => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const { theme } = useTheme();

  const isDarkMode = theme === 'dark';

  return (
    <section 
      className="page_header" 
      style={{ position: fixed ? 'fixed' : 'static'}}
    >
      {
        !backButton
          ? null
          : <img
            src={isDarkMode ? BackLight : BackDark}
            alt="Назад"
            onClick={goBack}
          />
      }
      {
        !Icon
          ? null
          : Icon
      }
      <h3>{children}</h3>
    </section>
  )
}

const ФильтрПолоска = () => { }

const Тело = ({ children }: WithChildren) => 
  <div 
    className="page_body"
  >
    {children}
  </div>

const Кнопочка = (props: { 
  children: React.ReactNode & string, 
  disabled?: boolean, 
  onClick: () => void, 
}) => {
  return (
    <section className='page_btn'>
      <div
        className="buy_button page_button" 
        onClick={props.onClick}
        style={{
          cursor: props.disabled
            ? 'not-allowed'
            : 'pointer'
        }}
      >
        <img src={cart} />
        <span>{props.children}</span>
      </div>
    </section>
  )
}


Страничка.Заголовочек = Заголовочек;
Страничка.Кнопочка = Кнопочка;
Страничка.Тело = Тело;
Страничка.ФильтрПолоска = ФильтрПолоска;
export default Страничка;