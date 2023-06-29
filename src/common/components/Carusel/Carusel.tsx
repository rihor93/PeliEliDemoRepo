import './Carusel.css';
import React from 'react';

export const Carousel: React.FC<{
  children: Array<React.ReactNode>
}> = ({ children }) => {

  const [
    currentIndex,
    setCurrentIndex
  ] = React.useState(0)

  const [
    length,
    setLength
  ] = React.useState(children.length)

  React.useEffect(() => {
    setLength(children.length)
  }, [children]);

  const next = () => {
    if (currentIndex < (length - 1)) {
      setCurrentIndex(prevState => prevState + 1)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevState => prevState - 1)
    }
  }
  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {
          currentIndex > 0 &&
          <button onClick={prev} className="left-arrow">
            <img
              src='./Vector 6.png' 
              alt='next'
            />
          </button>
        }
        <div className="carousel-content-wrapper">
          <div
            className="carousel-content"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {children}
          </div>
        </div>
        {
          currentIndex < (length - 1) &&
          <button onClick={next} className="right-arrow">
            <img
              src='./Vector 7.png' 
              alt='next'
            />
          </button>
        }
      </div>
    </div>
  )
}