import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import { PAYMENT_TYPE_GARAGE, PAYMENT_TYPE_ONLINE } from 'libs/utils/constants';
import { getUserVehicleData } from 'libs/utils/storage';
import { scrollToTop, getGlobalEventTrigger } from 'libs/utils/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import notification, { NOTIFICATION_TYPE } from 'libs/utils/notification';
import { MESSAGES } from 'libs/utils/messages';
import CheckboxCustom from 'components/common/form/checkboxCustom';
import Section from 'components/common/section';
import SectionHero from 'components/common/sectionHero';
import { AppButton } from 'components/common/appButton';
import SectionHelpContacts from 'components/templates/sectionHelpContacts';
import CardOrder from '../partials/cardOrder';
import CardBooking from '../partials/cardBooking';
import CardBilling from '../partials/cardBilling';
import CardPayment from '../partials/cardPayment';
import { IBookingDetailsProps } from '../booking/interfaces';
import Loader from 'components/common/loader';
import { CLASSIFICATION_INTENT } from 'libs/utils/gtm';
import { CHECKOUT_JOURNEY, SET_ACTIVE_STEP } from '/store/actions/types';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export interface IAttributeProps {
  name?: string;
  value?: string;
}
export interface IItemProps {
  attributes?: IAttributeProps;
  currency: string;
  discount?: number;
  name: string;
  price: number;
  productId: string;
  quantity: number;
  total?: number;
  unitOfMeasure?: string;
}
const ConfirmOrder = (props) => {
  const { nextTab, step4 } = props;
  const dispatch = useDispatch();
  const [bookingDetails, setBookingDetails] = useState<IBookingDetailsProps>({} as IBookingDetailsProps);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const personalDetails = useSelector(
    (state: any) => state?.storeReducer?.personalDetails?.personalDetails || {},
  );
  const addressDetails = useSelector(
    (state: any) => state?.storeReducer?.addressDetails?.addressDetails || {},
  );
  const storedPreferencesDetails = useSelector(
    (state: any) => state?.storeReducer?.preferencesDetails?.preferencesDetails || {},
  );

  const carFormSelectedData: any = getUserVehicleData();

  const paymentType = useSelector((state: any) =>
    state?.storeReducer?.paymentType ? state?.storeReducer?.paymentType : '',
  );

  const storedBookingDetails = useSelector((state: any) => {
    return state?.storeReducer?.bookingDetails || {};
  });

  const [communicationCheckboxs, setCommunicationCheckboxs] = useState({
    checkboxTerms: false,
    checkboxPrivacy: false,
    checkboxEmail: storedPreferencesDetails.checkboxEmail,
    checkboxSms: storedPreferencesDetails.checkboxSms,
  });

  const orderJson = () => {
    return {
      customerFirstName: personalDetails?.firstName?.formControl?.value || '',
      customerMiddleName: '',
      customerLastName: personalDetails?.lastName?.formControl?.value || '',
      address: [
        {
          customerFirstName: personalDetails?.firstName?.formControl?.value || '',
          customerLastName: personalDetails?.lastName?.formControl?.value || '',
          city: addressDetails?.emirates?.formControl?.value || '',
          streetAddress: addressDetails?.street?.formControl?.value || '',
          addressType: 'BILLING',
          phoneNumber: personalDetails?.phoneNumber?.formControl?.value || '',
        },
      ],
      appointment: {
        slotId: bookingDetails?.selectedSlot?.slotId || null,
        date: bookingDetails?.selectedSlot?.date || '',
        bayId: bookingDetails?.selectedSlot?.bayId || null,
        bayNumber: bookingDetails?.selectedSlot?.bayNumber || null,
        sequence: bookingDetails?.selectedSlot?.sequence || null,
      },
      payment: [
        {
          paymentType,
        },
      ],
      locationId: bookingDetails?.selectedSlot?.locationCode || '',
      title: personalDetails?.title?.formControl?.value || '',
      emails: [
        {
          emailId: personalDetails?.email?.formControl?.value || '',
          emailType: 'primary',
        },
      ],
      make: carFormSelectedData?.make?.label || '',
      makeCode: carFormSelectedData?.make?.value || '',
      communicationPreferences: {
        isSms: communicationCheckboxs.checkboxSms,
        isEmail: communicationCheckboxs.checkboxEmail,
      },
    };
  };

  /**
   * Creates and submits form on the fly
   * @param TransactionID
   * @param PaymentPortal
   */
  const paymentFormSubmission = async (TransactionID: string, PaymentPortal: string) => {
    const transactionAttr = 'TransactionID';
    try {
      setIsLoading(true);
      const form = document.createElement('form');
      form.setAttribute('id', 'paymentForm');
      form.setAttribute('method', 'post');
      form.setAttribute('action', PaymentPortal);

      // Create an input element for TransactionID
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', transactionAttr);
      input.value = TransactionID;
      form.appendChild(input);

      document.getElementsByTagName('body')[0].appendChild(form);
      form.submit();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setCommunicationCheckboxs({
      ...communicationCheckboxs,
      [target.id]: target.checked,
    });
  };

  /**
   * To check if session is valid
   * @returns
   */
  const getCartItems = async () => {
    try {
      const resp: any = [{}];
      //   const resp: any = await CheckoutJourneyService.cart.getCartItems();
      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const placeOrder = async () => {
    dispatch({ type: SET_ACTIVE_STEP, payload: 6 });
    getGlobalEventTrigger(CLASSIFICATION_INTENT);
    getCartItems()
      .then(async (_resp) => {
        const orderJsonData = orderJson();
        try {
          setIsLoading(true);
          //   const resp = await CheckoutJourneyService.order.createOrder(orderJsonData);
          const resp: any = [{}];
          if (paymentType === PAYMENT_TYPE_ONLINE && resp?.data?.TransactionID && resp?.data?.PaymentPortal) {
            paymentFormSubmission(resp?.data?.TransactionID, resp?.data?.PaymentPortal);
            dispatch({ type: SET_ACTIVE_STEP, payload: 1 });
            dispatch({
              type: CHECKOUT_JOURNEY,
              payload: {
                type: 'itemsCount',
                itemsCount: 0,
              },
            });
          }
          if (paymentType === PAYMENT_TYPE_GARAGE && resp?.location && resp?.location !== '') {
            window.location.href = resp.location;
          }
          return;
        } catch (error) {
          console.log('createOrder exception', error);
          return Promise.reject(error);
        } finally {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log('getCartItems', error);
        if (error.hasOwnProperty('data') && typeof error?.data === 'object') {
          checkoutJourneyErrorHandler(error?.data);
        } else {
          notification(NOTIFICATION_TYPE.error, MESSAGES.defaultError);
        }
      });
  };

  /**
   * Redirect to specific checkout journey route/page on exception,
   * Display toast message if availble
   * @param error object should contain messages(array) and state keys
   */
  const checkoutJourneyErrorHandler = (error: any) => {
    if (error && error.hasOwnProperty('messages')) {
      if (error.messages[0]?.message) {
        notification(NOTIFICATION_TYPE.error, error.messages[0]?.message);
      }
    }
    if (error && error.hasOwnProperty('state')) {
      setTimeout(() => redirectToJourneyStepper(error.state), 1000);
    }
  };

  /**
   * Redirect to checkout journey stepper
   * @param step current step. Default = 1 i.e. Basket
   */
  const redirectToJourneyStepper = (step = 1) => {
    dispatch({ type: SET_ACTIVE_STEP, payload: step });
  };
  useEffect(() => {
    scrollToTop();
    if (storedBookingDetails.selectedSlot) {
      setBookingDetails(storedBookingDetails);
    }
    if (storedPreferencesDetails) {
      setCommunicationCheckboxs({
        ...communicationCheckboxs,
        checkboxSms: storedPreferencesDetails.checkboxSms,
        checkboxEmail: storedPreferencesDetails.checkboxEmail,
      });
    }
  }, []);

  return (
    <>
      {isLoading && <Loader color={'var(--color-white)'} loading={isLoading} />}
      <>
        <Head>
          <title>Confirm Order - Al-Futtaim</title>
        </Head>
        <SectionHero
          title="Confirm Order"
          preTitle={{
            children: (
              <span>
                <FontAwesomeIcon icon={faLock} size={'xs'} />
                All transactions are secure and encrypted
              </span>
            ),
          }}
          postTitle={{ children: 'Review and confirm your order' }}
        >
          <Row>
            <Col sm={6}>
              <CardOrder
                header={{
                  children: <span>Order</span>,
                  styles: {
                    color: 'var(--color-white)',
                    backgroundColor: 'var(--color-azure)',
                  },
                }}
              />
            </Col>
            <Col sm={6}>
              <CardBooking />
            </Col>
          </Row>
        </SectionHero>
        <Section
          titleProps={{
            text: 'Payment and billing',
          }}
        >
          <Container>
            <Row className="justify-content-center">
              {/* <Col sm={6}>
                <CardPayment />
              </Col> */}
              <Col sm={6}>
                <CardBilling step4={step4} />
              </Col>
            </Row>
            <Row className="justify-content-center mt-5">
              <AppButton
                text="Confirm"
                variant="filled"
                shape="rounded"
                isLarge
                isCentered
                onClick={() => {
                  placeOrder();
                }}
              />
            </Row>
          </Container>
        </Section>

        <SectionHelpContacts />
      </>
    </>
  );
};

export default ConfirmOrder;
