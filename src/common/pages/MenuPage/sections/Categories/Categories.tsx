import { useStore } from '../../../../hooks';
import React from 'react';
import './Categories.css';
import { observer } from 'mobx-react-lite';
import { Cart, GurmagLogo } from '../../../../../assets';
import { config } from '../../../../configuration';
import { replaceImgSrc } from '../../../../helpers';
import { Avatar, Divider, Ellipsis, List, Popup, Rate, Result, Skeleton, Space } from 'antd-mobile';
import { SmileOutline } from 'antd-mobile-icons';
import moment from 'moment';


export const Categories: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { categories, watchCourse, dishSearcher } = mainPage;

  return (
    <section className='categories'>
      <Popup 
        visible={mainPage.otziviModal.show}
        onClose={() => mainPage.closeWatchOtzivi()}
        closeOnMaskClick
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          padding:'1rem 0.5rem 0.5rem 0.5rem'
        }}
      >
        {
          mainPage.otzivistate === 'LOADING'
          ? <div>
            <Skeleton.Paragraph animated />
            <Skeleton.Paragraph animated />
            <Skeleton.Paragraph animated />
          </div>
          : !mainPage.selectedCourse 
            ? null 
            : <div style={{maxHeight: '65vh', overflow: 'scroll'}}>
              <span>
                <Rate
                  allowHalf
                  readOnly 
                  count={1}
                  defaultValue={1}
                  style={{'--star-size': '20px' }}
                />
                {/* @ts-ignore */}
                <span style={{fontSize: '20px'}}>
                  {Math.ceil(mainPage.selectedCourse.Quality * 10) / 10}
                </span>
              </span>
              <br />
              <br />
              
              <span style={{margin: '0.5rem'}}>{mainPage.selectedCourse.Name}</span>
              <List header='Последние отзывы'>
                {/* @ts-ignore */}
                {mainPage.selectedCourseReviews[0]?.map((review: CourseOtzyv, index) => {
                  const splitedNum = review.Phone.split('')
                  const last3nums = [...splitedNum].slice(8, 11)
                  // const next2nums = [...splitedNum].slice(6, 8)
                  // const middle2nums = [...splitedNum].slice(4, 6)
                  const first3nums = [...splitedNum].slice(1, 4)
                  const countryCode = [...splitedNum].slice(0, 1)
                  const maskedTel = [...countryCode, '-', ...first3nums, '-', '**', '-', '**', '-', ...last3nums]
                  return(
                    <List.Item
                      key={index}
                      prefix={
                        <Avatar 
                          src=''
                          style={{ 
                            borderRadius: 20, 
                            width: '40px', 
                            height: '40px', 
                          }}
                          fit='cover'
                        />
                      }
                      description={ 
                        <div>
                          <p>{`${maskedTel.join('')} поставил ★${review.Rating}`}</p>
                        </div>
                      }
                    >
                      <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>{review.FIO?.length ? review.FIO : 'Покупатель'}</span>
                        <span style={{fontSize:'12px', color: 'var(--тихий-текст)'}}>
                          {moment(review.Date).format('DD-MM-YYYY')}
                        </span>
                      </span>
                    </List.Item>
                  )
                })}
              </List>
            </div>
        }
      </Popup>
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
                        <Ellipsis 
                          rows={2}
                          content={course.Name}
                          onContentClick={() => watchCourse(course)}
                          className='title'
                        />
                        <Space 
                          align='center' 
                          style={{'--gap': '3px', margin: '0.5rem 0' }}>
                          <Rate count={1} value={1} style={{ '--star-size': '16px' }}/>
                          <div>{Math.ceil(course.Quality * 10) / 10}</div>
                          <div 
                            style={{
                              color:'var(--tg-theme-link-color)',
                              fontSize: '10px', 
                            }} 
                            onClick={() => mainPage.watchOtzivi(course)}
                          >
                            Смотреть отзывы
                          </div>
                        </Space>

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
                    <Ellipsis 
                      rows={2}
                      content={course.Name}
                      onContentClick={() => watchCourse(course)}
                      className='title'
                    />
                    <Space 
                      align='center' 
                      style={{'--gap': '3px', margin: '0.5rem 0' }}>
                      <Rate count={1} value={1} style={{ '--star-size': '16px' }}/>
                      <div>{Math.ceil(course.Quality * 10) / 10}</div>
                      <div 
                        style={{
                          color:'var(--tg-theme-link-color)',
                          fontSize: '10px', 
                        }} 
                        onClick={() => mainPage.watchOtzivi(course)}
                      >
                        Смотреть отзывы
                      </div>
                    </Space>

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