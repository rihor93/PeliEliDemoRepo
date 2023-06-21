import { useNavigate } from 'react-router-dom';
import './CartOverlay.css';

export const CartOverlay: React.FC<{
  count: number
}> = ({ count }) => {
  const navigate = useNavigate();
  return (
    <div className='cartOverlay' onClick={() => navigate('/cart')}>
      <img
        src="./cart.svg"
      />
      <span>{count}</span>
    </div>
  )
}