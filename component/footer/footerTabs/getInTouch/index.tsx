import Link from 'next/link';
import { Col } from 'react-bootstrap';

const GetInTouch = () => {
  return (
    <Col xs={12} sm={3}>
      <div className="footerContact b-footer">
        <div className="b-footer__bottomOuter">
          <h6 className="b-footer__title">Get in touch</h6>
          <ul className="b-footer__list">
            <li className="b-footer__item">
              <Link href="tel:80069227">Call 800MYCAR</Link>
            </li>
            {/* <li className="b-footer__item">
              <Link href="/">SMS</Link>
            </li> */}
            <li className="b-footer__item">
              <Link href="mailto:hello@autocenters.com">hello@autocenters.com</Link>
            </li>
          </ul>
        </div>
      </div>
    </Col>
  );
};

export default GetInTouch;
