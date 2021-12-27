import { useSelector } from 'react-redux';
import { getCurrencyFormatttedPrice } from 'libs/utils/global';
import Card from 'components/common/card';
import visaImage from '/images/visa.png';
import { DEFAULT_CURRENCY, PAYMENT_TYPE_GARAGE, PAYMENT_TYPE_ONLINE } from 'libs/utils/constants';
import { imgRefactorURI } from '/utilities/utils';

const CardPayment = () => {
  const paymentType = useSelector((state: any) => state?.storeReducer?.paymentType || '');
  const cartItems = useSelector((state: any) => state?.storeReducer?.cartItems?.cartItems || {});

  const cartTotal = cartItems?.cartTotal || 0.0;
  const currency = cartItems?.currency || DEFAULT_CURRENCY;
  const basketItems = cartItems?.items || [];
  return (
    <Card
      className="card--payment"
      header={{
        children: <span>Payment</span>,
      }}
    >
      <div>
        {paymentType === PAYMENT_TYPE_ONLINE && (
          <>
            <img src={imgRefactorURI(visaImage.src)} alt="" />
            <span>Paid in full</span>
          </>
        )}
        {paymentType === PAYMENT_TYPE_GARAGE ? <span>Pay at garage</span> : null}
        {basketItems?.length > 0 && <span>{getCurrencyFormatttedPrice(cartTotal, currency)}</span>}
      </div>
    </Card>
  );
};

export default CardPayment;
