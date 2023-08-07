import { observer } from 'mobx-react-lite';
import { Cart, GurmagLogo } from '../../../assets';
import { LoaderFullscreen } from '../../components';
import Страничка from '../../components/layout/Page';
import { config } from '../../configuration';
import { replaceImgSrc } from '../../helpers';
import { useStore } from '../../hooks';
import { Modals } from '../MenuPage/modals';
import { Sections } from '../MenuPage/sections';
import './MainPage.css';

const Icon = () => <img src={GurmagLogo} style={{ height: '40px', width: '40px', borderRadius: '8px' }} />


export const MainPage: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { selectedCourse, isLoading, watchCourse } = mainPage;
  return (
    <Страничка>
      <LoaderFullscreen isLoad={isLoading} />
      {selectedCourse &&
        <Modals.course course={selectedCourse} />
      }
      <Страничка.Заголовочек Icon={<Icon />} fixed>
        Главная
      </Страничка.Заголовочек>
      
      <section className='categories'>
        <div style={{ height: '70px' }} />
      <Sections.carusel />
        <div key='популярное' id='популярное'>
          <h1>Популярное</h1>
          <div className="courses_list">

            {mainPage?.categories[0]?.CourseList?.map((course, index) =>
              <div
                className="course_item"
                key={`популярное-${course.Name}-${index}`}
              >
                <img
                  src={`${config.apiURL}/api/v2/image/Material?vcode=${course.VCode}&compression=true`}
                  onError={replaceImgSrc(GurmagLogo)}
                  onClick={() => watchCourse(course)}
                />
                <div className='item_bady'>
                  <h5 className='title' onClick={() => watchCourse(course)}>{course.Name}</h5>
                  <div className='price_cart'>
                    <span>{course.Discount_Price}</span>
                    <img
                      src={Cart}
                      onClick={() => watchCourse(course)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ height: '70px' }} />
      </section>
    </Страничка>
  )
})