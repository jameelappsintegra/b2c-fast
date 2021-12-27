import { useRouter } from 'next/router';
import Basket from './basket';
import Booking from './booking';
import Payment from './payment';
import Checkout from './checkout';
import ConfirmOrder from './confirmOrder';
import OrderConfirmed from './orderConfirmed';
import { ROUTES } from '/utilities/constants';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsAuthenticated } from '@azure/msal-react';
import { ORDERS_CONTENT } from '/store/actions/types';
import { ORDERS_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';

export interface CheckoutJourneyProps {}

const CheckoutJourney = () => {
  const [showSlot, setShowSlot] = useState(false);
  const [locValue, setLocValue] = useState();
  const [selectedButton, setSelectedButton] = useState('');
  const [buttonSelected, setButtonSelected] = useState({ index: -1, key: -1 });
  const [slotValue, setSlotValue] = useState<any>([]);
  const [bookSlotFlag, setBookSlotFlag] = useState(false);
  const [minutes, setMinutes] = useState(60);
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();

  const chekoutJourneyContent = useSelector((state: any) => state?.storeReducer?.chekoutJourneyContent);
  useEffect(() => {
    if (isAuthenticated && checkCustomer) {
      dispatch(
        commonFetch({
          URL: ORDERS_ENDPOINT(checkCustomer?.customerInformation?.customerCode),
          type: ORDERS_CONTENT,
          method: 'GET',
        }),
      );
    }
  }, []);

  const router = useRouter();
  const currentStep = Number(router?.query?.step);
  let stepComponent;
  const nextTab = () => {
    router.push({
      pathname: ROUTES.checkoutJourney,
      query: `step=${currentStep + 1}`,
    });
  };

  switch (currentStep) {
    case 1:
      stepComponent = <Basket nextTab={nextTab} step1={chekoutJourneyContent?.Step1} />;
      break;
    case 2:
      stepComponent = (
        <Booking
          nextTab={nextTab}
          showSlot={showSlot}
          setShowSlot={setShowSlot}
          locValue={locValue}
          setLocValue={setLocValue}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
          buttonSelected={buttonSelected}
          setButtonSelected={setButtonSelected}
          slotValue={slotValue}
          setSlotValue={setSlotValue}
          bookSlotFlag={bookSlotFlag}
          setBookSlotFlag={setBookSlotFlag}
          step2={chekoutJourneyContent?.Step2}
        />
      );
      break;
    case 3:
      stepComponent = (
        <Checkout
          nextTab={nextTab}
          minutes={minutes}
          setMinutes={setMinutes}
          step3={chekoutJourneyContent?.Step3}
        />
      );
      break;
    case 4:
      stepComponent = <Payment nextTab={nextTab} step4={chekoutJourneyContent?.Step4} />;
      break;
    case 5:
      stepComponent = <OrderConfirmed />;
      break;
    case 6:
      stepComponent = <ConfirmOrder nextTab={nextTab} />;
      break;
    default:
      stepComponent = <Basket nextTab={nextTab} step1={chekoutJourneyContent?.step1} />;
      break;
  }

  return <div className="checkoutJourney">{stepComponent}</div>;
};

export default CheckoutJourney;
