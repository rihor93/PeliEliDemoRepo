import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BackDark, BackLight } from '../../../assets';
import { useTheme } from '../../hooks';
import { Modals } from '../../pages/MenuPage/modals';
import { Optional } from '../../types';
import { LoaderFullscreen } from '../Loader/Loader';
import './index.css';

const Screen = ({ children }: WithChildren) => {
  return (
    <main className='screen'>
      {children}
    </main>
  )
}

interface SpinnerProp { rotate: boolean }
const Spinner = ({ rotate }: SpinnerProp) => <LoaderFullscreen isLoad={rotate} />

interface HeaderProp {
  children: React.ReactNode & string,
  fixed?: boolean,
  backButton?: boolean,
  Icon?: React.ReactNode
}
const Header = ({ children, fixed, backButton, Icon }: HeaderProp) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  return (
    <section className={`screen_header ${fixed ? 'screen_header__fixed' : 'screen_header__static'}`}>
      {!backButton
        ? null
        : <img
          src={isDarkMode ? BackLight : BackDark}
          alt="Назад"
          onClick={goBack}
        />
      }
      {!Icon ? null : Icon}
      <h3>{children}</h3>
    </section>
  )
}

interface CourseModalProps { selectedCourse: Optional<CourseItem> }
const CourseModal = ({ selectedCourse }: CourseModalProps) =>
  selectedCourse && <Modals.course course={selectedCourse} />


Screen.Header = Header
Screen.CourseModal = CourseModal
// Screen.Body = Body
Screen.Spinner = Spinner


export default Screen;