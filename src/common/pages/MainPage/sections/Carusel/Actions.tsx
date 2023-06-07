import { Carousel } from "../../../../components";
import './Actions.css';

export const Actions: React.FC = () => {
  return (
    <section className='page_carusel'>
      <Carousel>
        <img src="./gurmag_big.png"/>
        <img src="./gurmag_big.png"/>
        <img src="./gurmag_big.png"/>
        <img src="./gurmag_big.png"/>
      </Carousel>
    </section>
  )
}