import { Footer, Skeleton } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../../components/layout/Page';
import { logger } from '../../features';
import { useStore } from '../../hooks';
import './MenuPage.css';
import { ItemModal } from './modals/ItemModal';
import { Sections } from './sections';

export const MenuPage: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { selectedCourse, state, categories } = mainPage; 
  
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
  // return (
  //   <Страничка>
  //     <LoaderFullscreen isLoad={isLoading} />
  //     {selectedCourse &&
  //       <Modals.course course={selectedCourse} />
  //     }
  //     <Sections.header />
  //     <Sections.filter />
  //     <Sections.categories />
  //     <Sections.footer />
  //   </Страничка>
  // )
  return state === 'COMPLETED'
    ? <Page>
        {selectedCourse &&
          <ItemModal course={selectedCourse} />
        }
        <div style={{height: '55px'}} />
        <Sections.filter />
        <Sections.categories />
        <Footer content='@ 2023 Gurmag All rights reserved'></Footer>
        <div style={{height: '55px'}} />
      </Page>
    : <Page>
      <Skeleton animated style={skeletonStyle} />
      <Skeleton.Title style={{margin: '1rem'}} />
      <section className='categories'>
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
    </Page>
})


const skeletonStyle: React.CSSProperties = {
  width: 'calc(100% - 1rem)', 
  height: '180px', 
  margin: '0.5rem', 
  borderRadius: '8px', 
}