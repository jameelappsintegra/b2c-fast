import { PLACEHOLDER_COUNT } from 'libs/utils/constants';
import router, { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import ComparisonItem from './partials/comparisonItem';
import PlaceholderItems from './partials/placeholderItems';
import ResponsiveCarouselComparison from './responsiveCarouselComparison';
import AppButton from '/components/common/appButton';
import { IProductProps } from '/components/common/productGridItem';
import { setCompareItems } from '/store/actions/action';
import { commonFetch } from '/store/actions/thunk';
import { ISetCompareItemsProps } from '/store/actions/types';
import { ROUTES } from '/utilities/constants';
//  import './style.scss';

interface IProductComparisonProps {
  items: IProductProps[];
  placeholderCount: number;
  onClick?: (product: IProductProps) => void;
  setCompareItems?: (payload: ISetCompareItemsProps) => void;
}

const ProductComparison = (props) => {
  const dispatch = useDispatch();
  const placeHolderItems: any[] = [];
  const placeholderCount = PLACEHOLDER_COUNT;
  const { items, onClick } = props;
  const storeComparisonItems = (event?: React.MouseEvent<HTMLElement>) => {
    if (event && event.currentTarget.getAttribute('href') !== ROUTES.productComparisonDetail) {
      event.preventDefault();
    }
    if (setCompareItems) {
      dispatch(
        setCompareItems({
          products: props.items,
          placeHolderCount: placeholderCount,
        }),
      );
      router.push({
        pathname: ROUTES.productComparisonDetail,
      });
    }
  };
  return (
    <div className="productComparison">
      <Container>
        <div className="productComparison__inner">
          <h4>
            <span>Select up to 3 items to compare</span>
            <div className="d-block d-sm-block d-md-none w-100">
              <ResponsiveCarouselComparison
                items={items}
                // onClick={this.props.onClick}
                // placeholderCount={this.props.placeholderCount}
              />
            </div>
            <AppButton
              text="Compare"
              variant="filled"
              shape="rounded"
              disabled={items.length < 2}
              // url={items.length < 2 ? '#' : ROUTES.productComparisonDetail}
              onClick={(e?: React.MouseEvent<HTMLElement>) => {
                if (items.length < 2 && e) {
                  e.preventDefault();
                } else {
                  storeComparisonItems(e);
                }
              }}
            />
          </h4>

          <div className="d-none d-md-block">
            <div className="productComparison__list">
              {items.map((item, index) => (
                <ComparisonItem key={index} item={item} hasCloseIcon={true} onClick={onClick} />
              ))}
              {placeHolderItems}
              <PlaceholderItems {...props.placeholderCount} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductComparison;
