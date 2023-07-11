import './MorePage.css';
import Страничка from '../../components/layout/Page';
export const MorePage: React.FC = () => {
  return(
    <Страничка>
      <Страничка.Заголовочек fixed backButton>
        Ещё
      </Страничка.Заголовочек>
    </Страничка>
  )
}