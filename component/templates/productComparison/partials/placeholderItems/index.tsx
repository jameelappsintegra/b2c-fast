import React from 'react';
import ComparisonItem from '../comparisonItem';

const PlaceholderItems = (props) => {
  const { placeholderCount } = props;
  const placeHolderItems: any = [];
  if (placeholderCount) {
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < placeholderCount; i++) {
      placeHolderItems.push(<ComparisonItem key={i} item={{}} onClick={(e) => {}} hasCloseIcon={true} />);
    }
  }
  return placeHolderItems;
};

export default PlaceholderItems;
