import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import { Container } from 'react-bootstrap';
import CardOrder from '../partials/cardOrder';
import CardBooking from '../partials/cardBooking';
import CardBilling from '../partials/cardBilling';
import SectionHero from '/components/common/sectionHero';
import Section from 'components/common/section';
import SectionHelpContacts from '/components/templates/sectionHelpContacts';
import { IBookingDetailsProps } from '../booking/interfaces';
import { compareValues } from 'libs/utils/global';
import { ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import { ORDERS_CONTENT } from '/store/actions/types';
import { notification, NOTIFICATION_TYPE } from '/utilities/utils';
import SectionPaymentOptions from '/components/templates/sectionPaymentOptions';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ROUTES } from '/utilities/constants';
import { GET_LOCATION_ENDPOINT, ORDERS_ENDPOINT, PAYMENT_REQUEST_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';

const Payment = (props) => {
  const { nextTab, step4 } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const [bookingDetails, setBookingDetails] = useState<IBookingDetailsProps>({} as IBookingDetailsProps);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const [draftedOrders, setDraftedOrders] = useState<any[]>([]);

  const getOrder = useSelector((state: any) => state?.storeReducer?.getOrder);
  const [orderRef, setOrderRef] = useState('');
  const storedPreferencesDetails = useSelector((state: any) => state?.storeReducer?.preferencesDetails || {});
  const [communicationCheckboxs, setCommunicationCheckboxs] = useState({
    checkboxTerms: false,
    checkboxPrivacy: false,
    checkboxEmail: storedPreferencesDetails.checkboxEmail,
    checkboxSms: storedPreferencesDetails.checkboxSms,
  });
  const getSlotContent = useSelector((state: any) => state?.storeReducer?.getSlotContent);

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
    setOrderRef(getOrder?.id);
  }, [checkCustomer]);

  useEffect(() => {
    const bestSubSlot =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('BestSubSlot') !== null
          ? JSON.parse(sessionStorage.getItem('BestSubSlot') || '')
          : {}
        : null;
    const bestSubSlotData = Object.keys(getSlotContent).length > 0 ? getSlotContent : bestSubSlot;
    dispatch(
      commonFetch({
        URL: GET_LOCATION_ENDPOINT(bestSubSlotData?.locationCode),
        type: 'CHECK_LOCATION',
        method: 'GET',
      }),
    );
  }, []);

  useEffect(() => {
    if (ordersContent) {
      const ordersDrafted = ordersContent
        ?.filter((res: any) => res?.status === ORDER_STATUS_DRAFT)
        ?.sort(compareValues('id', 'desc'));
      setDraftedOrders(ordersDrafted);
    }
  }, [ordersContent]);

  useEffect(() => {
    const paramValue = router.query['?id'];

    if (paramValue) {
      // setIsLoading(true);
      const headers: any = {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      axios
        .put(
          `${PAYMENT_REQUEST_ENDPOINT}/${paramValue}`,
          // tslint:disable-next-line: ter-indent
          {
            // tslint:disable-next-line: ter-indent
            status: 'FINALIZE',
            // tslint:disable-next-line: ter-indent
          },
          { headers },
        )
        .then(({ data }) => {
          // setIsLoading(false);
          if (data?.paymentRequestStatus === 'APPROVED') {
            router.push({
              pathname: ROUTES.checkoutJourney,
              query: `step=5&orderId=${data?.requestId}`,
            });
          } else {
            if (data?.Finalization?.ResponseDescription) {
              notification(NOTIFICATION_TYPE.error, `${data?.Finalization?.ResponseDescription}`);
            } else {
              notification(NOTIFICATION_TYPE.error, 'Something went wrong please try again later');
            }
          }
        });
    }
    // pushToDataLayerAnalyticsStepDisplayed();
  }, [router]);

  return (
    <>
      <Head>
        <title>Payment - Al-Futtaim</title>
      </Head>
      <SectionHero
        className="heroPayment"
        title={step4?.name || 'Payment'}
        preTitle={{
          children: (
            <span>
              <FontAwesomeIcon icon={faLock} size="xs" />
              {step4?.Miscellaneous_Text?.secure_and_encrypt}
            </span>
          ),
        }}
      >
        <div className="card-group">
          <CardOrder
            header={{
              children: <span>{step4?.Miscellaneous_Text?.order}</span>,
              styles: {
                color: 'var(--color-white)',
                backgroundColor: 'var(--color-azure)',
              },
            }}
            footerText={step4?.Miscellaneous_Text?.total_inc_vat || 'Total'}
          />
          <CardBooking step4={step4} getSlotContent={getSlotContent} />
        </div>
      </SectionHero>
      <Section
        titleProps={{
          text: `${step4?.Miscellaneous_Text?.billing_addresds || 'Billing address'}`,
        }}
        styles={{ backgroundColor: 'var(--color-lightest-grey)' }}
      >
        <Container>
          <CardBilling step4={step4} />
        </Container>
      </Section>
      <SectionPaymentOptions location={getSlotContent?.locationCode} step4={step4} />
      <SectionHelpContacts />
    </>
  );
};

export default Payment;
