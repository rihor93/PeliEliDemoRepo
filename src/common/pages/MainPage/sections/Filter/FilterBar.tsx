import './FilterBar.css';
export const Filter: React.FC = () => {
  return(
    <section className='filter page_filter'>
      <ul className="filter_list">
        <li className="filter_item">Комбо</li>
        <li className="filter_item">Пицца</li>
        <li className="filter_item">Закуски</li>
        <li className="filter_item">Кусочки</li>
        <li className="filter_item">Десерты</li>
        <li className="filter_item">Напитки</li>
        <li className="filter_item">Бар</li>
        <li className="filter_item">Прочие</li>
      </ul>
    </section>
  )
}