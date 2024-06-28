import { useStore, useTheme } from '../../../../hooks';
import React from 'react';
import './Categories.css';
import { observer } from 'mobx-react-lite';
import { NoImageSmall } from '../../../../../assets';
import { config } from '../../../../configuration';
import { Avatar, Divider, Image, List, Popup, Rate, Result, Skeleton, Space, Tag, Toast } from 'antd-mobile';
import { SmileOutline } from 'antd-mobile-icons';
import moment from 'moment';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';


export const Categories: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { categories, dishSearcher, state } = mainPage;

  if(state === 'COMPLETED') {
    return (
      <section className='categories'>
        <OtziviPopup />
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
                      <CourseItemComponent 
                        key={`popular-${course.Name}-${index}`}
                        course={course}
                      />
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
                  <CourseItemComponent 
                    key={`${category.Name}-${course.Name}-${index}`}
                    course={course}
                  />
                )}
              </div>
            </div>
          )
        }

      </section>
    )
  } else {
    return <>
      <Skeleton.Title style={{margin: '1rem'}} animated />
      <section className='categories'>
        <div>
          <div className="courses_list">
            {new Array(2).fill(null).map((_, index) => 
              <div className="course_item" key={index}>
                <Skeleton animated style={{ height: "114px", width: "100%" }}/>
                <div className='item_bady'>
                  <Skeleton.Title style={{ marginTop: '12px', height: "16px", width: "130px" }} />
                  <Space 
                    align='center' 
                    style={{'--gap': '3px', margin: '0.5rem 0' }}
                  >
                    <Skeleton animated style={{ width: "16px", height: "16px" }} />
                    <Skeleton animated style={{ width: "40px", height: "10px" }} />
                  </Space>

                  <div className='price_cart'>
                    <div className="keke">
                      <Skeleton animated style={{ width: "40px", height: "40px" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  }
})

export const OtziviPopup: React.FC = observer(() => {
  const { mainPage } = useStore();
  return(
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
  )
})

const iconStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center'
}
type Evt = React.MouseEvent<HTMLSpanElement, MouseEvent>
export const CourseItemComponent: React.FC<{ course: CourseItem }> = observer(({ course }) => { 
  const { mainPage, session } = useStore();
  
  return(
    <div className="course_item">
      <Image 
        lazy
        src={`${config.apiURL}/api/v2/image/Material?vcode=${course.VCode}&compression=true&random=${session}`} 
        onClick={() => mainPage.watchCourse(course)} 
        fallback={<img src={NoImageSmall} style={{objectFit: 'cover', width: '100%', height: '114px'}} onClick={() => mainPage.watchCourse(course)} />}
        placeholder={<Skeleton style={{ width: '100%', height: '114px' }} animated/>}
        fit='cover'
        width="auto"
        height="114px"
        style={{
          "--height": "114px",
          "--width": "auto",
        }}
      />
      <CardBodyComponent course={course} />
    </div>
  )
})

const CardBodyComponent: React.FC<{ course: CourseItem }> = observer(({ course }) => {
  const { theme } = useTheme()
  const { mainPage, cartStore } = useStore()
  function addToCart(e: Evt) {
    e.stopPropagation()
    cartStore.addCourseToCart(course)
    Toast.show({
      position: 'center', 
      content: 'Добавлено'
    })
  }
  return(
    <div className='item_bady' style={{ position: 'relative' }}>
      {!course.NoResidue && course.EndingOcResidue
        ? <div 
          style={{
            position:'absolute',
            top: -9,
            left: 0,
            right: 0,
            borderRadius: 8,
            textAlign: 'center',
            padding: '0.1rem 0.3rem',
            background: 'var(--gurmag-accent-color)',
            fontSize: '14px',
            fontWeight: '700',
            color: 'white',
          }}
        >
          <p>{`сегодня осталось ${course.EndingOcResidue}`}</p>
        </div>
        : null
      }
      
      <h3 
        className='title'
        onClick={() => mainPage.watchCourse(course)}
      >
        <span>{course.Name + " "}</span>
        <span style={{ color: theme === 'dark' ? "#b3b3b3" : "#808080" }}>{course.Weigth}</span>
      </h3>
      <Space 
        align='center' 
        style={{'--gap': '3px', margin: '0.5rem 0' }}
      >
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
        <span>{`${course.Price} ₽`}</span>
        <div className="keke">
          {cartStore.isInCart(course)
            ? <>
              <Tag
                color='primary' 
                style={{ 
                  position: 'absolute',
                  top: '-5px', 
                  right: '-5px', 
                  lineHeight: '1',
                  fontSize: '12px', 
                  '--border-radius': '6px', 
                }}
              >
                {cartStore.findItem(course.VCode)?.quantity}
              </Tag>
              <CheckOutlined style={iconStyle} onClick={addToCart} />
            </>
            : <PlusOutlined style={iconStyle} onClick={addToCart} />
          }
          
        </div>
      </div>
    </div>
  )
})