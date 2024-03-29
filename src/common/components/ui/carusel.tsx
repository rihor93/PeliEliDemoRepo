import { Image, Skeleton, Swiper } from "antd-mobile";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { gurmag_big } from "../../../assets";
import { config } from "../../configuration";
import { useStore } from "../../hooks";



export const Carusel = observer(() => {
  const { actionsPage, userStore, session } = useStore();
  const { allCampaign } = userStore.userState

  const [
    brokenCamps, 
    setBrokenCamps
  ] = useState<AllCampaignUser[]>([])

  const campaigns = useMemo(function() {
    return allCampaign.filter(campaign => 
      !brokenCamps.find(bC => bC.VCode === campaign.VCode)
    )
  }, [allCampaign.length, brokenCamps.length])

  /**
   * просто прячем глючные акции без картинки
   * @param campaign 
   */
  function hideBrokenCampaign(brokenCampaign: AllCampaignUser) {
    setBrokenCamps([...brokenCamps, brokenCampaign])
  }

  const swiperStyle = {
    borderRadius: '8px', 
    margin: '0.5rem',
    width: 'calc(100% - 1rem)',
    height: '210px' 
  }
  return (
    <Swiper loop autoplay style={swiperStyle}>
      {userStore.userLoad === 'COMPLETED' 
        ? campaigns.map((campaign, index) => 
          <Swiper.Item key={index}>
            <Image 
              src={config.apiURL 
                + '/api/v2/image/Disount?vcode=' 
                + campaign.VCode 
                + '&random=' 
                + session
              } 
              onClick={() => actionsPage.watchAction(campaign)} 
              placeholder={<ImagePreloader />}
              fallback={<ImageFallback watchAction={() => actionsPage.watchAction(campaign)} />}
              alt={campaign.Name} 
              fit='contain'
              onError={() => hideBrokenCampaign(campaign)}
              style={{
                objectFit: 'contain',
                "--width": '100%',  
                "--height": '210px',
                borderRadius: '8px',
                display: 'flex', 
              }}
            />
          </Swiper.Item>
        )
        : <Swiper.Item>
          <ImagePreloader />
        </Swiper.Item>
      }
    </Swiper>
  )
})

const ImagePreloader = () => 
  <Skeleton animated style={{ width: '100%', height: '210px', }} />

const ImageFallback = (props: any) =>
  <img src={gurmag_big} onClick={props?.watchAction} style={{objectFit: 'cover', width: '100%', height: 'auto' }}/>