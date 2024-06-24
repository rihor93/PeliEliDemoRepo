import { Image, WaterMark } from 'antd-mobile'
import { Skeleton } from 'antd-mobile/es/components/skeleton/skeleton'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Iphone15Banner } from '../../../assets'
import { useStore } from '../../hooks'
// @ts-ignore
import Iphone15Logo from './iphone15.png'

// export const TempBanner: FC = observer(() => {
//   const { iPhone15Lottery } = useStore()
//   const placeholder = <Skeleton style={{ height: '85.7px', width: '100%' }}/>
//   return (
//     <Image 
//       onClick={() => iPhone15Lottery.watchLotteryPopup.open()}
//       src={Iphone15Banner} 
//       placeholder={placeholder}
//       fallback={placeholder}
//     />
//   )
//   return(
//     <div
//       onClick={() => iPhone15Lottery.watchLotteryPopup.open()}
//       style={{ 
//         cursor: 'pointer', 
//         borderRadius: 8, 
//         padding: '2rem', 
//         width: '100%', 
//         background: 'var(--tg-theme-secondary-bg-color)',
//         position: 'relative', 
//         borderStyle: "dashed" ,
//         borderImageSource:"url('frame.png')" ,
//         borderImageWidth: 'auto',
//         borderImageSlice: '15', 
//         borderImageRepeat: 'round', 
//         overflow: 'hidden'
//       }}
//     >
//       <img src={Iphone15Logo} style={{ height: 100, width: 'auto', position: 'absolute', top: 0, left: '-1.5rem' }} />
//       <WaterMark zIndex={1} content={'Gurmag'} width={50} height={20} gapY={10} fullPage={false} />
//       <p 
//         style={{ 
//           textAlign: 'center', 
//           fontSize: 20, 
//           fontStyle: 'italic', 
//           fontWeight: 500, 
//           marginLeft: '7rem'
//         }}
//       >
//         Розыгрыш iPhone15!!!
//       </p>
//       <p style={{ textAlign: 'center', marginLeft: '7rem' }}>(нажмите, чтобы узнать подробнее)</p>
//     </div>
//   )
// })