import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks';
import './MainPage.css';
import { Modals } from './modals';
import { Sections } from './sections';

export const MainPage: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { selectedCourse, isLoading } = mainPage;
  return(
    <main className='page main_page'>
      {selectedCourse && 
        <Modals.course course={selectedCourse} />
      }
      <Sections.header />
      <Sections.carusel />
      <Sections.filter />
      <Sections.categories />
      <Sections.footer />
    </main>
  )
})