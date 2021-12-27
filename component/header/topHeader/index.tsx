import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col } from 'react-bootstrap';
import { faUser, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { BASE_CMS_ENDPOINT, ORDERS_ENDPOINT } from '/config/config';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsAuthenticated } from '@azure/msal-react';
import { afterPageViewDL, imgRefactorURI } from '/utilities/utils';
import DropDownMenu from '../dropDown';
import {
  CHECKOUT_JOURNEY,
  ORDERS_CONTENT,
  SET_ACTIVE_STEP,
  SET_BOOKING_DETAILS,
  SET_IS_CHECKOUT_VALID,
} from '/store/actions/types';
import Link from 'next/link';
import { ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import { commonFetch } from '/store/actions/thunk';
import { toggleBilingual } from 'libs/utils/global';
import { useRouter } from 'next/router';

const TopHeader = ({ items }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isAuthenticated = useIsAuthenticated();
  const pushToHeaderCartDL = () => {
    // console.log('DL Login header');
    window?.['dataLayer'].push({
      event: 'headerEvent',
      event_category: 'Header Navigation', // Static
      event_action: 'Click', // Static
      event_label: 'Shopping cart', // Capture the Element user clicked
    });
  };
  const pushToHeaderLoginDL = () => {
    window?.['dataLayer'].push({
      event: 'headerEvent',
      event_category: 'Header Navigation', // Static
      event_action: 'Click', // Static
      event_label: 'My account', // Capture the Element user clicked
    });
  };

  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const [itemscount, setItemscount] = useState(Number);
  const getOrder = useSelector((state: any) => state?.storeReducer?.getOrder);
  const activeStep = 1;
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  let res;
  const nodeEnv = process.env.NODE_ENV === 'development' ? 'staging' : 'live';

  useEffect(() => {
    if (isAuthenticated) {
      console.warn(checkCustomer, 'checkCustomer');
      res = {
        login: true,
        environment: nodeEnv,
        uniqueId: checkCustomer?.customerInformation?.customerCode,
      };
    } else {
      res = {
        login: false,
        environment: nodeEnv,
        uniqueId: '',
      };
    }
  }, []);

  useEffect(() => {
    afterPageViewDL(res, router);
  }, []);

  useEffect(() => {
    if (ordersContent) {
      const ordersLength = ordersContent?.find((res: any) => res?.status === ORDER_STATUS_DRAFT);
      setItemscount(ordersLength?.items?.length);
    }
  }, [ordersContent]);
  let productFromPDPPage: any = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null;
  useEffect(() => {
    if (!isAuthenticated && productFromPDPPage) {
      productFromPDPPage = productFromPDPPage ? JSON.parse(productFromPDPPage) : {};
      setItemscount(productFromPDPPage?.length);
    } else {
      setItemscount(0);
    }
  }, [productFromPDPPage]);
  useEffect(() => {
    if (checkCustomer) {
      dispatch(
        commonFetch({
          URL: ORDERS_ENDPOINT(checkCustomer?.customerInformation?.customerCode),
          type: ORDERS_CONTENT,
          method: 'GET',
        }),
      );
    }
  }, [checkCustomer]);

  const firstTab = () => {
    dispatch({ type: SET_ACTIVE_STEP, payload: 1 });
    dispatch({
      type: SET_BOOKING_DETAILS,
      payload: {},
    });
    dispatch({
      type: SET_IS_CHECKOUT_VALID,
      payload: false,
    });
    dispatch({
      type: CHECKOUT_JOURNEY,
      payload: {
        type: 'paymentType',
        paymentType: '',
      },
    });
  };

  return (
    <div className="topHeader">
      <Container>
        <Row>
          <Col xs={12} sm={6}>
            <div className="topHeader__logoOuter">
              {items && (
                <Link href="/">
                  <img src={imgRefactorURI(items?.Brand_logo)} alt="Logo" />
                </Link>
              )}
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <ul className="topHeader__iconList">
              {/* <li className="noHover">
                <Link href="#">
                  <a onClick={(e) => toggleBilingual(e, router)}>{router.locale === 'ar' ? 'en' : 'عربي'}</a>
                </Link>
              </li> */}
              <li onClick={firstTab}>
                <Link href={`/checkoutJourney?step=${activeStep}`}>
                  <a
                    onClick={() => {
                      pushToHeaderCartDL();
                    }}
                  >
                    {itemscount > 0 && <span className="basketCount">{itemscount}</span>}
                    <span>
                      <FontAwesomeIcon icon={faShoppingCart} style={{ width: '16px' }} color="#009fe3" />
                    </span>
                  </a>
                </Link>
              </li>
              {isAuthenticated ? (
                <li className="accountAvtar" onClick={() => pushToHeaderLoginDL()}>
                  <DropDownMenu customName={checkCustomer?.customerInformation?.customerFirstName} />
                </li>
              ) : (
                <li onClick={() => pushToHeaderLoginDL()}>
                  <Link href="/login">
                    <a>
                      <FontAwesomeIcon icon={faUser} style={{ width: '16px' }} color="#009fe3" />
                    </a>
                  </Link>
                </li>
              )}

              {/* <li>
                <Link href="#">
                  <a>
                    <FontAwesomeIcon icon={faSearch} />
                  </a>
                </Link>
              </li> */}
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopHeader;
