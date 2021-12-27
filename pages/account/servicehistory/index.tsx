import Head from 'next/head';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '/config/authConfig';
import { ROUTES } from '/utilities/constants';
import { Row, Col, Table, Container } from 'react-bootstrap';
import SectionHero from 'components/common/sectionHero';
import Card from 'components/common/card';
import Section from 'components/common/section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SectionHelpContacts from 'components/templates/sectionHelpContacts';
import { ORDERS_ENDPOINT } from '/config/config';
import { ORDERS_CONTENT } from '/store/actions/types';
import { commonFetch } from '/store/actions/thunk';
import { normalizeOrdersData } from '/utilities/utils';
import { DATE_TIME_FORMATS, getDateTimeUnix, getFormattedDateTime } from 'libs/utils/dateTime';
import { compareValues, getCurrencyFormatttedPrice, getQueryStringParams } from 'libs/utils/global';
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

const ServiceHistory = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const checkCustomer = useSelector((state: any) => state?.storeReducer?.checkCustomer);
  const handleOrdersData = async (data: any) => {
    try {
      setIsLoaded(false);

      const orderStatuses = {
        ORDER_CONFIRMED: 'Order Confirmed',
        ORDER_CANCELLED: 'Order Cancelled',
        ORDER_PENDING: 'Order Pending',
        DRAFT: 'Draft',
      };

      const ordersPending = data
        ?.filter(
          (res: any) =>
            // res?.status !== ORDER_STATUS_CLOSED &&
            // res?.status !== ORDER_STATUS_INVOICED &&
            // res?.status !== ORDER_STATUS_FAILED,
            res?.status === orderStatuses.ORDER_CANCELLED ||
            res?.status === orderStatuses.ORDER_PENDING ||
            res?.status === orderStatuses.DRAFT,
        )
        ?.sort(compareValues('id', 'desc'));

      const ordersCompleted = data
        ?.filter(
          (res: any) =>
            // res?.status === ORDER_STATUS_CLOSED || res?.status === ORDER_STATUS_INVOICED,
            res?.status === orderStatuses.ORDER_CONFIRMED,
        )
        ?.sort(compareValues('id', 'desc'));

      setCompletedOrders(ordersCompleted);
      setPendingOrders(ordersPending);
      setIsLoaded(true);
    } catch (error) {
      setIsLoaded(true);
      throw error;
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      const account = instance.getAllAccounts()[0];
      const accessTokenRequest = { account, scopes: loginRequest.scopes };
      instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
        // Acquire token silent success
        const idToken = accessTokenResponse.idToken;
        const mailId = accessTokenResponse?.idTokenClaims['email'];
      });
    } else {
      router.push({
        pathname: ROUTES.login,
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (checkCustomer?.id) {
      const queryParams = getQueryStringParams(window.location.search);
      dispatch(
        commonFetch({
          URL: ORDERS_ENDPOINT(checkCustomer?.customerInformation?.customerCode),
          type: ORDERS_CONTENT,
          method: 'GET',
        }),
      );
    }
  }, [checkCustomer?.id]);

  useEffect(() => {
    if (ordersContent) {
      const data = normalizeOrdersData(ordersContent);
      handleOrdersData(data);
    }
  }, [ordersContent]);
  useEffect(() => {
    if (isAuthenticated) {
      const account = instance.getAllAccounts()[0];
      const accessTokenRequest = { account, scopes: loginRequest.scopes };
      instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
        // Acquire token silent success
        const idToken = accessTokenResponse.idToken;
        const mailId = accessTokenResponse?.idTokenClaims['email'];
      });
    } else {
      router.push({
        pathname: ROUTES.login,
      });
    }
  }, [isAuthenticated]);

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
  console.log(pendingOrders?.[0]);
  const recentOrder = [...completedOrders].sort(sortTypes['up' as keyof ISortTypeProps].fn)[0];

  return (
    <>
      <Head>
        <title>Service history - Al-Futtaim</title>
      </Head>
      <SectionHero
        className="serviceHistoryDetails"
        title="Service history"
        preTitle={{ children: 'View your previous completed work' }}
        postTitle={{ children: 'Most recent order' }}
      >
        <Row>
          <Col sm={12} md={12}>
            <table className="customTable--large table table-striped">
              <thead>
                <th>Date</th>
                <th>Order</th>
                <th>Total</th>
              </thead>
              <tbody>
                {recentOrder && Object?.keys(recentOrder)?.length > 0 ? (
                  <tr>
                    <td>
                      {getFormattedDateTime(
                        recentOrder?.createdAt,
                        `${DATE_TIME_FORMATS.dayOfMonthWithImmediateZero} ${DATE_TIME_FORMATS.monthName} ${DATE_TIME_FORMATS.fullYear}`,
                      )}
                    </td>
                    <td>{recentOrder?.id}</td>
                    <td>{getCurrencyFormatttedPrice(recentOrder?.orderTotal, recentOrder?.currency)}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={3}>No order history</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </SectionHero>
      <Section className="previousOrders" titleProps={{ text: 'Previous orders' }}>
        <Container>
          <Table className="customTable--large" striped>
            <thead>
              <tr>
                <th className="sortableColumn" onClick={onSortChange}>
                  Date{' '}
                  <span className="sortOuter">
                    <FontAwesomeIcon color="var(--color-azure)" icon={faSort} />
                  </span>
                </th>
                <th>Order </th>
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
    </>
  );
};

export default ServiceHistory;
