import React from 'react';
import { defaultImageThumb } from 'libs/utils/global';
import Link from 'next/link';
import { imgRefactorURI } from '/utilities/utils';

const BrandLogos = (props: any) => (
  <div className="brandLogos">
    {props?.data.map((item, index: number) => {
      return (
        <div key={index} className="brandLogos__item">
          <Link href={`/brand/${item?.name}`}>
            {item?.Thumbnail?.renditionList.find((item) => item.name === 'default').resourceUri ? (
              <img
                src={imgRefactorURI(
                  item?.Thumbnail?.renditionList.find((item) => item.name === 'default').resourceUri,
                )}
                alt={item?.Thumbnail?.renditionList.find((item) => item.name === 'default').altText}
                onError={defaultImageThumb}
              />
            ) : (
              <img src="/_next/static/image/images/placeholder.e34241f21532ccff6add9d36601a0172.jpg" />
            )}
          </Link>
        </div>
      );
    })}
  </div>
);

export default BrandLogos;
