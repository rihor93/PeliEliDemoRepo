import { useStore } from '../../../../hooks';
import React from 'react';
import './Categories.css';
import { observer } from 'mobx-react-lite';
import { Cart, GurmagLogo } from '../../../../../assets';
import { config } from '../../../../configuration';
import { replaceImgSrc } from '../../../../helpers';


export const Categories: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { categories, watchCourse } = mainPage;

  return (
    <section className='categories'>

      {categories.map((category, index) =>
        <div key={category.VCode + '-' + index} id={String(category.VCode)}>
          <h1>{category.Name}</h1>
          <div className="courses_list">

            {category.CourseList.map((course, index) =>
              <div
                className="course_item"
                key={`${category.Name}-${course.Name}-${index}`}
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
      )}

    </section>
  )
})