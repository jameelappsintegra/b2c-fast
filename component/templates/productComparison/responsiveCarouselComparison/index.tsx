import Slider from 'react-slick';
import { Container } from 'react-bootstrap';
import ComparisonItem from '../partials/comparisonItem';
import AppButton from '/components/common/appButton';
import PlaceholderItems from '../partials/placeholderItems';

const ResponsiveCarouselComparison = (props: any) => {
  const items = [{}];

  return (
    <div className="productComparison">
      <Container>
        <div className="productComparison__inner">
          <h4>
            <span>Select up to 3 items to compare</span>
            <div className="d-block d-sm-block d-md-none w-100">
              {/* <ResponsiveCarouselComparison
               items={items}
               onClick={props.onClick}
               placeholderCount={props.placeholderCount}
              /> */}
            </div>
            <AppButton
              text="Compare"
              variant="filled"
              shape="rounded"
              disabled={items.length < 2}
              //   url={items.length < 2 ? '#' : ROUTES.comparisonResults}
              //   onClick={(e?: React.MouseEvent<HTMLElement>) => {
              //     if (items.length < 2 && e) {
              //       e.preventDefault();
              //     } else {
              //       this.storeComparisonItems(e);
              //     }
              //   }}
            />
          </h4>

          <div className="d-none d-md-block">
            <div className="productComparison__list">
              {items.map((item, index) => (
                <ComparisonItem
                  key={index}
                  item={item}
                  hasCloseIcon
                  //   onClick={props.onClick}
                />
              ))}
              {/* {placeHolderItems} */}
              {/* <PlaceholderItems {...this.props.placeholderCount} /> */}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ResponsiveCarouselComparison;
