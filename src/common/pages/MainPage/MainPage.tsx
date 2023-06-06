import './MainPage.css';
import { Sections } from './sections';

export const MainPage: React.FC = () => {
  return(
    <main className='page main_page'>
      <Sections.header />
      <Sections.carusel />
      <Sections.filter />
      <Sections.categories />
      <Sections.footer />
    </main>
  )
}