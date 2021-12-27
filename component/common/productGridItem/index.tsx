import React from 'react';
import AppButton from 'components/common/appButton';
import IBilingual from 'components/common/models/bilingual';
import {
  getQueryStringParams,
  pathTodefaultImageThumb,
  getGlobalEventTrigger,
  getCategoryFromURL,
  defaultImageThumbSrc,
} from 'libs/utils/global';
import { CATEGORY_TYPE_SERVICE } from 'libs/utils/constants';
import brandLogo from '../../../images/brand.png';
import CheckboxCustom from '../form/checkboxCustom';
import TagManager from 'react-gtm-module';
import { CLASSIFICATION_INTEREST } from 'libs/utils/gtm';
import { useRouter } from 'next/router';
import { ROUTES } from '/utilities/constants';
import { b2cTypes, b2cTypesToCategoryTypes } from '/config/config';
import { imgRefactorURI } from '/utilities/utils';

export interface IProductInventoryProps {
  id?: string;
  productId?: string;
  locationId?: number;
  organizationId?: string;
  lobId?: string;
  unitOfMeasure?: string;
  quantity: number;
}

export interface IProductPriceProps {
  price: number;
  priceType?: string | 'Special' | 'Retail';
  unitOfMeasure?: string;
  productId?: string;
  currencyCode?: string;
  locationId?: number;
  id?: string;
}
export interface IProductProps {
  id: string | number;
  name: IBilingual[];
  code: string;
  brand?: string;
  shortDescription?: IBilingual[];
  price: IProductPriceProps[];
  quantity?: number;
  inventory?: IProductInventoryProps[];
  url?: string;
  hasOffer?: boolean;
  isComparable?: boolean;
  hasPlaceholder?: boolean;
  features: IProductAttributeProps[];

  /**
   * long description
   */
  description: IBilingual[];

  /**
   * Category type the product belongs to
   */
  type: string;

  /**
   * Is checked for comparison
   */
  isChecked?: boolean;

  /**
   * stockStatus is to check product stock status
   */
  stockStatus?: string;

  categories?: [];
}

export interface IProductAttributeProps {
  name: IBilingual[];
  values: IBilingual[];
  type?: string | 'text/dropdown';
  isFilterable?: boolean;
  isMandatory?: boolean;
  isComparable?: boolean;
  isSortable?: boolean;
  useForRules?: boolean;
  lobid?: string;
  organizationId?: string;
}
export interface IProductGridItemProps {
  id?: string;
  item: IProductProps;
  onChange?: (product: any) => void | undefined;
  /**
   * Prop decides either page is called from clp results or home
   */
  page?: 'clpResults' | 'sclp' | 'home';
}

const ProductGridItem = (props: any) => {
  const router = useRouter();
  /**
   * Badge attributes are displayed next to product thumb
   * @param attributes
   */
  const getBadgeAttributes = (item) => {
    const badgeAttributes: any = [];
    if (item.type === b2cTypes.servicing) {
    } else if (item.type === b2cTypes.tyres) {
      badgeAttributes.push(
        {
          label: 'Fuel Efficiency',
          value: item.efficiency,
        },
        {
          label: 'Noise',
          value: item.noise,
        },
      );
    } else if (item.type === b2cTypes.batteries) {
      badgeAttributes.push({
        label: 'Warranty',
        value: item.warranty,
      });
      // } else if (item.type === b2cTypes.air_conditioning) {
    } else if (item.type === b2cTypes.accessories) {
      badgeAttributes.push({
        label: 'Warranty',
        value: item.warranty,
      });
    }
    return (
      badgeAttributes?.length > 0 &&
      badgeAttributes.map((attribute, index) => {
        return (
          attribute.value !== '0' && (
            <li key={index}>
              <span className="productBadge">{attribute.value}</span>
              <p>{attribute.label}</p>
            </li>
          )
        );
      })
    );
  };

  /**
   * Primary attributes displayed under product title
   * @param attributes
   */
  const getPrimaryAttributes = (item) => {
    let output = '';
    if (item.type === b2cTypes.servicing) {
    } else if (item.type === b2cTypes.tyres) {
      output = `${item.width ?? '-'}/${parseInt(item.profile ?? '-', 0)}/${item.rim ?? '-'}/${
        item.speedRating ?? ''
      }`;
    } else if (item.type === b2cTypes.batteries) {
      output = `${item.cca}/${item.voltage}`;
      // } else if (item.type === b2cTypes.air_conditioning) {
    } else if (item.type === b2cTypes.accessories) {
      output = `Warranty ${item.warranty}`;
    }
    return output;
  };

  /**
   * Attributes displayed in the body
   * @param attributes
   */
  const getSecondaryAttributes = (item) => {
    let output = '';
    if (item.type === b2cTypes.servicing) {
    } else if (item.type === b2cTypes.tyres) {
      output = `${item.sapPattern ?? ''} ${item.sapDot ?? ''}`;
    } else if (item.type === b2cTypes.batteries) {
      // } else if (item.type === b2cTypes.air_conditioning) {
    } else if (item.type === b2cTypes.accessories) {
    }
    return output;
  };

  /**
   * Navigate to PDP page
   * @param product product object
   * @param position is the index of the array on which products are showing
   */
  const handleOnClick = (e, product: any, position: any) => {
    getGlobalEventTrigger(CLASSIFICATION_INTEREST);

    const category: string = getCategoryFromURL();
    const variant: string = product?.id; // getProductVariant(product.primaryAttributes, product.type);
    const list: string = '';

    // When user clicks through on product tile
    window?.['dataLayer'].push({
      event: 'productClick',
      ecommerce: {
        click: {
          products: [
            {
              name: product?.name || '',
              id: product?.id || '',
              price: product?.retailPrice || '',
              brand: product?.name || '',
              list: list.concat('PLP', ' ', product?.type) || '',
              category: category || '',
              variant: variant || '',
              position: position || '',
              'Product - OEM': '',
              'Product - offer': '',
              ProductStockStatus: product?.stockStatus || '',
            },
          ],
        },
      },
    });

    const url = `${ROUTES.productDetails}/${Buffer.from(product.name).toString('base64')}`;
    let query = getQueryStringParams(location.search);
    query = `category=${b2cTypesToCategoryTypes[query.type || product.type]}&id=${product.id}`;
    router.push({
      query,
      pathname: url,
    });
  };
  const { item, id, isComparable, itemLength } = props;
  const isComparableResult = isComparable && item?.isComparable;
  item.brand = brandLogo;
  const gridBody = (
    <>
      {item.hasOffer && (
        <div className="offerBlock">
          <p>Special Offer</p>
          <p>{item?.hasOffer}</p>
        </div>
      )}
      <div className="productGridItem__thumbContainer">
        {item && item?.image && item?.image !== '' ? (
          <img
            className="brandLogo"
            src={imgRefactorURI(item?.image)}
            alt={item?.name} // Need to change the 'image' from string to object
            // alt={item.image?.alternativeText} // Need to change the 'image' from string to object
            onError={defaultImageThumbSrc}
          />
        ) : (
          <img src={pathTodefaultImageThumb} alt="defaultThumb" onError={defaultImageThumbSrc} />
        )}
        <ul className="badgeList">{getBadgeAttributes(item)}</ul>
      </div>
      <div className="productGridItem__contentBlock">
        <div>
          {item?.brandImage && (
            <img
              className="brandLogo"
              src={imgRefactorURI(item?.brandImage)}
              alt={''}
              onError={defaultImageThumbSrc}
            />
          )}

          <h4>{item?.name || item?.sapPattern}</h4>
          <p className="attributes" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="bold" style={{ fontSize: '15px', color: 'var(--color-slate-grey)' }}>
              {getPrimaryAttributes(item)}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--color-slate-grey)' }}>
              {item.sapDot ? `Year: ${item.sapDot}` : ''}
            </span>
          </p>
          <p className="attributes attributes--secondary bold">
            <span style={{ fontSize: '14px', color: 'var(--color-slate-grey)' }}>
              {getSecondaryAttributes(item)}
            </span>
          </p>
          <div className="pricingBlock fittedPrice">
            {item.minPrice && (
              <p>
                <span style={{ fontSize: '13px', color: 'var(--color-slate-grey)' }}>
                  {item?.priceTitle ?? 'Fully fitted price'}
                  {item?.retailPrice !== item?.minPrice ? ` was ${item?.currencyCode}` : ''}{' '}
                </span>
                {item?.retailPrice !== item?.minPrice ? (
                  <span
                    style={{ fontSize: '13px', color: 'var(--color-slate-grey)' }}
                    className="strikeThrough bold pl-2"
                  >
                    {' '}
                    {item.retailPrice}{' '}
                  </span>
                ) : (
                  <></>
                )}
              </p>
            )}
            {item.minPrice && (
              <React.Fragment>
                <p>{item.priceTitle} </p>
                <p>
                  <span className="mainPrice">
                    {item.currencyCode} {item.minPrice}
                  </span>{' '}
                  <span style={{ fontSize: '13px', color: 'var(--color-slate-grey)' }}>inc VAT</span>
                </p>
              </React.Fragment>
            )}
          </div>
        </div>
        <div>
          <p className="d-flex justify-content-end">
            {item?.type !== CATEGORY_TYPE_SERVICE &&
              router.pathname !== '/productComparisonDetail' &&
              itemLength > 1 && (
                <span className="bold compareBox">
                  <CheckboxCustom
                    id={`compareCheckbox-${props.id}`}
                    label="Compare"
                    atRight={router.locale === 'en'}
                    isChecked={item?.isChecked}
                    onChange={(e) => {
                      e?.stopPropagation?.();
                      if (props.onChange) {
                        props.onChange(item);
                      }
                    }}
                  />
                </span>
              )}
          </p>
          <AppButton
            text="Buy Now"
            shape="rectangular"
            variant="filled"
            disabled={!item.quantity}
            onClick={(e) => handleOnClick(e, item, id)}
          />
        </div>
      </div>
    </>
  );
  return gridBody;
};

export default ProductGridItem;
