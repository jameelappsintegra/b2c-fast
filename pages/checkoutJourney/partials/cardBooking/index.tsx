import React, { useEffect, useState } from 'react';
import Card, { ICardHeaderProps } from 'components/common/card';
import { IBookingDetailsProps } from '../../booking/interfaces';
import { NOT_AVAILABLE, ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import { DATE_TIME_FORMATS, getFormattedDateTime } from 'libs/utils/dateTime';
import { add, addMinutes, format, parseISO } from 'date-fns';
import { GET_LOCATION_ENDPOINT, ORDERS_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import { useSelector, useDispatch } from 'react-redux';
import { useIsAuthenticated } from '@azure/msal-react';
import { ORDERS_CONTENT } from '/store/actions/types';
interface ICardBookingProps {
  header?: ICardHeaderProps;
}
const CardBooking = (props: any) => {
  const { step4 } = props;
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useDispatch();
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);

  const getServiceLocation = useSelector((state: any) => state?.storeReducer?.getServiceLocation);
  const getSlotContent = useSelector((state: any) => state?.storeReducer?.getSlotContent);
  const productServiceTime = useSelector((state: any) => state?.storeReducer?.productServiceTime);
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);

  const [minutes, setMinutes] = useState(60);
  const bookingDetails: IBookingDetailsProps = useSelector(
    (state: any) => state?.storeReducer?.bookingDetails || {},
  );
  const newTime = `${getSlotContent?.startTimeStampSubSlotLevel?.slice(0, -1)}+04:00`;
  // let dropTime =;

  const orderedId = typeof window !== 'undefined' ? localStorage.getItem('orderId') : null;

  const bestSubSlot =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('BestSubSlot') !== null
        ? JSON.parse(sessionStorage.getItem('BestSubSlot') || '')
        : {}
      : null;
  const bestSubSlotData = Object.keys(getSlotContent).length > 0 ? getSlotContent : bestSubSlot;

  useEffect(() => {
    dispatch(
      commonFetch({
        URL: GET_LOCATION_ENDPOINT(bestSubSlotData?.locationCode),
        type: 'CHECK_LOCATION',
        method: 'GET',
      }),
    );
  }, []);
  useEffect(() => {
    const cartItems: any[] = JSON.parse(localStorage.getItem('cartItems'))
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];
    // console.log('cartItems', cartItems);
    if (!isAuthenticated) {
      let productFromPDPPage: any = localStorage.getItem('cartItems');
      productFromPDPPage = productFromPDPPage ? JSON.parse(productFromPDPPage) : [];
      const serviceTime = productFromPDPPage?.reduce((acc, ele) => {
        return acc + +ele.serviceTime * ele.quantity;
      }, 0);
      setMinutes(serviceTime);
    } else {
      // let ordersDrafted: any = {};

      if (ordersContent) {
        const ordersDraftedDb = ordersContent?.find((res: any) => res?.status === ORDER_STATUS_DRAFT);
        const serviceTime = ordersDraftedDb?.items?.reduce((acc, ele) => {
          return acc + +ele.serviceTime * ele.quantity;
        }, 0);
        setMinutes(serviceTime);
      }
      // console.log(minutes);
    }
  }, [ordersContent]);

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
  useEffect(() => {
    const ordersDrafted =
      ordersContent && ordersContent?.find((res: any) => res?.status === ORDER_STATUS_DRAFT);
    localStorage.setItem('orderId', ordersDrafted?.id);
  }, [ordersContent]);
  return (
    <Card
      className="card--booking"
      header={
        props.header
          ? props.header
          : {
              // tslint:disable-next-line: ter-indent
              children: (
                <span>
                  {props?.cardbookingTitle?.booking_details || step4?.Miscellaneous_Text?.booking_details}
                </span>
              ),
              // tslint:disable-next-line: ter-indent
              styles: {
                color: 'var(--color-white)',
                backgroundColor: 'var(--color-azure)',
              },
              // tslint:disable-next-line: ter-indent
            }
      }
    >
      <div className="bookingBody">
        <span>Drop off and collection</span>
        {getSlotContent && (
          <>
            <div>
              <h5>
                {bestSubSlotData?.startTimeStampSubSlotLevel &&
                  format(new Date(bestSubSlotData?.startTimeStampSubSlotLevel.replace('z', '')), 'd MMM')}
                &nbsp;
                {bestSubSlotData?.startTimeStampSubSlotLevel &&
                  format(
                    new Date(
                      bestSubSlotData?.startTimeStampSubSlotLevel
                        .replace('Z', '')
                        .replace('T', ' ')
                        .replace('.000', ''),
                    ),
                    'HH:mm',
                  )}{' '}
                -{' '}
                {bestSubSlotData?.startTimeStampSubSlotLevel &&
                  format(
                    add(
                      new Date(
                        bestSubSlotData?.startTimeStampSubSlotLevel
                          .replace('Z', '')
                          .replace('T', ' ')
                          .replace('.000', ''),
                      ),
                      {
                        minutes: minutes || 60,
                      },
                    ),
                    'HH:mm',
                  )}
              </h5>
            </div>
            <div>Location Name: {getServiceLocation?.[0]?.keyValue}</div>
          </>
        )}
      </div>
    </Card>
  );
};

export default CardBooking;
