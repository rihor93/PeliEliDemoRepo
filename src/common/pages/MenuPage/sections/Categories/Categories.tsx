import { useStore } from '../../../../hooks';
import React from 'react';
import './Categories.css';
import { observer } from 'mobx-react-lite';
import { Cart, GurmagLogo } from '../../../../../assets';
import { config } from '../../../../configuration';
import { replaceImgSrc } from '../../../../helpers';
import { Divider, Result } from 'antd-mobile';
import { SmileOutline } from 'antd-mobile-icons';


export const Categories: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { categories, watchCourse, dishSearcher } = mainPage;

  return (
    <section className='categories'>
      {dishSearcher.isSearching 
        ? <div key='результаты-поиска' id='searching_result'>
          {dishSearcher.result.length 
            ? <Divider 
                contentPosition='left'
                style={{fontSize: '22px'}} 
              >
                  {`Найдено ${dishSearcher.result.length} блюд`}
              </Divider>
            : <Result
              icon={<SmileOutline />}
              status='success'
              title='Сегодня такого блюда в меню нет((('
              description='В ближающее время блюдо появится в меню'
            />
          }
          {
            dishSearcher.result.length
              ? <div className="courses_list">
                  {dishSearcher.result.map((course, index) =>
                    <div
                      className="course_item"
                      key={`результат-поиска-${course.Name}-${index}`}
                    >
                      <img
                        src={`${config.apiURL}/api/v2/image/Material?vcode=${course.VCode}&compression=true`}
                        onError={replaceImgSrc(GurmagLogo)}
                        onClick={() => watchCourse(course)}
                      />
                      <div className='item_bady'>
                        <h5 className='title' onClick={() => watchCourse(course)}>{course.Name}</h5>
                        <span style={{color: 'var(--тихий-текст)'}}>★</span>
                        <span>{Math.ceil(course.Quality * 10) / 10}</span>
                        <div className='price_cart'>
                          <span>{course.Price}</span>
                          <img
                            src={Cart}
                            onClick={() => watchCourse(course)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              : null
          }
          
        </div>
        : categories.map((category, index) =>
          <div key={category.VCode + '-' + index} id={String(category.VCode)}>
            <Divider 
              contentPosition="left" 
              style={{fontSize: '22px'}} 
            >
              {category.Name}
            </Divider>
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
                    <span style={{color: 'var(--тихий-текст)'}}>★</span>
                    <span>{Math.ceil(course.Quality * 10) / 10}</span>
                    <div className='price_cart'>
                      <span>{course.Price}</span>
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
        )
      }

    </section>
  )
})