import { Col, Row, Table } from 'react-bootstrap';
import Card from 'components/common/card';
import { DATE_TIME_FORMATS, getFormattedDateTime } from 'libs/utils/dateTime';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import AppButton from '/components/common/appButton';
import { useSelector } from 'react-redux';
import { getCurrencyFormatttedPrice } from 'libs/utils/global';
import { NOT_AVAILABLE } from 'libs/utils/constants';

const OrderList = (props) => {
  const { createdOrders = [], updateSlot, cancelOrder } = props;
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);

  const [orderData, setOrderData] = useState<any[]>([]);
  useEffect(() => {
    setOrderData(createdOrders);
  }, [createdOrders, ordersContent]);
  return (
    <>
      {orderData && orderData?.length > 0
        ? orderData?.map((itemData, _index: number) => (
            <div key={_index}>
              <p className="orderInfo">
                {`Order reference: ${itemData?.id || NOT_AVAILABLE} Placed ${getFormattedDateTime(
                  itemData?.attributes.orderPlacedDate || '',
                  `${DATE_TIME_FORMATS.dayOfMonthWithoutImmediateZero} ${DATE_TIME_FORMATS.monthName} ${DATE_TIME_FORMATS.fullYear}`,
                )}`}
              </p>
              <p className="orderStatus">{`Status: ${itemData?.description}`} </p>
              <Row className="ordersRow">
                <Col sm={12} md={6}>
                  <Card
                    className="card--order"
                    header={{
                      children: (
                        <>
                          <span>Order</span>
                        </>
                      ),
                      styles: {
                        color: 'var(--color-white)',
                        backgroundColor: 'var(--color-azure)',
                      },
                    }}
                  >
                    <Table>
                      <tbody>
                        {(itemData?.items ?? [])?.map((item: any, itemIndex: number) => (
                          <tr key={itemIndex}>
                            <td>
                              <h5>{item?.names?.[0]?.value ?? ''}</h5>
                            </td>
                            <td>
                              <h5>{item?.quantity}</h5>
                            </td>
                            <td>
                              <h5>{getCurrencyFormatttedPrice(item?.total, item?.currency)}</h5>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2}>
                            <span className="d-flex">
                              Total including <h6 className="vat--txt">(VAT)</h6>
                            </span>
                          </td>
                          <td>
                            {getCurrencyFormatttedPrice(
                              itemData?.attributes?.amount,
                              itemData?.items?.[0]?.currency,
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </Card>
                </Col>
                <Col sm={12} md={6}>
                  <Card
                    className="card--booking"
                    header={{
                      children: (
                        <>
                          <span>Booking details</span>
                        </>
                      ),
                      styles: {
                        color: 'var(--color-white)',
                        backgroundColor: 'var(--color-azure)',
                      },
                    }}
                  >
                    <div className="bookingBody">
                      <span>
                        {itemData?.bookingLabel ? itemData?.bookingLabel : 'Drop off and collection'}
                      </span>
                      <div>
                        <h5>
                          {itemData?.appointment?.startDate &&
                            format(new Date(itemData?.appointment?.startDate), 'dd MMM ')}
                          {itemData?.appointment?.startDate &&
                            format(new Date(itemData?.appointment?.startDate), 'HH:mm ')}{' '}
                          -{' '}
                          {itemData?.appointment?.endDate &&
                            format(new Date(itemData?.appointment?.endDate), 'HH:mm')}
                        </h5>
                      </div>
                      <div>
                        {itemData?.attributes?.locationName
                          ? itemData?.attributes?.locationName
                          : itemData?.attributes?.locationCode}
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col className="update-order">
                  <p>Do you need to change your order or cancel it?</p>
                  <div className="update-cancel-btn">
                    <AppButton
                      variant="filled"
                      shape="rounded"
                      text={'Update Order'}
                      styles={{
                        width: '13rem',
                        height: '3.5rem',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                      }}
                      onClick={() => {
                        updateSlot(itemData);
                      }}
                    />
                    <AppButton
                      variant="filled"
                      shape="rounded"
                      text={'Cancel Order'}
                      styles={{
                        width: '13rem',
                        height: '3.5rem',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        marginLeft: '5px',
                      }}
                      onClick={(event) => {
                        cancelOrder(event, itemData);
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          ))
        : 'No pending orders'}
    </>
  );
};

export default OrderList;
