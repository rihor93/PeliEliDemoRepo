import { CheckOutlined, HomeOutlined, PlusOutlined } from "@ant-design/icons"
import { 
  Toast, 
  Swiper, 
  Divider, 
  Skeleton, 
  Footer, 
  Avatar, 
  Space, 
  Rate, 
  Dropdown, 
  Radio, 
  Popup, 
  Button, 
  Result, 
  Ellipsis, 
  List,
  Tag
} from "antd-mobile"
import { observer } from "mobx-react-lite"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GurmagLogo, gurmag_big } from '../../../assets';
import { Page } from "../../components";
import { config } from '../../configuration';
import { replaceImgSrc } from '../../helpers';
import { useStore } from '../../hooks';
import { ItemModal } from "../MenuPage/modals/ItemModal";
import './MainPage.css';
import { FC } from 'react';
import moment from "moment";
import { ClockCircleOutline } from "antd-mobile-icons";
import * as uuid from 'uuid'
import { CourseItemComponent } from "../MenuPage/sections/Categories";


export const MainPage: FC = observer(() => { 
  const { userStore, actionsPage, mainPage, cartStore } = useStore();

  const { selectedCourse, state, cookstate, watchCourse } = mainPage;

  const { allCampaign } = userStore.userState; 

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
                  onChange={e => setAskedAddr(e as number)}
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
                      userStore.currentOrg = askedAddr;
                      userStore.saveCurrentOrg(askedAddr)
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
                    onChange={e => {
                      userStore.currentOrg = e as number
                      userStore.saveCurrentOrg(e as number)
                    }}
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
                  src={config.apiURL + '/api/v2/image/Disount?vcode=' + campaign.VCode + '&random=' + uuid.v4()} 
                  onError={replaceImgSrc(gurmag_big)} 
                  onClick={() => {
                    actionsPage.watchAction(campaign)
                    navigate('/actions/' + campaign.VCode)
                  }}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
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
                  <Skeleton.Paragraph animated />
                  <Skeleton.Paragraph animated />
                  <Skeleton.Paragraph animated />
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
                      {mainPage.selectedCockReviews[0]?.map((review: CookReviews, index) => {
                        const splitedNum = review.Phone.split('')
                        const last3nums = [...splitedNum].slice(8, 11)
                        // const next2nums = [...splitedNum].slice(6, 8)
                        // const middle2nums = [...splitedNum].slice(4, 6)
                        const first3nums = [...splitedNum].slice(1, 4)
                        const countryCode = [...splitedNum].slice(0, 1)
                        const maskedTel = [...countryCode, '-', first3nums, '-', '**', '-', '**', '-', last3nums]
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
                                <p>{maskedTel}</p>
                                <p>{`★${review.Rating} - ${review.Course}`}</p>
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
            {mainPage.cooks.map(cook => 
              <Cook key={cook.UserId} cook={cook} />
            )}
          </div>
          
          <Divider contentPosition="left" style={{fontSize: '22px'}} >Популярные блюда</Divider>
          <section className='categories'>
            <div key='популярное' id='популярное'>
              <div className="courses_list">
                {mainPage.popular?.map(course => 
                  <CourseItemComponent 
                    course={course} 
                    key={course.VCode}
                  />
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
  <Skeleton.Title key={2} animated style={{margin: '1rem'}} />,
  <section key={3} className='categories'>
    <div>
      <div className="courses_list">
        {new Array(2).fill(null).map((_, index) => 
          <div className="course_item" key={index}>
            <Skeleton style={{width: '100%'}} animated />
            <div className='item_bady'>
              <Skeleton.Title animated />
              <Skeleton.Paragraph animated />
              <Skeleton animated />
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
]


const Cook: FC<{ cook: Cook }> = observer(({ cook }) => {
  const { mainPage } = useStore();
  return(
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
  )
})