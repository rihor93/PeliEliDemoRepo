import { Image, Skeleton } from "antd-mobile";
import { observer } from "mobx-react-lite";
import { GurmagLogo, LightMinus, DarkMinus, LightPlus, DarkPlus } from "../../../../assets";
import { config } from "../../../configuration";
import { replaceImgSrc } from "../../../helpers";
import { useStore, useTheme } from "../../../hooks";
import { Optional, Undef } from "../../../types";

const CartItem: React.FC<{
  courseInCart: CouseInCart,
  add: () => void,
  remove: () => void,
  campaignAllInfo: Undef<AllCampaignUser>,
  text: Optional<string>
}> = observer(({ courseInCart, add, remove, ...rest }) => {
  const { session } = useStore()
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const { campaignAllInfo, text } = rest


  const ImagePreloader = () =>
    <Skeleton animated style={{ width: '160px', height: '160px', }} />

  const ImageFallback = () =>
    <img src={GurmagLogo} style={{ objectFit: 'cover', width: '160px', height: '160px' }} />

  return (
    <div className='cartItem'>
      <div style={{ width: '160px', height: '160px' }}>
        <Image
          src={config.apiURL
            + '/api/v2/image/Material?vcode='
            + courseInCart.couse.VCode
            + '&compression=true&random='
            + session
          }
          placeholder={<ImagePreloader />}
          fallback={<ImageFallback />}
          alt={courseInCart.couse.Name}
          fit='cover'
          style={{
            objectFit: 'cover',
            "--width": '160px',
            "--height": '160px',
            display: 'flex'
          }}
        />
      </div>

      <div className='cartItemBody'>
        <div>
          <span>{courseInCart.couse.Name}</span>
        </div>
        {!campaignAllInfo
          ? null
          : <span style={{ color: 'var(--gurmag-accent-color)' }}>
            {`Акция - ${campaignAllInfo.Name.replace(/ *\{[^}]*\} */g, "")}`}
          </span>
        }
        <span style={{ color: 'var(--gurmag-accent-color)' }}>{text}</span>

        <div className="row">
          {courseInCart.priceWithDiscount >= courseInCart.couse.Price * courseInCart.quantity
            ? null
            : <s>{`${Math.ceil((courseInCart.couse.Price * courseInCart.quantity) * 100) / 100} руб.`}</s>
          }
          <div className="cout">
            <img
              alt="Убавить"
              className="minus"
              src={isDarkMode ? LightMinus : DarkMinus}
              onClick={remove}
            />
            <span className="count">{courseInCart.quantity}</span>
            <img
              alt="Добавить"
              className="plus"
              src={isDarkMode ? LightPlus : DarkPlus}
              onClick={add}
            />
          </div>
          <h5>{`${Math.ceil(courseInCart.priceWithDiscount * 10) / 10} ₽`}</h5>
        </div>
        {courseInCart.couse.NoResidue
          ? null
          : courseInCart.couse.EndingOcResidue < courseInCart.quantity
            ? <div
              style={{
                position: 'absolute',
                right: '0px',
                bottom: '0px',
                borderBottomRightRadius: '8px',
                borderTopLeftRadius: '8px',
                padding: '0.1rem',
                background: 'var(--adm-color-warning)',
                fontSize: '14px',
                fontWeight: '700',
                color: 'white',

              }}
            >
              <p>{`сегодня осталось ${courseInCart.couse.EndingOcResidue}`}</p>
            </div>
            : null
        }

      </div>
    </div>
  )
}
)
export default CartItem;