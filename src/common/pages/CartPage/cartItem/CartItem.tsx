import { CrossLight, CrossDark, GurmagLogo, LightMinus, DarkMinus, LightPlus, DarkPlus } from "../../../../assets";
import { config } from "../../../configuration";
import { replaceImgSrc } from "../../../helpers";
import { useTheme } from "../../../hooks";

const CartItem: React.FC<{
  courseInCart: CouseInCart,
  add: () => void,
  remove: () => void,
}> = ({ courseInCart, add, remove }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const onClose = () => {
    for (let i = 0; i < courseInCart.quantity; i++) {
      remove()
    }
  }
  return (
    <div className='cartItem'>
      <img
        onClick={onClose}
        className='closeButton'
        src={isDarkMode
          ? CrossLight
          : CrossDark
        }
      />
      <img
        src={`${config.apiURL}/api/v2/image/Material?vcode=${courseInCart.couse.VCode}&compression=true`}
        onError={replaceImgSrc(GurmagLogo)}
      />
      <div className='cartItemBody'>
        <div>
          <span>{courseInCart.couse.Name}</span>
        </div>
        <div className="row">
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

export default CartItem;