import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { defaultImageThumbSrc, pathTodefaultImageThumb } from 'libs/utils/global';
import { imgRefactorURI } from '/utilities/utils';

const ComparisonItem = ({ item, hasCloseIcon, onClick }: any) => {
  // console.log(item, 'item----');
  return Object.keys(item).length > 0 ? (
    <div className="comparisonItem__listItem withData">
      <div className="comparisonItem__thumbBlock">
        {item?.image && item?.image !== '' ? (
          <img src={imgRefactorURI(item?.image)} alt="productThumb" onError={defaultImageThumbSrc} />
        ) : (
          <img src={pathTodefaultImageThumb} alt="defaultThumb" onError={defaultImageThumbSrc} />
        )}
      </div>
      <div className="comparisonItem__contentBlock">
        <h4>{item?.sapPattern}</h4>
        <p>
          <span>{item?.brandLabel}</span>
          <span>{item?.sapDot}</span>
          <span>{item?.specialPrice ? item?.specialPrice : item?.retailPrice}</span>
        </p>
      </div>
      {hasCloseIcon && (
        <span
          className="timesIcon"
          onClick={() => {
            if (onClick) {
              onClick(item);
            }
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </span>
      )}
      {/* <div className="comparisonItem__productImageSection">
        {item && item?.image && item?.image !== '' ? (
          <img
            className="brandLogo"
            src={item?.image}
            // alt={item.image?.alternativeText} // Need to change the 'image' from string to object
            onError={defaultImageThumbSrc}
          />
        ) : (
          <img
            src={pathTodefaultImageThumb}
            alt="defaultThumb"
            onError={defaultImageThumbSrc}
          />
        )}
      </div> */}
    </div>
  ) : (
    <div className="comparisonItem__listItem withoutData" />
  );
};

export default ComparisonItem;
