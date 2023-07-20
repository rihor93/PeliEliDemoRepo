import { gurmag_big } from "../../../../../assets";
import { Carousel } from "../../../../components";
import './Actions.css';

export const Actions: React.FC = () => {
  return (
    <section className='page_carusel'>
      <Carousel>
        <img src={gurmag_big}/>
        <img src={gurmag_big}/>
        <img src={gurmag_big}/>
        <img src={gurmag_big}/>
      </Carousel>
    </section>
  )
}