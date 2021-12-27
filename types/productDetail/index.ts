interface ILanguage {
  name: string;
  code: string;
}
interface IBilingual {
  language: ILanguage | string;
  value: string;
}
interface IProductPriceProps {
  price: number;
  priceType?: string | 'Special' | 'Retail';
  unitOfMeasure?: string;
  productId?: string;
  currencyCode?: string;
  locationId?: number;
  id?: string;
}
interface IProductInventoryProps {
  id?: string;
  productId?: string;
  locationId?: number;
  organizationId?: string;
  lobId?: string;
  unitOfMeasure?: string;
  quantity: number;
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
interface IProductProps {
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
export interface IProductDetailType {
  products?: IProductProps[];
  location?: any;
}
