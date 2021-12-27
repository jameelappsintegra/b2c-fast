import { toTitleHeadCase } from 'libs/utils/global';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import Link from 'next/link';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { ROUTES } from '/utilities/constants';
export interface INavItem {
  id: number;
  url: string;
  title: string;
}
const Navbar = (props) => {
  const { items, className, type }: any = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const itemsCount = useSelector((state: any) => state?.storeReducer?.itemsCount || 0);
  const activeStep = Number(router?.query?.step);
  const storedBookingDetails = useSelector((state: any) => state?.storeReducer.bookingDetails);
  const isCheckoutValid = useSelector((state: any) => state?.storeReducer.isCheckoutValid);
  const paymentType = useSelector((state: any) => state?.storeReducer?.paymentType || '');
  const currentStep = Number(router?.query?.step);

  const pushToHeaderDataLayerAnalytics = (item) => {
    window?.['dataLayer'].push({
      event: 'headerEvent',
      event_category: 'Header Navigation', // Static
      event_action: 'Click', // Static
      event_label: `${item?.title}`, // Capture the Element user clicked
    });
  };

  const handleNavItemClick = (item: INavItem) => {
    if (isNavigationPossible(item)) {
      console.log(`step=${item.id}`);
      router.push({
        pathname: ROUTES.checkoutJourney,
        query: `step=${item.id}`,
      });
      // dispatch({ type: SET_ACTIVE_STEP, payload: item.id });
      // if (props.setActiveStep) {
      //   props.setActiveStep(item.id || 1);
      // }
    }
  };

  const isNavigationPossible = (item = {} as INavItem) => {
    let isPossible = false;
    console.log(`${isPossible}`);
    const incomingStepperItem = item;
    if (itemsCount) {
      console.log(`${itemsCount}`);
      if (incomingStepperItem.id === 2) {
        isPossible = true;
      }
      if (incomingStepperItem.id === 3) {
        if (storedBookingDetails && storedBookingDetails?.selectedSlot) {
          isPossible = true;
        }
      }
      if (incomingStepperItem.id === 4) {
        if (isCheckoutValid) {
          isPossible = true;
        }
      }
      if (incomingStepperItem.id === 5) {
        if (paymentType && paymentType !== '') {
          isPossible = true;
        }
      }
      if (incomingStepperItem.id === 1) {
        isPossible = true;
      }
    }

    return isPossible;
  };
  const list = (items) => {
    if (type === 'stepper') {
      return (
        <ul className="navbar__list">
          <li
            className={`navbar__item navbar__item--stepper  ${classNames({
              current: 1 <= activeStep,
            })}`}
          >
            <span className="navbar__anchor--stepper" onClick={() => handleNavItemClick(items)}>
              {items?.Miscellaneous_Text?.step1_cta_link}
            </span>
          </li>
          <li
            className={`navbar__item navbar__item--stepper  ${classNames({
              current: 2 <= activeStep,
            })}`}
          >
            <span className="navbar__anchor--stepper" onClick={() => handleNavItemClick(items)}>
              {items?.Miscellaneous_Text?.step2_cta_link}
            </span>
          </li>
          <li
            className={`navbar__item navbar__item--stepper  ${classNames({
              current: 3 <= activeStep,
            })}`}
          >
            <span className="navbar__anchor--stepper" onClick={() => handleNavItemClick(items)}>
              {items?.Miscellaneous_Text?.step3_cta_link}
            </span>
          </li>
          <li
            className={`navbar__item navbar__item--stepper  ${classNames({
              current: 4 <= activeStep,
            })}`}
          >
            <span className="navbar__anchor--stepper" onClick={() => handleNavItemClick(items)}>
              {items?.Miscellaneous_Text?.step4_cta_link}
            </span>
          </li>
          <li
            className={`navbar__item navbar__item--stepper  ${classNames({
              current: 5 <= activeStep,
            })}`}
          >
            <span className="navbar__anchor--stepper" onClick={() => handleNavItemClick(items)}>
              {items?.Miscellaneous_Text?.step5_cta_link}
            </span>
          </li>
        </ul>
      );
    }
    if (type === ROUTES.account.replace('/', '')) {
      return (
        <ul className="navbar__list my__account">
          {items &&
            items.map((item: any, index: any) => (
              <li
                className="navbar__item navbar__item--navigation"
                key={index}
                onClick={() => pushToHeaderDataLayerAnalytics(item)}
              >
                <Link href={item?.path ? `${item?.path}` : '#'}>
                  <span
                    className={`navbar__anchor ${router?.pathname === item?.path ? 'active-navLink' : ''}`}
                  >
                    {toTitleHeadCase(item.title)}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      );
    }
    return (
      <ul className="navbar__list">
        {items &&
          items
            .filter((itemData: any) => {
              return itemData?.visibility?.header === 'show';
            })
            .map((item: any, index: any) => (
              <li
                className="navbar__item navbar__item--navigation"
                key={index}
                onClick={() => pushToHeaderDataLayerAnalytics(item)}
              >
                <Link href={item?.path ? `/${item?.path.split('/')[3]}` : '#'}>
                  <span
                    className={`navbar__anchor ${
                      router?.query?.categoryType === item?.path.split('/')[3] ? 'active-navLink' : ''
                    }`}
                  >
                    {toTitleHeadCase(item.title)}
                  </span>
                </Link>
              </li>
            ))}
      </ul>
    );
  };

  return (
    <Container>
      <nav className={`navbar ${className}`}>{list(items)}</nav>
    </Container>
  );
};

export default Navbar;
