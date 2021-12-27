import React from 'react';
import { Container } from 'react-bootstrap';
import Section from 'components/common/section';
import TabCustom from 'components/common/tabs';
import Online from './partials/online';
import Garage from './partials/garage';
import { ORDER_STATUS_DRAFT } from 'libs/utils/constants';
import { useSelector } from 'react-redux';
import { compareValues } from 'libs/utils/global';

const SectionPaymentOptions = (props: any) => {
  const { step4, location } = props;
  const ordersContent = useSelector((state: any) => state?.storeReducer?.ordersContent);
  const getOrder = useSelector((state: any) => state?.storeReducer?.getOrder);

  const ordersContentDraft =
    ordersContent &&
    ordersContent
      ?.filter((res: any) => res?.status === ORDER_STATUS_DRAFT)
      ?.sort(compareValues('id', 'desc'));
  const ordersDrafted = ordersContentDraft.length ? ordersContentDraft[0] : getOrder;

  const cartTotal: string = (
    ordersDrafted?.items?.reduce((acc, item: any) => +item?.quantity * +item?.price + acc, 0) || 0.0
  ).toFixed(2);

  const tabsArr = [
    {
      title: `${'Pay Online'}`,
      key: 'method',
      children: <Online />,
    },
    {
      title: `${'Pay at Garage'}`,
      key: 'garage',
      children: <Garage locGarage={location} cartTotal={cartTotal} />,
    },
  ];

  return (
    <Section
      className="sectionPaymentMethod"
      titleProps={{ text: `${step4?.Miscellaneous_Text?.payment_options || 'Paymesdnt options'}` }}
    >
      <Container>
        <TabCustom id="paymentTabs" defaultActiveKey="method" tabs={tabsArr} width="full" />
      </Container>
    </Section>
  );
};

export default SectionPaymentOptions;
