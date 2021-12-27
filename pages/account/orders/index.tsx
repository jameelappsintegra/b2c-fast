import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faSort, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SectionHelpContacts from 'components/templates/sectionHelpContacts';
import { Table, Container } from 'react-bootstrap';
import SectionHero from 'components/common/sectionHero';
import Section from 'components/common/section';
import Loader from 'components/common/loader';
import {
  ORDER_STATUS_CLOSED,
  ORDER_STATUS_INVOICED,
  ORDER_STATUS_ORDER_CREATED,
  ORDER_STATUS_ORDER_UPDATED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DRAFT,
  ORDER_STATUS_CANCEL,
  ORDER_STATUS_IN_PROGRESS,
  ORDER_STATUS_WAINTINGFORSERVICE,
  ORDER_STATUS_WORKINPROGRESS,
  ORDER_STATUS_READYFORCOLLECTION,
} from 'libs/utils/constants';
import { compareValues, getCurrencyFormatttedPrice, scrollToTop } from 'libs/utils/global';
import { DATE_TIME_FORMATS, getDateTimeUnix, getFormattedDateTime } from 'libs/utils/dateTime';
import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '/config/authConfig';
import { normalizeOrdersData, notification, NOTIFICATION_TYPE } from '/utilities/utils';
import { commonFetch } from '/store/actions/thunk';
import { CANCEL_ORDER_ENDPOINT, ORDERS_ENDPOINT } from '/config/config';
import { CANCEL_ORDER, ORDERS_CONTENT } from '/store/actions/types';
import BookingSlot from '/components/templates/bookingSlot';
import OrderList from '/components/templates/orderList';

interface ISortTypeProps {
  up: any;
  down: any;
  default: any;
}
export interface ICartItemProps {
  cartId: string;
  id: string;
  name: string;
  price: number;
  total: number;
  quantity: string;
  status: boolean;
}

const Orders = () => {
  const dispatch = useDispatch();
  const { instance } = useMsal();

  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [createdOrders, setCreatedOrders] = useState<any[]>([]);
  const [draftedOrders, setDraftedOrders] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSlotBookingShown, setIsSlotBookingShown] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<any[]>([]);
  const [locValue, setLocValue] = useState();
  const [selectedButton, setSelectedButton] = useState('');
  const [buttonSelected, setButtonSelected] = useState({ index: -1, key: -1 });
  const [slotValue, setSlotValue] = useState<any>([]);
  const [existingSlot, setExistingSlot] = useState<any>('');
  const [bookSlotFlag, setBookSlotFlag] = useState(false);
  const [minutes, setMinutes] = useState(60);
  const [updatedOrderId, setUpdatedOrderId] = useState<any>('');
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const [scroller, setScroller] = useState<any>(null);
  let ordersCreated;

  const handleOrdersData = async (data: any) => {
    localStorage.removeItem('orderId');
    try {
      setIsLoaded(false);

      const ordersPending = data
        ?.filter((res: any) => res?.status === ORDER_STATUS_DRAFT)
        ?.sort(compareValues('id', 'desc'));

      const ordersCompleted = data
        ?.filter(
          (res: any) =>
            res?.status === ORDER_STATUS_CONFIRMED ||
            res.status === ORDER_STATUS_CANCEL ||
            res.status === ORDER_STATUS_IN_PROGRESS ||
            res.status === ORDER_STATUS_WAINTINGFORSERVICE ||
            res.status === ORDER_STATUS_WORKINPROGRESS ||
            res.status === ORDER_STATUS_READYFORCOLLECTION ||
            res.status === ORDER_STATUS_INVOICED ||
            res.status === ORDER_STATUS_CLOSED,
        )
        ?.sort(compareValues('id', 'desc'));

      ordersCreated = data
        ?.filter(
          (res: any) =>
            res?.status === ORDER_STATUS_ORDER_CREATED || res?.status === ORDER_STATUS_ORDER_UPDATED,
        )
        ?.sort(compareValues('id', 'desc'));

      const ordersDrafted = data?.find((res: any) => res?.status === ORDER_STATUS_DRAFT);

      setCompletedOrders(ordersCompleted);
      setPendingOrders(ordersPending);
      setCreatedOrders(ordersCreated);
      setDraftedOrders(ordersDrafted);
      setIsLoaded(true);
    } catch (error) {
      setIsLoaded(true);
      throw error;
    }
  };
  // console.log(checkCustomer, 'checkCustomer');
  useEffect(() => {
    const account = instance.getAllAccounts()[0];
    const accessTokenRequest = { account, scopes: loginRequest.scopes };
    instance.acquireTokenSilent(accessTokenRequest).then(() => {
      // Acquire token silent success
    });
  }, []);
  const getOrderContent = () => {
    dispatch(
      commonFetch({
        URL: ORDERS_ENDPOINT(checkCustomer?.customerInformation?.customerCode),
        type: ORDERS_CONTENT,
        method: 'GET',
      }),
    );
  };
  useEffect(() => {
    scrollToTop();
    if (checkCustomer) {
      getOrderContent();
    }
  }, [checkCustomer]);

  useEffect(() => {
    if (ordersContent) {
      setCreatedOrders([]);
      console.log('ordersContent in acc ----- orders', ordersContent);
      const data = normalizeOrdersData(ordersContent);
      // // console.log('ordersContent (normalized)', data);
      // scrolltoUpdate = document && document.querySelector('#updateScrollSlot');
      // console.log(scrolltoUpdate?.offsetTop, '---------scrolltoUpdate');
      handleOrdersData(data);
    }
    setScroller(document && document.getElementById('updateScrollSlot'));
  }, [ordersContent]);

  const sortTypes: ISortTypeProps = {
    up: {
      class: 'sort-up',
      fn: (a: any, b: any) => getDateTimeUnix(a.createdAt) - getDateTimeUnix(b.createdAt),
    },
    down: {
      class: 'sort-down',
      fn: (a: any, b: any) => getDateTimeUnix(b.createdAt) - getDateTimeUnix(a.createdAt),
    },
    default: {
      class: 'sort',
      fn: (a: any, _b: any) => a,
    },
  };

  const [currentSort, setCurrentSort] = useState<string>('default');
  const onSortChange = () => {
    let nextSort = 'default';

    if (currentSort === 'down') nextSort = 'up';
    else if (currentSort === 'up') nextSort = 'default';
    else if (currentSort === 'default') nextSort = 'down';
    setCurrentSort(nextSort);
  };

  const cancelOrder = (e, penOrder) => {
    // e.preventDefault();
    dispatch(
      commonFetch({
        URL: CANCEL_ORDER_ENDPOINT(penOrder?.id),
        type: CANCEL_ORDER,
        method: 'PUT',
        data: cancelOrderDetails,
      }),
    );
    notification(NOTIFICATION_TYPE.success, `Order ${penOrder?.id} is Cancelled successfully`);
    getOrderContent();
    console.log(penOrder, 'pending order ---- cancel order');
  };
  const updateSlot = (orderData) => {
    const locationCode = orderData!.attributes!.locationCode;
    const currentOrderId = orderData!.id;
    const filteredSelectedOrder = createdOrders.filter((res: any) => {
      if (res?.id === currentOrderId) {
        return res;
      }
    });

    if (locationCode && currentOrderId && orderData) {
      // orderDetailsData = orderData?.attibutes?.totalServiceTime;
      sessionStorage.removeItem('BestSubSlot');
      console.log(currentOrderId, 'currentOrderId', locationCode, 'locationCode', orderData, 'orderData');
      setLocValue(locationCode);
      setUpdatedOrderId(currentOrderId);
      setExistingSlot(filteredSelectedOrder);
      setIsSlotBookingShown(isSlotBookingShown ? isSlotBookingShown : !isSlotBookingShown);
      setOrderData(orderData);
      scroller.scrollIntoView();
    }
  };
  const cancelOrderDetails = {
    status: 'R',
    description: 'Order Cancelled',
  };

  const renderData = () => {
    getOrderContent();
    // console.log(`render data ====`);
  };

  return (
    <>
      <Head>
        <title>Order details - Al-Futtaim</title>
      </Head>
      {!isLoaded && <Loader color={'var(--color-white)'} loading={!isLoaded} />}

      <SectionHero
        className="heroOrders"
        title="Orders"
        preTitle={{ children: 'View all placed orders for your car' }}
      >
        <OrderList createdOrders={createdOrders} updateSlot={updateSlot} cancelOrder={cancelOrder} />
      </SectionHero>
      <div id="updateScrollSlot">
        {isSlotBookingShown ? (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '25px',
                height: '25px',
                cursor: 'pointer',
                right: '80px',
                top: '50px',
                zIndex: 999,
                position: 'absolute',
              }}
              onClick={() => {
                setIsSlotBookingShown(false);
                sessionStorage.removeItem('BestSubSlot');
              }}
            >
              <FontAwesomeIcon
                icon={faWindowClose}
                className={'bannerText_right'}
                style={{ width: '100%', height: '100%' }}
                color={'var(--color-azure)'}
              />
            </div>
            <BookingSlot
              minutes={minutes}
              setMinutes={setMinutes}
              locValue={locValue}
              selectedButton={selectedButton}
              setSelectedButton={setSelectedButton}
              buttonSelected={buttonSelected}
              setButtonSelected={setButtonSelected}
              slotValue={slotValue}
              setSlotValue={setSlotValue}
              bookSlotFlag={bookSlotFlag}
              setBookSlotFlag={setBookSlotFlag}
              updatedOrderId={updatedOrderId}
              existingSlot={existingSlot}
              setIsSlotBookingShown={setIsSlotBookingShown}
              isSlotBookingShown={isSlotBookingShown}
              orderData={orderData}
              renderData={renderData}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <Section className="previousOrders" titleProps={{ text: 'Previous orders' }}>
        <Container>
          <Table className="customTable--large" striped>
            <thead>
              <tr>
                <th className="sortableColumn" onClick={onSortChange}>
                  Date
                  <span className="sortOuter">
                    <FontAwesomeIcon color="var(--color-azure)" icon={faSort} />
                  </span>
                </th>
                <th>Order </th>
                <th>Status</th>
                <th>Total </th>
              </tr>
            </thead>
            <tbody>
              {completedOrders?.length > 0 ? (
                [...completedOrders]
                  .sort(sortTypes[currentSort as keyof ISortTypeProps].fn)
                  .map((completedOrder: any, index) => (
                    <tr key={index}>
                      <td>
                        {getFormattedDateTime(
                          completedOrder?.createdAt,
                          `${DATE_TIME_FORMATS.dayOfMonthWithImmediateZero} ${DATE_TIME_FORMATS.monthName} ${DATE_TIME_FORMATS.fullYear}`,
                        )}
                      </td>
                      <td>{completedOrder?.id}</td>
                      <td>{completedOrder?.description}</td>
                      <td>
                        {getCurrencyFormatttedPrice(
                          completedOrder?.items?.reduce((sum, item) => item.price + sum, 0),
                          completedOrder?.items?.[0]?.currency,
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={3}>No order history</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </Section>
      <SectionHelpContacts />
      {/* <SectionUpcomingService /> */}
    </>
  );
};

export default Orders;
