import Head from 'next/head';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormCustom from 'components/common/form';
import Card from 'components/common/card';
import { DEFAULT_CURRENCY } from 'libs/utils/constants';
import FormGroup from 'components/common/form/formGroup';
import { getCurrencyFormatttedPrice } from 'libs/utils/global';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { getQuantityOptions } from '/utilities/utils';

interface IResponsiveBasketTableProps {
  items: any[];
  handleRemoveItem: any;
  handleProductQuantity: any;
}

const ResponsiveBasketTable = (props: IResponsiveBasketTableProps) => {
  const { items } = props;
  const cartTotal = items?.reduce((acc, item: any) => +item.quantity * +item.price + acc, 0) || 0.0;

  return (
    <FormCustom>
      <Head>
        <title>Basket - Al-Futtaim</title>
      </Head>

      {items && items?.length > 0 ? (
        items.map((item, index) => (
          <Card
            header={{
              children: (
                <>
                  <span>{item.names[0].value}</span>
                  <a
                    href="#"
                    onClick={(e: any) => {
                      if (e) {
                        e.preventDefault();
                        props.handleRemoveItem(item);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </a>
                </>
              ),
            }}
            key={index}
          >
            <div className="basketAttributes">
              <label>Quantity</label>
              <label>
                <FormGroup
                  id="quantity"
                  groupStyles={{ margin: 0 }}
                  formControl={{
                    type: 'select',
                    value: item?.quantity,
                    options: getQuantityOptions(5),
                    onChange: (e) => {
                      props.handleProductQuantity(e, index, item);
                    },
                  }}
                />
              </label>
              <label>Unit Price</label>
              <label>{getCurrencyFormatttedPrice(item.price, item.currency)}</label>

              <label>Discount</label>
              <label>{getCurrencyFormatttedPrice(item.discount, item.currency)}</label>
              <label>Price</label>
              <label>{getCurrencyFormatttedPrice(item.price * item.quantity, item.currency)}</label>
            </div>
          </Card>
        ))
      ) : (
        <Card
          className="basketTotalCard"
          header={{
            children: (
              <>
                <span></span>
              </>
            ),
          }}
        >
          <div className="basketAttributes">
            <label>No items in the basket </label>
          </div>
        </Card>
      )}
      {items && items?.length > 0 ? (
        <Card
          className="basketTotalCard"
          header={{
            children: (
              <>
                <span>Total including VAT</span>
              </>
            ),
          }}
        >
          <div className="basketAttributes">
            <label>{getCurrencyFormatttedPrice(cartTotal ? cartTotal : 0.0, DEFAULT_CURRENCY)}</label>
          </div>
        </Card>
      ) : null}
    </FormCustom>
  );
};

export default ResponsiveBasketTable;
