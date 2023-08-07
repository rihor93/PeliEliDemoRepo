import { gurmag_big } from "../../../../../assets";
import { Carousel } from "../../../../components";
import { config } from "../../../../configuration";
import { replaceImgSrc } from "../../../../helpers";
import { useStore } from "../../../../hooks";
import './Actions.css';

export const Actions: React.FC = () => {
  const { userStore: { userState } } = useStore();
  return (
    <section className='page_carusel'>
      <Carousel>
        {userState.allCampaign.map((campaign) =>
          <img
            src={config.apiURL + '/api/v2/image/Disount?vcode=' + campaign.VCode}
            onError={replaceImgSrc(gurmag_big)}
            alt={`${campaign.Name} - ${campaign.Description}`}
          />
        )}
      </Carousel>
    </section>
  )
}