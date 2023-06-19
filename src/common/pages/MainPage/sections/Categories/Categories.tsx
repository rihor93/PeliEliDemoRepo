import { useStore } from '../../../../hooks';
import React from 'react';
import './Categories.css';
import { observer } from 'mobx-react-lite';


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
                {/* todo image src */}
                <img 
                  src={'./gurmag.png'} 
                  onClick={() => watchCourse(course)}
                /> 
                <h5 onClick={() => watchCourse(course)}>{course.Name}</h5>
                {/* todo subtitle course */}
                <p>{course.Name}</p>
                <div>
                  <img 
                    src="./cart.svg"
                    onClick={() => watchCourse(course)}
                  />
                  <span>{course.Discount_Price}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  )
})