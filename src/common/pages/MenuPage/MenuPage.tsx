import { observer } from 'mobx-react-lite';
import { LoaderFullscreen } from '../../components';
import Страничка from '../../components/layout/Page';
import { useStore } from '../../hooks';
import './MenuPage.css';
import { Modals } from './modals';
import { Sections } from './sections';

export const MenuPage: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { selectedCourse, isLoading } = mainPage;
  return (
    <Страничка>
      <LoaderFullscreen isLoad={isLoading} />
      {selectedCourse &&
        <Modals.course course={selectedCourse} />
      }
      <Sections.header />
      <Sections.carusel />
      <Sections.filter />
      <Sections.categories />
      <Sections.footer />
      {/* <CartOverlay count={cartStore.items.length}/> old */}
    </Страничка>
  )
})

