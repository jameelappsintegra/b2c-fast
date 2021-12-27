import React, { useEffect, useState } from 'react';
// import OwlCarousel from 'react-owl-carousel';
import dynamic from 'next/dynamic';
let OwlCarousel: any = <></>;
import classNames from 'classnames';
import TagManager from 'react-gtm-module';
import {
  defaultImageThumbSrc,
  pathTodefaultImageThumb,
  getGlobalEventTrigger,
} from '../../../../libs/utils/global';
import { CLASSIFICATION_INTEREST } from '../../../../libs/utils/gtm';
import Link from 'next/link';
import { imgRefactorURI } from '/utilities/utils';

export interface IOffersCarouselProps {
  data?: any[];
  isDark?: boolean;
  subTextColor?: any;
}

const OffersCarousel = (props: IOffersCarouselProps) => {
  const [showCarousel, setShowCarousel] = useState(false);
  const homePagerOffersDL = (item) => {
    console.log('selected tab offers');
    window?.['dataLayer'].push({
      event: 'homepageEvent',
      event_category: 'Homepage', // Static
      event_action: 'offers', // Captures the category of element,
      event_label: item?.link?.title, // Capture the Element user clicked
    });
  };
  const carouselResponsiveConfig = {
    0: {
      items: 1,
    },
    700: {
      items: 2,
    },
  };
  const { data = [], isDark = true, subTextColor = '' } = props;

  useEffect(() => {
    const offers = props?.data || [];
    if (offers.length > 0) {
      const promotions = offers.map((offer, index) => {
        return {
          id: offer?.link?.url.split('/').pop() || '',
          name: offer?.title || '',
          creative: offer?.description || '',
          position: index.toString() || '',
          thumbnails: offer?.renditionList ?? '',
        };
      });
      // When an offer/promo tile is displayed
      TagManager.dataLayer({
        dataLayer: {
          event: 'promotionView',
          ecommerce: {
            promoView: {
              promotions,
            },
          },
        },
      });
    }
  }, [props.data]);

  useEffect(() => {
    OwlCarousel = dynamic(import('react-owl-carousel'));
    // setTimeout(() => {setShowCarousel(true)}, 2000)
    if (OwlCarousel) {
      setShowCarousel(true);
    }
  }, []);

  const promotionClick = (offer: any, index: number) => {
    getGlobalEventTrigger(CLASSIFICATION_INTEREST);
    // When an offer/promo tile is displayed
    TagManager.dataLayer({
      dataLayer: {
        event: 'promotionClick',
        ecommerce: {
          promoClick: {
            promotions: [
              {
                id: offer?.link?.url.split('/').pop() || '',
                name: offer?.title || '',
                creative: offer?.description || '',
                position: index.toString() || '',
              },
            ],
          },
        },
      },
    });
  };
  const linkFormat = (link) => {
    const pop = link?.split('/').pop();
    return /offer/ + pop;
  };
  const carouselItem = data.map((item: any, index: number) => {
    return (
      <div className="itemContainer" key={index}>
        {item.title && (
          <h6 className="title" style={{ color: subTextColor }}>
            {item?.title}
          </h6>
        )}
        <div>
          <div className="thumbContainer">
            <div className="placeholder" />
            <div className="thumbContainer__imageOuter">
              {item?.thumbnails?.length ? (
                <img
                  src={imgRefactorURI(item.thumbnails[0].resourceUri)}
                  alt=""
                  onError={defaultImageThumbSrc}
                />
              ) : (
                <img src={pathTodefaultImageThumb} alt="defaultThumb" onError={defaultImageThumbSrc} />
              )}
            </div>
          </div>
        </div>

        {item?.link?.url ? (
          <Link
            // onClick={() => {
            //   promotionClick(item, index);
            // }}
            href={linkFormat(item?.link?.url)}
          >
            <a
              onClick={() => {
                homePagerOffersDL(item);
              }}
            >
              {item?.link?.title || 'View offer'}
            </a>
          </Link>
        ) : (
          <Link href="#">
            <a
              onClick={(e) => {
                promotionClick(item, index);
                homePagerOffersDL(item);
              }}
            >
              {item?.link?.title || 'View offer'}
            </a>
          </Link>
        )}
      </div>
    );
  });

  // console.log("data", data, carouselItem, showCarousel); // ahsan

  return (
    <div className={`carousel ${classNames({ 'carousel--light': !isDark })}`}>
      {showCarousel ? (
        <OwlCarousel items={2} className="owl-theme" margin={16} responsive={carouselResponsiveConfig}>
          {carouselItem}
        </OwlCarousel>
      ) : (
        <span></span>
      )}
    </div>
  );
};
export default OffersCarousel;
