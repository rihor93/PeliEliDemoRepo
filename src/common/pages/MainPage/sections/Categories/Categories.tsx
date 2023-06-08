import { useStore } from '../../../../hooks';
import React from 'react';
import './Categories.css';
import { observer } from 'mobx-react-lite';


export const Categories: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { categories } = mainPage;

  React.useEffect(() => {
    mainPage.loadMenu()
  }, [])

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
                <img src={'./gurmag.png'} /> 
                <h5>{course.Name}</h5>
                {/* todo subtitle course */}
                <p>{course.Name}</p>
                <div>
                  <img src="./cart.svg" />
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