import { Footer } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useParams } from 'react-router-dom';
import { LoaderFullscreen } from '../../components';
import Страничка, { Page } from '../../components/layout/Page';
import { logger } from '../../features';
import { useStore } from '../../hooks';
import './MenuPage.css';
import { ItemModal } from './modals/ItemModal';
import { Sections } from './sections';

export const MenuPage: React.FC = observer(() => {
  const { mainPage } = useStore();
  const { selectedCourse, isLoading, categories } = mainPage; 
  
  const params = useParams<{
    catVCode: string,
    VCode: string,
  }>();
  
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
  return(
    <Page>
      {selectedCourse &&
        <ItemModal course={selectedCourse} />
      }
      <div style={{height: '55px'}} />
      <Sections.filter />
      <Sections.categories />
      <Footer content='@ 2023 Gurmag All rights reserved'></Footer>
      <div style={{height: '55px'}} />
    </Page>
  )
})

