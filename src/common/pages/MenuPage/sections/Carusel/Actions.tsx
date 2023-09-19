import { useNavigate } from "react-router-dom";
import { gurmag_big } from "../../../../../assets";
import { Carousel } from "../../../../components";
import { config } from "../../../../configuration";
import { replaceImgSrc } from "../../../../helpers";
import { useStore } from "../../../../hooks";
import './Actions.css';
import * as uuid from 'uuid'

export const Actions: React.FC = () => {
  const { userStore, actionsPage } = useStore();
  const navigate = useNavigate()
  return (
    <section className='page_carusel'>
      <Carousel>
        {userStore.userState.allCampaign.map((campaign) =>
          <img 
            key={campaign.VCode}
            src={config.apiURL + '/api/v2/image/Disount?vcode=' + campaign.VCode  + '&random=' + uuid.v4()}
            onError={replaceImgSrc(gurmag_big)}
            alt={`${campaign.Name} - ${campaign.Description}`}
            onClick={() => {
              actionsPage.watchAction(campaign)
              navigate('/actions/' + campaign.VCode)
            }}
          />
        )}
      </Carousel>
    </section>
  )
}