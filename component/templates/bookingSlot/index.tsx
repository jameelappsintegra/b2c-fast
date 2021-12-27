import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { compareAsc, format } from 'date-fns';
import { useEffect, useState } from 'react';
import Section from '/components/common/section';
import TabsCustom from '/components/common/tabs';
import AppButton from '/components/common/appButton';
import { commonFetch } from '/store/actions/thunk';
import {
  GET_BEST_SUB_SLOT_ENDPOINT,
  GET_BOOKING_SLOTS_ENDPOINT,
  ORDERS_ENDPOINT,
  UPDATE_BOOKING_SLOTS_ENDPOINT,
  UPDATE_ORDER_ENDPOINT,
} from '/config/config';
import { GETSLOT_CONTENT, ORDERS_CONTENT, SERVICE_SLOT_CONTENT } from '/store/actions/types';
import { useDispatch, useSelector } from 'react-redux';
import { SLOT_STATUS_AVAILABLE, SLOT_STATUS_UNAVAILABLE } from 'libs/utils/global';
import { notification, NOTIFICATION_TYPE } from '/utilities/utils';
import Axios from 'axios';
import { useIsAuthenticated } from '@azure/msal-react';
import { ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import moment from 'moment';
import Loader from 'react-spinners/PropagateLoader';

const BookingSlot = (props) => {
  const {
    nextTab,
    locValue,
    buttonSelected,
    setButtonSelected,
    slotValue,
    setSlotValue,
    bookSlotFlag,
    setBookSlotFlag,
    updatedOrderId,
    existingSlot,
    setIsSlotBookingShown,
    isSlotBookingShown,
    orderData,
    renderData,
    loading,
    setLoading,
    step2,
  } = props;

  const [slotLoader, setSlotLoader] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [slotId, setSlotId] = useState('');
  const [locationSlotId, setLocationSlotId] = useState('');
  const [capacity, setCapacity] = useState('');
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const [minutes, setMinutes] = useState(60);
  const isAuthenticated = useIsAuthenticated();

  const [state, setState] = useState<any>({
    selectedKey: '',
    selectedIndex: '',
  });
  const serviceSlotContent = useSelector((state: any) => state?.storeReducer?.serviceSlotContent);
  const getBaySubslotId = useSelector((state: any) => state?.storeReducer?.getBaySubslotId);
  const getOrder = useSelector((state: any) => state?.storeReducer?.getOrder);
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);

  const getSlotContent = useSelector((state: any) => state?.storeReducer?.getSlotContent);
  const keyIndexHandler = (index, key) => {
    setButtonSelected({ index, key });
  };
  const slotClickHandler = (
    item: any,
    slotTime: any,
    slotId: any,
    key: any,
    index: any,
    slotSelectedId: any,
  ) => {
    console.warn(existingSlot, 'existingSlot');
    if (slotId) {
      dispatch(
        commonFetch({
          URL: GET_BEST_SUB_SLOT_ENDPOINT(slotId, minutes),
          type: GETSLOT_CONTENT,
          method: 'GET',
        }),
      );
    }
    setSlotId(slotId);
    setSlotValue({ item, slotTime, slotId });
    if (slotTime) {
      setBookSlotFlag(true);
    }
    if (index && key) {
      setState({ selectedKey: key, selectedIndex: index });
    }
    console.log(
      'Selected',
      slotId,
      'slotId',
      item?.date,
      'item.id',
      item?.id,
      format(new Date(item?.date), 'eee'),
      slotTime?.startSlotTime,
      slotTime?.endSlotTime,
    );
  };
  const bestSubSlot =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('BestSubSlot') !== null
        ? JSON.parse(sessionStorage.getItem('BestSubSlot') || '')
        : {}
      : null;
  const bestSubSlotData = Object.keys(getSlotContent).length > 0 ? getSlotContent : bestSubSlot;

  useEffect(() => {
    let serviceTime;
    if (!isAuthenticated) {
      let productFromPDPPage: any = localStorage.getItem('cartItems');
      productFromPDPPage = productFromPDPPage ? JSON.parse(productFromPDPPage) : [];
      serviceTime = productFromPDPPage?.reduce((acc, ele) => {
        return acc + ele.serviceTime * ele.quantity;
      }, 0);
    } else {
      // console.log(`${orderData} ======== isAuthenticated`);
      // serviceTime = orderData;
      // console.log(`${serviceTime} --- serviceTime`);

      const ordersDraftedDb = ordersContent?.find((res: any) => res?.status === ORDER_STATUS_DRAFT);
      serviceTime = ordersDraftedDb?.items?.reduce((acc, ele) => {
        return acc + ele.serviceTime * ele.quantity;
      }, 0);
    }
    setMinutes(serviceTime ? serviceTime : orderData?.attributes?.totalServiceTime);

    // setLoading(true);

    // console.log(getSlotContent, '-----++++++------');
    sessionStorage.setItem('BestSubSlot', JSON.stringify(getSlotContent));

    setLoading(true);
    if (!locValue) {
      setButtonSelected({ index: -1, key: -1 });
    } else {
      dispatch(
        commonFetch({
          URL: GET_BOOKING_SLOTS_ENDPOINT(locValue, '1'),
          type: SERVICE_SLOT_CONTENT,
          method: 'GET',
        }),
      );
      if (serviceSlotContent) {
        // console.log(serviceSlotContent, 'serviceSlotContent');
        setLoading(false);
      } else {
        // console.log(serviceSlotContent, 'serviceSlotContent');
        setLoading(true);
      }
    }
  }, [locValue, getSlotContent, isAuthenticated]);

  const dateTitleFormater = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const formatedStartdate = format(startDate, 'dd MMM');
    const formatedEnddate = format(endDate, 'dd MMM');
    // console.log('start', formatedStartdate, 'end', formatedEnddate);
    return `${formatedStartdate} - ${formatedEnddate}`;
    // return `${startDate} - ${endDate}`;
  };

  const BookingSlotTable = (props) => {
    const { item } = props;
    return (
      <>
        {item ? (
          <Card>
            <Container>
              <Row className="tabHeaders">
                <Col></Col>
                {item?.[0]?.slotAvailability.map((itemData: any, index: number) => (
                  <Col key={index}>
                    <div>{format(new Date(itemData?.date), 'eee')}</div>
                    <strong>
                      {format(new Date(itemData?.date), 'dd')} {format(new Date(itemData?.date), 'MMM')}
                    </strong>
                  </Col>
                ))}
              </Row>
              {item?.map((slotTime, index) => (
                <Row key={index} className="timeSLotSelector">
                  <Col>
                    <h6>
                      {slotTime?.startSlotTime} - {slotTime?.endSlotTime}
                    </h6>
                  </Col>
                  {slotTime?.slotAvailability.map((item, key) => (
                    <Col key={key}>
                      {item?.continousTimeAvailable &&
                        (format(new Date(item?.date), 'eee') !== 'Fri' ? (
                          <Button
                            key={item?.slotId}
                            variant="outline-primary"
                            size="sm"
                            className={`${item?.slotId} btn-outline-primary ${
                              buttonSelected?.index === index && buttonSelected.key === key
                                ? 'filled'
                                : 'outlined'
                            }`}
                            onClick={() => {
                              slotClickHandler(item, slotTime, item?.slotId, key, index, item?.id);
                              keyIndexHandler(index, key);
                            }}
                            disabled={
                              !(
                                compareAsc(
                                  new Date(`${item?.date.split('T')[0]}T${slotTime?.startSlotTime}:00.000`),
                                  new Date().setHours(new Date().getHours() + 4),
                                ) === 1 && +item?.continousTimeAvailable > minutes
                              )
                            }
                          >
                            {buttonSelected?.index === index &&
                            buttonSelected.key === key &&
                            bestSubSlotData?.locationSlotId === slotId
                              ? 'Selected '
                              : compareAsc(
                                  new Date(`${item?.date.split('T')[0]}T${slotTime?.startSlotTime}:00.000`),
                                  new Date().setHours(new Date().getHours() + 4),
                                ) === 1 && +item?.continousTimeAvailable > minutes
                              ? SLOT_STATUS_AVAILABLE
                              : SLOT_STATUS_UNAVAILABLE}
                            {/* {item?.slotId}
                          {existingSlot?.[0]?.attributes?.locationSlotId} */}
                          </Button>
                        ) : (
                          <div className="emptySlot"></div>
                        ))}
                    </Col>
                  ))}
                </Row>
              ))}
            </Container>
          </Card>
        ) : (
          <Card style={{ padding: '2rem' }}>
            <Card.Body>
              <Card.Text>Selected Location has no avaialble slot please choose some other Location</Card.Text>
            </Card.Body>
          </Card>
        )}
      </>
    );
  };
  const tabArrData =
    serviceSlotContent &&
    JSON.stringify(Object.values(serviceSlotContent).join('')) !==
      "Cannot read property 'futureAppointment' of null" &&
    Object.values(serviceSlotContent).map((item: any, key: any) => {
      return {
        key,
        startDate: item?.startDate,
        endDate: item?.endDate,
        title: item?.startDate && item?.endDate && dateTitleFormater(item?.startDate, item?.endDate),
        children: <BookingSlotTable item={item?.slotDetails} minutes setMinutes />,
      };
    });

  const tabsArr = [...tabArrData];
  const slotTabSelectedHandler = () => {
    setBookSlotFlag(false);
    setSlotValue('');
    setButtonSelected({ index: -1, key: -1 });
  };
  const queryParams = window.location.pathname;
  const bookNewSlot = (newSlotId, orderId) => {
    // console.log(newSlotId, orderId, 'newSlotId----');
    const updateSlotDetails = {
      orderId,
      action: 'Booking',
      capacityRequired: minutes,
    };
    Axios.put(UPDATE_BOOKING_SLOTS_ENDPOINT(newSlotId), updateSlotDetails, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((updateResponse) => {
      // console.log(`UPDATE_ORDER ${JSON.stringify(updateResponse)}`);
    });
  };

  const updateCurrentOrder = (updatedOrderId, existingSlot) => {
    const bestSubSlot =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('BestSubSlot') !== null
          ? JSON.parse(sessionStorage.getItem('BestSubSlot') || '')
          : {}
        : null;
    const bestSubSlotData = Object.keys(getSlotContent).length > 0 ? getSlotContent : bestSubSlot;
    const endDateValue = new Date(bestSubSlotData?.startTimeStampSubSlotLevel);
    const existingMinutes = existingSlot?.[0]?.attributes?.productServiceTime | 20;
    // const minutesLater = addMinutes(endDateValue, existingMinutes);

    const serviceTime = orderData && orderData?.attributes?.totalServiceTime;
    const orderEndDate =
      bestSubSlotData?.startTimeStampSubSlotLevel &&
      moment(bestSubSlotData?.startTimeStampSubSlotLevel).add(serviceTime || 60, 'minute');

    const formatStartDate =
      bestSubSlotData?.startTimeStampSubSlotLevel &&
      `${bestSubSlotData?.startTimeStampSubSlotLevel.slice(
        0,
        bestSubSlotData?.startTimeStampSubSlotLevel.lastIndexOf('.'),
      )}+0400`;
    const calcEndDate = orderEndDate && moment(orderEndDate).zone('+00:00').toISOString();
    const formatEndDate = calcEndDate && `${calcEndDate.slice(0, calcEndDate.lastIndexOf('.'))}+0400`;

    Axios.get(UPDATE_ORDER_ENDPOINT(orderData?.id)).then((resOrder) => {
      // console.log(`${JSON.stringify(resOrder.data)} ====== resOrder`);

      const orderToUpdateInDB = {
        appointment: {
          startDate: formatStartDate,
          endDate: formatEndDate,
        },
        status: 'U',
        description: 'Order Updated',
        attributes: {
          ...resOrder.data.attributes,
          locationSlotId: bestSubSlotData?.locationSlotId,
          locationBaySubSlotId: bestSubSlotData?.id,
        },
      };

      Axios.put(UPDATE_ORDER_ENDPOINT(updatedOrderId), orderToUpdateInDB, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((resp) => {
        bookNewSlot(bestSubSlotData?.id, updatedOrderId);
        setIsSlotBookingShown(!isSlotBookingShown);
        notification(NOTIFICATION_TYPE.success, 'Your Slot is Updated.');
        renderData();
        // console.log(`UPDATE_ORDER ${JSON.stringify(resp)}`);
      });
    });
  };

  const unbookExistingSlot = (existingSlot) => {
    const updateSlotDetails = {
      action: 'UnBooking',
      capacityRequired: 45,
      orderId: '',
    };
    Axios.put(UPDATE_BOOKING_SLOTS_ENDPOINT(existingSlot), updateSlotDetails, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((updateResponse) => {
      console.log(`UPDATE_ORDER ${JSON.stringify(updateResponse)}`);
    });
  };

  const updateOrder = (updatedOrderId) => {
    unbookExistingSlot(existingSlot);
    updateCurrentOrder(updatedOrderId, existingSlot);
  };
  // const orderid = getOrder?.id ? getOrder?.id : '';
  const pushToDataLayerAnalytics = () => {
    window?.['dataLayer'].push({
      event: 'checkoutOption',
      ecommerce: {
        checkout_option: {
          actionField: {
            step: '1',
            option: 'User Selected',
          },
        },
      },
    });
  };

  useEffect(() => {
    if (checkCustomer?.id) {
      dispatch(
        commonFetch({
          URL: ORDERS_ENDPOINT(checkCustomer?.customerInformation?.customerCode),
          type: ORDERS_CONTENT,
          method: 'GET',
        }),
      );
    }
  }, [checkCustomer?.id]);

  return (
    <>
      {/* {loading ? ' Loading' : 'notLoading'} */}
      {!serviceSlotContent &&
      JSON.stringify(Object.values(serviceSlotContent).join('')) ===
        "Cannot read property 'futureAppointment' of null" ? (
        'Loading'
      ) : (
        <Section titleProps={{ text: step2?.Miscellaneous_Text?.choose_date_time }}>
          <Container>
            <Row className="justify-content-center bookingSlotsSection">
              <TabsCustom
                onClick={slotTabSelectedHandler}
                id="paymentTabs"
                defaultActiveKey={0}
                tabs={tabsArr}
                width="auto"
              />
              <AppButton
                onClick={(e?: React.MouseEvent<HTMLElement>) => {
                  e?.preventDefault();
                  {
                    queryParams.split('/')[2] === 'orders' ? updateOrder(updatedOrderId) : nextTab();
                  }
                  pushToDataLayerAnalytics();
                }}
                isCentered={true}
                text={`${
                  queryParams.split('/')[2] === 'orders'
                    ? 'Update Slot'
                    : step2?.Miscellaneous_Text?.book_slot
                }`}
                variant="filled"
                shape="rounded"
                disabled={!bookSlotFlag}
              />
            </Row>
          </Container>
        </Section>
      )}
    </>
  );
};

export default BookingSlot;
