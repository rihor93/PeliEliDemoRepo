import { Footer } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../../components/layout/Page';
import { logger } from '../../features';
import { useStore } from '../../hooks';
import WatchCampaignModal from '../ActionsPage/modals/WatchCampaignModal';
import './MenuPage.css';
import { ItemModal } from './modals/ItemModal';
import { Sections } from './sections';
import { Carusel, SelectLocationPopup } from '../../components';

export const MenuPage: React.FC = observer(() => {
  const { mainPage, userStore, actionsPage, auth } = useStore();
  const { selectedCourse, categories } = mainPage; 
  
  const params = useParams<{
    catVCode: string,
    VCode: string,
  }>()
  
  React.useEffect(() => {
    if(params.VCode && params.catVCode) {
      const targetDish = mainPage.getDishByID(params.VCode)
      if(targetDish) {
        mainPage.watchCourse(targetDish)
      } else {
        logger.error(`Блюда с VCode ${params.VCode} не нашлось!!!`, 'WatchCampaignModal')
      }
    }
  }, [categories.length])
  return (
    <Page>
      {selectedCourse &&
        <ItemModal course={selectedCourse} />
      }
      {userStore.orgstate === 'COMPLETED'
        && userStore.userLoad === 'COMPLETED' 
        && userStore.needAskAdress 
        ? <SelectLocationPopup />
        : null
      }
      {auth.isFailed
        ? <div style={{height: '58px'}} />
        : null 
      }
      <div style={{height: '46px'}} />
      {/* <section className='categories'> 
        <OtziviPopup />
        {dishSearcher.isSearching 
          ? (
            <div key='результаты-поиска' id='searching_result'>
              {dishSearcher.result.length 
                ? (
                  <Divider contentPosition='left' style={{fontSize: '22px'}}>
                      {`Найдено ${dishSearcher.result.length} блюд`}
                  </Divider>
                ) : (
                  <Result
                    icon={<SmileOutline />}
                    status='success'
                    title='Сегодня такого блюда в меню нет((('
                    description='В ближающее время блюдо появится в меню'
                  />
                )
              }
              {
                dishSearcher.result.length
                  ? (
                    <div className="courses_list">
                      {dishSearcher.result.map((course, index) =>
                        <CourseItemComponent 
                          key={`popular-${course.Name}-${index}`}
                          course={course}
                        />
                      )}
                  </div>
                  ) : null
              }
              
            </div>
          ) : (
            <CapsuleTabs defaultActiveKey={categories[0].VCode + '-' + 0}>
              {categories.map((category, index) => 
                <CapsuleTabs.Tab 
                  title={category.Name} 
                  key={category.VCode + '-' + index}
                >
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
                </CapsuleTabs.Tab>
              )}
            </CapsuleTabs>
          )
        }
      </section> */}
      {actionsPage.selectedAction && <WatchCampaignModal campaign={actionsPage.selectedAction} />}
      <Carusel />
      <Sections.filter />
      <Sections.categories />
      <Footer content='@ 2024 Gurmag All rights reserved'></Footer>
      <div style={{height: '55px'}} />
    </Page>
  )
})