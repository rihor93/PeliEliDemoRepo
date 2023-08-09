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
          <h5>{`${courseInCart.priceWithDiscount} ₽`}</h5>
        </div>
      </div>
    </div>
  )
}

export default CartItem;