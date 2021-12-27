import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IProductAttributeProps } from '../productGridItem';
import { getBilingualValue } from 'libs/utils/global';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export interface IStaticTileListingProps {
  data: IProductAttributeProps[] | any[];
}

const StaticTileListing = (props: IStaticTileListingProps | any) => {
  const servicesList =
    props?.data &&
    (props?.data as IProductAttributeProps[] | any[]).map((item, index: number) => {
      if ((item as any)?.name && typeof item?.name === 'string') {
        return (
          <li key={index}>
            <span>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span>{item?.name}</span>
          </li>
        );
      }
      return (
        <li key={index}>
          <span>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span>{getBilingualValue((item as IProductAttributeProps).values)}</span>
        </li>
      );
    });

  return (
    <>
      <div className="staticTileListing">
        <ul>{servicesList}</ul>
      </div>
    </>
  );
};

export default StaticTileListing;
