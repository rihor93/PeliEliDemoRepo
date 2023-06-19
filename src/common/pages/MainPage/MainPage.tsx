import { observer } from 'mobx-react-lite';
import { useStore, useTheme } from '../../hooks';
import './MainPage.css';
import { Modals } from './modals';
import { Sections } from './sections';

export const MainPage: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { switchTheme } = useTheme();
  const { selectedCourse, isLoading } = mainPage;
  return(
    <main className='page main_page'>
      <button onClick={() => switchTheme('dark')}>to dark</button>
      <button onClick={() => switchTheme('light')}>to light</button>
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