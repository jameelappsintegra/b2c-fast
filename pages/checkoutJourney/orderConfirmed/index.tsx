import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import SectionHero from 'components/common/sectionHero';
import Section from 'components/common/section';
import SectionHelpContacts from 'components/templates/sectionHelpContacts';
import CardOrder from '../partials/cardOrder';
import CardBilling from '../partials/cardBilling';
import CardBooking from '../partials/cardBooking';
import { scrollToTop } from 'libs/utils/global';
import { ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import { format } from 'date-fns';
import { GET_LOCATION_ENDPOINT, UPDATE_BOOKING_SLOTS_ENDPOINT, UPDATE_ORDER_ENDPOINT } from '/config/config';
import Axios from 'axios';
import moment from 'moment';

const OrderConfirmed = (props) => {
  const { step4 } = props;
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const [orderId, setOrderId] = useState(null);
  let serviceTime;
  useEffect(() => {
    let bestSubSlotData: any = {};
    try {
      bestSubSlotData = JSON.parse(sessionStorage.getItem('BestSubSlot'));
    } catch (e) {
      console.log(e);
    }
    console.log(`bestSubSlotData ${JSON.stringify(bestSubSlotData)}`);

    // start book slot
    const ordersDraftedDb = ordersContent?.find((res: any) => res?.status === ORDER_STATUS_DRAFT);
    if (ordersDraftedDb && ordersDraftedDb.items.length > 0) {
      const orderedId = ordersDraftedDb?.id;
      console.log(`orderedId ${JSON.stringify(ordersDraftedDb)}`);
      setOrderId(orderedId);
      serviceTime = ordersDraftedDb.items?.reduce((acc, ele) => {
        return acc + ele.serviceTime * ele.quantity;
      }, 0);
      console.warn(`serviceTime ${serviceTime}`);

      const dataPut = {
        action: 'Booking',
        capacityRequired: serviceTime,
        orderId: orderedId,
      };
      Axios.put(UPDATE_BOOKING_SLOTS_ENDPOINT(bestSubSlotData?.id), dataPut, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log(`response ${JSON.stringify(response)}`);
      });
      // update order end date
      const orderEndDate = moment(bestSubSlotData?.startTimeStampSubSlotLevel).add(
        serviceTime || 60,
        'minute',
      );

      const formatStartDate = `${bestSubSlotData?.startTimeStampSubSlotLevel.slice(
        0,
        bestSubSlotData?.startTimeStampSubSlotLevel.lastIndexOf('.'),
      )}+0400`;
      const calcEndDate = moment(orderEndDate).zone('+00:00').toISOString();
      const formatEndDate = `${calcEndDate.slice(0, calcEndDate.lastIndexOf('.'))}+0400`;

      const ordersDrafted =
        ordersContent && ordersContent?.filter((res: any) => res?.status === ORDER_STATUS_DRAFT);
      let cartTotal =
        ordersDrafted?.[0]?.items?.reduce((acc, item: any) => +item?.quantity * +item?.price + acc, 0) || 0.0;
      cartTotal = cartTotal.toFixed(2);
      // TODO: missing props for email template
      Axios.get(GET_LOCATION_ENDPOINT(bestSubSlotData?.locationCode))
        .then((serviceLocation) => {
          console.log(`serviceLocation ${JSON.stringify(serviceLocation.data[0].keyValue)}`);
          const updateOrderData = {
            customerId: checkCustomer?.customerInformation?.customerCode,
            status: 'C',
            description: 'Order Created',
            attributes: {
              bayNo: bestSubSlotData?.bayNo,
              locationCode: bestSubSlotData?.locationCode,
              locationSlotId: bestSubSlotData?.locationSlotId,
              locationBaySubSlotId: bestSubSlotData?.id,
              locationName: serviceLocation.data[0].keyValue,
              customerName: `${checkCustomer.customerInformation.title} ${checkCustomer.customerInformation.customerFirstName} ${checkCustomer.customerInformation.customerLastName}`,
              orderPlacedDate: new Date(),
              amount: cartTotal,
              totalServiceTime: serviceTime,
            },
            appointment: {
              startDate: formatStartDate,
              endDate: formatEndDate,
            },
            externalLocationId: bestSubSlotData?.locationCode,
          };
          Axios.put(UPDATE_ORDER_ENDPOINT(orderedId), updateOrderData, {
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((updateResponse) => {
            console.log(`UPDATE_ORDER ${JSON.stringify(updateResponse)}`);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // localStorage.removeItem('cartItems');
    // localStorage.removeItem('productForBasket');
    scrollToTop();
    orderConfirmDataLayer();
  }, []);

  const orderConfirmDataLayer = () => {
    window?.['dataLayer'].push({
      event: 'checkout',
      ecommerce: {
        checkout: {
          actionField: {
            step: '4',
          },
        },
      },
    });
  };

  return (
    <>
      <Head>
        <title>Confirm Order - Al-Futtaim</title>
      </Head>
      <SectionHero
        title="Confirmed"
        preTitle={{ children: `Placed ${format(new Date(), 'dd MMM yyyy')}` }}
        postTitle={{
          children: `Order reference: ${orderId ? orderId : 'NOT_AVAILABLE'}`,
        }}
      >
        <h5>Your Order is confirmed confirmation mail sent to your email.</h5>
      </SectionHero>
      <Section className="sectionOrderSummary" titleProps={{ text: 'Order Summary' }}>
        <Container>
          <Row>
            <Col sm={6}>
              <CardOrder
                header={{
                  children: <span>Order</span>,
                }}
              />
            </Col>
            <Col sm={6}>
              <CardBooking
                header={{
                  children: <span>Booking details</span>,
                }}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col sm={6}>
              <CardBilling step4={step4} />
            </Col>
          </Row>
        </Container>
      </Section>
      <SectionHelpContacts />
    </>
  );
};

export default OrderConfirmed;
