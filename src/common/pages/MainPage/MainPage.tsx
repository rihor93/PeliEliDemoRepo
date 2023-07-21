import { observer } from 'mobx-react-lite';
import { Cart, GurmagLogo } from '../../../assets';
import Страничка from '../../components/layout/Page';
import { useStore } from '../../hooks';
import './MainPage.css';

const Icon = () => <img src={GurmagLogo} style={{height: '40px', width: '40px', borderRadius: '8px'}} />


export const MainPage: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { watchCourse } = mainPage;
  return (
    <Страничка>
      <Страничка.Заголовочек Icon={<Icon />} fixed>
        Главная
      </Страничка.Заголовочек>
      <section className='categories'>
        <div key='популярное' id='популярное'>
          <h1>Популярное</h1>
          <div className="courses_list">

            {mainPage?.categories[0]?.CourseList?.map((course, index) =>
              <div
                className="course_item"
                key={`популярное-${course.Name}-${index}`}
              >
                {/* todo image src */}
                <img
                  src={GurmagLogo}
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