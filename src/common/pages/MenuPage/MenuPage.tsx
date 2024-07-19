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
      {actionsPage.selectedAction && <WatchCampaignModal campaign={actionsPage.selectedAction} />}
      <Carusel />
      <Sections.filter />
      <Sections.categories />
      <Footer content='@ 2024 Gurmag All rights reserved'></Footer>
      <div style={{height: '55px'}} />
    </Page>
  )
})