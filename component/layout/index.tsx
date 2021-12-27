import Header from '../header';
import Footer from '../footer';
import { useEffect, useState } from 'react';

function Layout({ children }) {
  const [fixedHeader, setFixedHeader] = useState(false);
  const [removeheader, setRemoveheader] = useState(false);

  useEffect(() => {
    let prevScroll = window.scrollY || document.documentElement.scrollTop;
    let curScroll;
    let direction = 0;
    let prevDirection = 0;
    const checkSCroll = () => {
      curScroll = window.scrollY || document.documentElement.scrollTop;
      if (curScroll > prevScroll) {
        direction = 2;
      } else if (curScroll === 1) {
        direction = 0;
      } else {
        direction = 1;
      }
      if (direction !== prevDirection) {
        toggleHeader(direction, curScroll);
      }
      prevScroll = curScroll;
    };
    const toggleHeader = function (direction, curScroll) {
      if (direction === 2 && curScroll > 0) {
        // setFixedHeader(false);
        // replace 52 with the height of your header in px
        // console.log(direction, "direction", curScroll, "curScroll");
        // header.classList.add("hide");
        prevDirection = direction;
      } else if (direction === 0) {
        setRemoveheader(true);
      } else if (direction === 1) {
        setRemoveheader(false);
        // setFixedHeader(true);
        prevDirection = direction;
      }
    };
    window.addEventListener('scroll', checkSCroll);
  }, []);
  return (
    <div className="main">
      <Header fixedHeader={fixedHeader} />
      {children}
      <Footer />
    </div>
  );
}
export default Layout;
