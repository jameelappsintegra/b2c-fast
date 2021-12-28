import TagManager from 'react-gtm-module';

export const init = () => {
  const tagManagerArgs = {
    gtmId: 'GTM-N6RZTL8',
  };

  TagManager.initialize({
    ...tagManagerArgs,
  });
};

export const CLASSIFICATION_INTENT = 'intent';
export const CLASSIFICATION_INTEREST = 'interest';
export const CLASSIFICATION_DATA = 'data';
export const CLASSIFICATION_CONVERSION = 'conversion';

export type IClassificationTypeProps =
  | typeof CLASSIFICATION_INTENT
  | typeof CLASSIFICATION_INTEREST
  | typeof CLASSIFICATION_DATA
  | typeof CLASSIFICATION_CONVERSION;

export interface IGlobalEventClassification {
  classification: IClassificationTypeProps;
}
