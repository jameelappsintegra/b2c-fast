import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Card from 'components/common/card';
import { DEFAULT_CURRENCY, ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import { getCurrencyFormatttedPrice } from 'libs/utils/global';
import { useSelector } from 'react-redux';
import { useIsAuthenticated } from '@azure/msal-react';

interface ICardOrderProps {
  header?: any;
  footerText?: string;
}

const CardOrder = (props: ICardOrderProps) => {
  const isAuthenticated = useIsAuthenticated();
  const { footerText } = props;
  const [basketItems, setBasketItems] = useState([]);
  const cartItems = useSelector((state: any) => state?.storeReducer?.cartItems?.cartItems || {});
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);

  useEffect(() => {
    if (ordersContent && isAuthenticated) {
      const ordersDrafted =
        ordersContent && ordersContent?.find((res: any) => res?.status === ORDER_STATUS_DRAFT);
      setBasketItems(ordersDrafted?.items);
    } else {
      const cartItems: any = localStorage.getItem('cartItems');
      setBasketItems(JSON.parse(cartItems));
    }
  }, []);

  let cartTotal = cartItems?.cartTotal || cartItems.total ? cartItems?.cartTotal || cartItems?.total : 0.0;
  const currency = cartItems?.currency ? cartItems?.currency : DEFAULT_CURRENCY;
  cartTotal = basketItems?.reduce((acc, item: any) => +item?.quantity * +item?.price + acc, 0) || 0.0;

  return (
    <>
      <Card className="card--order" header={props.header}>
        <Table className="orderDetails">
          <tbody>
            {basketItems && basketItems?.length > 0 ? (
              basketItems.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{item?.productName || item?.names?.[0].value} </td>
                  <td>{item?.quantity}</td>
                  <td className="priceColumn">
                    {getCurrencyFormatttedPrice(
                      +item?.quantity * +item?.price,
                      currency ? currency : DEFAULT_CURRENCY,
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No items in the basket</td>
              </tr>
            )}
          </tbody>
          {basketItems?.length > 0 && (
            <tfoot>
              <tr>
                <td style={{ color: 'var(--color-dark-grey)' }} colSpan={2}>
                  {footerText && footerText}
                </td>
                <td className="priceColumn" style={{ color: 'var(--color-dark-grey)' }}>
                  {getCurrencyFormatttedPrice(
                    cartTotal ? cartTotal : 0.0,
                    currency ? currency : DEFAULT_CURRENCY,
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </Card>
    </>
  );
};

export default CardOrder;
