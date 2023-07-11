import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks";
// z heccrbq!!!
const Страничка = ({ children }: WithChildren) => {
  return (
    <main className='page'>
      {children}
    </main>
  )
}


const Заголовочек = ({ children, fixed, backButton }: {
  children: React.ReactNode & string,
  fixed?: boolean,
  backButton?: boolean,
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
            src={isDarkMode ? './BackLight.png' : './BackDark.png'}
            alt="Назад"
            onClick={goBack}
          />
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
        <img src="./cart.svg" />
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