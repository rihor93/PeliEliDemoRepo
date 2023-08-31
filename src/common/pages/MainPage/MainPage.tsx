import { HomeOutlined } from "@ant-design/icons"
import { Toast, Swiper, Divider, Skeleton, Footer, Avatar, Space, Rate, Dropdown, Radio, Popup, Button, WaterMark, Result } from "antd-mobile"
import { observer } from "mobx-react-lite"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cart, GurmagLogo, gurmag_big } from '../../../assets';
import { Page } from "../../components";
import { config } from '../../configuration';
import { replaceImgSrc } from '../../helpers';
import { useStore, useTheme } from '../../hooks';
import { ItemModal } from "../MenuPage/modals/ItemModal";
import './MainPage.css';
import { FC } from 'react';
import Ellipsis from "antd-mobile/es/components/ellipsis";
import { List } from "antd-mobile";
import moment from "moment";
import { Optional, Undef } from "../../types";
import { ClockCircleOutline } from "antd-mobile-icons";


export const MainPage: FC = observer(() => { 
  const { theme } = useTheme();

  const isDarkMode = theme === 'light';

  const { userStore, actionsPage, mainPage } = useStore();

  const { selectedCourse, state, cookstate, watchCourse } = mainPage;

  const { 
    dishSet, 
    allCampaign, 
    dishDiscounts,  
    percentDiscounts 
  } = userStore.userState; 

  const navigate = useNavigate();

  const [askedAddr, setAskedAddr] = useState(0)
  return(
    <Page>
      {state === 'COMPLETED' && cookstate === 'COMPLETED'
        ? <>
        {selectedCourse 
          ? <ItemModal course={selectedCourse} />
          : null
        }
        {userStore.needAskAdress 
          ? <Popup 
              visible={userStore.needAskAdress} 
              onMaskClick={() => {
                Toast.show({
                  content: 'Пожалуйста, выберите местоположение',
                  position: 'center',
                })
              }}
              bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                padding:'0 0.5rem 0.5rem 0.5rem'
              }}
            >
              <div>
                <Divider>Выберите вашу домашнюю кухню:</Divider>
                <Radio.Group 
                  onChange={(e) => setAskedAddr(e as number)}
                >
                  <Space direction='vertical' block>
                    {userStore.organizations.map((org) => 
                      <Radio block value={org.Id} key={org.Id}>
                        {org.Name}
                      </Radio>
                    )}
                  </Space>
                </Radio.Group>
                <Button 
                  block 
                  color='primary' 
                  size='large'
                  className="mt-1"
                  onClick={() => {
                    if(askedAddr == 142 || askedAddr == 0) {
                      Toast.show({
                        content: 'Выберите местоположение',
                        position: 'center',
                      })
                    } else {
                      userStore.currentOrg = askedAddr
                    }
                  }}
                >
                  Сохранить
                </Button>
              </div>
            </Popup>
          : (
            <Dropdown>
              <Dropdown.Item 
                key='sorter' 
                title={
                  <div style={{fontSize: '12px', color: 'var(--тихий-текст)'}}>
                    <HomeOutlined />
                    <span>Ваша домашняя кухня:</span>
                    <br />
                    <span style={{fontSize: '18px', color: 'var(--громкий-текст)'}}>
                      {userStore.currentOrganizaion?.Name}
                    </span>
                  </div>
                }
              >
                <div style={{ padding: 12 }}>
                  <Radio.Group 
                    defaultValue={userStore.currentOrg}
                    onChange={(e) => userStore.currentOrg = e as number}
                  >
                    <Space direction='vertical' block>
                      {userStore.organizations.map((org) => 
                        <Radio block value={org.Id} key={org.Id}>
                          {org.Name}
                        </Radio>
                      )}
                    </Space>
                  </Radio.Group>
                </div>
              </Dropdown.Item>
            </Dropdown>
          )
        }
        
          <Swiper 
            loop
            autoplay
            style={{
              borderRadius: '8px', 
              margin: '0.5rem',
              width: 'calc(100% - 1rem)'
            }}
          >
            {allCampaign.map((campaign, index) => 
              <Swiper.Item key={index}>
                <img 
                  src={config.apiURL + '/api/v2/image/Disount?vcode=' + campaign.VCode} 
                  onError={replaceImgSrc(gurmag_big)} 
                  onClick={() => {
                    actionsPage.watchAction(campaign)
                    navigate('/actions/' + campaign.VCode)
                  }}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '180px',
                    display: 'flex'
                  }}
                  alt={campaign.Name} 
                />
              </Swiper.Item>
            )}
          </Swiper>
          
          
          <Divider contentPosition="left" style={{fontSize: '22px'}} >Сегодня готовят</Divider>
          <div 
            style={{
              margin: '0 0.5rem', 
              width: 'calc(100% - 1rem)', 
              display: 'flex',
              flexWrap: 'nowrap', 
              overflowX: 'scroll', 
              overflowY: 'hidden', 
            }} 
          >
            <Popup 
              visible={mainPage.watchCockModal.show}
              onClose={() => mainPage.closeCookWatch()}
              closeOnMaskClick
              bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                padding:'1rem 0.5rem 0.5rem 0.5rem'
              }}
            >
              {
                mainPage.loadCookInfoState === 'LOADING'
                ? <div>
                  <Skeleton.Paragraph />
                  <Skeleton.Paragraph />
                  <Skeleton.Paragraph />
                </div>
                : !mainPage.selectedCock 
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
                        {Math.ceil(mainPage.selectedCock?.Rating * 10) / 10}
                      </span>
                    </span>
                    <br />
                    
                    <span style={{margin: '0.5rem'}}>{mainPage.selectedCock.NameWork}</span>
                    <List header='Последние отзывы'>
                      {/* @ts-ignore */}
                      {mainPage.selectedCockReviews[0].map((review, index) => (
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
                          description={`★${review.Rating} ${review.Course}`}
                        >
                          <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span>{review.FIO?.length ? review.FIO : 'Покупатель'}</span>
                            <span style={{fontSize:'12px', color: 'var(--тихий-текст)'}}>
                              {moment(review.Date).format('DD-MM-YYYY')}
                            </span>
                          </span>
                        </List.Item>
                      ))}
                    </List>
                  </div>
              }
            </Popup>
            {!mainPage.cooks.length
              ? <Result
                style={{width: '100%'}}
                icon={<ClockCircleOutline />}
                status='success'
                title='Упс'
                description={`Сегодня на ${userStore.currentOrganizaion?.Name} никто не готовит((`}
              />
              : null
            }
            {mainPage.cooks.map((cook) => 
                <Space 
                  style={{ '--gap': '3px', width: '33%', margin: '0 0.25rem' }}
                  direction="vertical" 
                  justify="center" 
                  align="center" 
                  key={cook.UserId}
                  onClick={() => mainPage.watchCook(cook)}
                >
                  <Avatar 
                    src={config.apiURL + '/api/v2/image/Cook?vcode=' + cook.UserId} 
                    style={{
                      width: '70px', 
                      height: '70px', 
                      borderRadius: '35px', 
                      objectFit: 'cover'
                    }}
                  />
                  <span style={{color: 'var(--громкий-текст)', fontSize: '18px'}}>{cook.FirstName}</span>
                  <Ellipsis 
                    content={cook.NameWork} 
                    style={{
                      color: 'var(--тихий-текст)', 
                      fontSize: '12px',
                    }}
                  />
                  <Space align="center" style={{'--gap': '3px'}}>
                    <div style={{fontSize: '20px'}} >{Math.ceil(cook.Rating * 10) / 10}</div>
                    <Rate
                      allowHalf
                      readOnly 
                      count={1}
                      defaultValue={cook.Rating}
                      style={{'--star-size': '10px' }}
                    />
                  </Space>
                </Space>
            )}
          </div>
          <Divider contentPosition="left" style={{fontSize: '22px'}} >Сегодня в гурмаге</Divider>
          <section className='categories'>
            {!allCampaign.length
              ? <Result
                style={{width: '100%'}}
                icon={<ClockCircleOutline />}
                status='success'
                title='Акций нет'
                description={`Сегодня на ${userStore.currentOrganizaion?.Name} акций нет((`}
              />
              : null
            }
            {allCampaign.map((aksya) => { 
              /** ищем детали для этой скидки в скидках на блюда */
              const dishDiscount = dishDiscounts.find((dishDiscount) =>
                dishDiscount.vcode === aksya.VCode
              )

              /** ищем детали для этой скидки в процентных скидках */
              const percentDiscount = percentDiscounts.find((percentDiscount) =>
                percentDiscount.vcode === aksya.VCode
              )

              /** ищем детали для этой скидки в скидках на сеты */
              const setDish = dishSet.find((setDish) =>
                setDish.vcode === aksya.VCode
              )

              let text: Optional<string> = null;
              let dishArr: Undef<CourseItem>[] = []; 

              // должна найтись только одна из трех 
              // если это скидка 
              // на одно блюдо
              if (dishDiscount && !percentDiscount && !setDish) {
                const targetDish = mainPage.getDishByID(dishDiscount.dish)
                if (targetDish?.Name) 
                  text = `Cкидка ${dishDiscount.price}руб на "${targetDish?.Name}"`
                
              }

              // если это процентная скидка
              if (!dishDiscount && percentDiscount && !setDish) {
                const { MaxSum, MinSum, discountPercent, bonusRate } = percentDiscount;
                text = `Cкидка ${discountPercent}% на сумму от ${MinSum} до ${MaxSum} руб`;
                if (bonusRate) text = text + ` + ${bonusRate} бонусных баллов`
              }

              // если это скидка на сет
              if (!dishDiscount && !percentDiscount && setDish) {
                text = `Cкидка на ${aksya.quantity} блюда из списка:`;
                dishArr = setDish.dishes.map((dishDiscount) =>
                  mainPage.getDishByID(dishDiscount.dish)
                )
              }


              return(
                <div 
                  key={aksya.VCode} 
                  id={String(aksya.VCode)} 
                  style={{ 
                    margin: '0 6px 12px 6px',
                    padding: '10px',
                    position: 'relative', 
                    borderRadius: '8px',
                    outline: '1px solid var(--adm-color-border)',
                    background: 'var(--tg-theme-secondary-bg-color)'
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute', 
                      right: 0,
                      top: 0,
                      borderTopRightRadius: '8px',
                      borderBottomLeftRadius: '8px',
                      padding: '0.2rem',
                      background: 'var(--adm-color-warning)',
                      fontSize: '20px',
                      fontWeight: '900',
                      fontStyle: 'italic',
                      color: 'white'
                    }}
                  >
                    <span>Акция</span>
                  </div>
                  <WaterMark
                    content={'Ели-Пели'}
                    fullPage={false}
                    width={70}
                    height={25}
                  />
                  <h1 
                    style={{
                      whiteSpace: 'break-spaces', 
                      textAlign: 'center',
                      fontSize: '24px',
                      fontStyle: 'italic',
                      fontWeight: '900',
                      // @ts-ignore
                      fontSize: '30px',
                      lineHeight: 'normal', 
                      textTransform: 'uppercase',
                      borderBottom: '1px solid var(--громкий-текст)'
                    }}
                  >
                    {aksya.Name.replace(/ *\{[^}]*\} */g, "")}
                  </h1>
                  <p 
                    style={{
                      padding: '0.5rem', 
                      fontSize: '16px',
                      fontStyle: 'italic',
                      fontWeight: '500', 
                      textTransform: 'uppercase',
                    }}
                  >
                    {aksya.Description.replace(/ *\{[^}]*\} */g, "")}
                  </p>
                  <p 
                    style={{
                      padding: '0.5rem', 
                      fontSize: '16px',
                      fontStyle: 'italic',
                      fontWeight: '500', 
                      textTransform: 'uppercase',
                      marginBottom:'5px'
                    }}
                  >
                    {text}
                  </p>
                  {!dishArr.length 
                    ? null
                    : <div className="courses_list">
                      {dishArr.map((course, index) =>
                        !course
                          ? null
                          : <div
                            className="course_item"
                            key={`${aksya.Name}-${course.Name}-${index}`}
                            style={{background: 'var(--tg-theme-bg-color)'}}
                          >
                            <img
                              src={`${config.apiURL}/api/v2/image/Material?vcode=${course.VCode}&compression=true`}
                              onError={replaceImgSrc(GurmagLogo)}
                              onClick={() => watchCourse(course)}
                            />
                            <div className='item_bady'>
                              <h5 
                                className='title' 
                                onClick={() => watchCourse(course)}
                              >
                                {course.Name}
                              </h5>
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
                  }
                </div>
              )
            })}

          </section>
          <Divider contentPosition="left" style={{fontSize: '22px'}} >Популярные блюда</Divider>
          <section className='categories'>
            <div key='популярное' id='популярное'>
              <div className="courses_list">

                {mainPage.categories[0]?.CourseList?.map((course, index) => 
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
                      <span style={{ color: 'var(--тихий-текст)' }}>★</span>
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
          </section>
          
          <Footer content='@ 2023 Gurmag All rights reserved'></Footer>
          <div style={{height: '50px', width: '100%'}}></div> 
        </>
        : preloader()
      }
    </Page>
  )
})


const skeletonStyle: React.CSSProperties = {
  width: 'calc(100% - 1rem)', 
  height: '180px', 
  margin: '0.5rem', 
  borderRadius: '8px', 
}

const preloader = () => [
  <Skeleton key={1} animated style={skeletonStyle} />,
  <Skeleton.Title key={2} style={{margin: '1rem'}} />,
  <section key={3} className='categories'>
    <div>
      <div className="courses_list">
        {new Array(2).fill(null).map((_, index) => 
          <div className="course_item" key={index}>
            <Skeleton style={{width: '100%'}} />
            <div className='item_bady'>
              <Skeleton.Title />
              <Skeleton.Paragraph />
              <Skeleton />
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
]

const lightcolors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']
const darkcolors = ['#4B2828', '#4B3928', '#484B28', '#2D4B28', '#284B41', '#28494B', '#28304B', '#46284B', '#4B2837']

