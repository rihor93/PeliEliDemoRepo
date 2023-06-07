import { useStore } from '../../../../hooks';
import React from 'react';
import './Categories.css';
import { observer } from 'mobx-react-lite';


export const Categories: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { category_courses: categories } = mainPage;

  return (
    <section className='categories'>

      {categories.map((category) => 
        <div key={category.id} id={category.id}>
          <h1>{category.category}</h1>
          <div className="courses_list">

            {category.courses.map((course, index) => 
              <div 
                className="course_item" 
                key={`${category.id}-${index}`}
              >
                <img src={course.img} />
                <h5>{course.title}</h5>
                <p>{course.subtitle}</p>
                <div>
                  <img src="./cart.svg" />
                  <span>{course.price}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  )
})