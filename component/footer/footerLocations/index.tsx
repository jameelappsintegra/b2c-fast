import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { imgRefactorURI } from '/utilities/utils';
import { defaultImageThumbSrc, pathTodefaultImageThumb } from 'libs/utils/global';
let OwlCarousel: any = <></>;

const FooterLocations = (props: any) => {
  const { locations = [] } = props;

  return (
    <div className="footerLocations b-footer">
      <Row className="b-footer__bottomOuter">
        <Col xs={12}>
          <CarouselLocations items={locations} />
        </Col>
      </Row>
    </div>
  );
};

const CarouselLocations = ({ items }) => {
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    OwlCarousel = dynamic(import('react-owl-carousel'));
    // setTimeout(() => {setShowCarousel(true)}, 2000)
    if (OwlCarousel) {
      setShowCarousel(true);
    }
  }, []);

  const carouselResponsiveConfig = {
    0: {
      items: 1,
    },
    600: {
      items: 2,
    },
    1000: {
      items: 3,
    },
  };

  const carouselItem = items?.tabsList?.map((item: any, index: number) => (
    <div className="carouselLocations__clickableCarouselItem" key={index}>
      <h6 className="carouselLocations__title">{item.title}</h6>
      <Link href={item.name ? `/location/${item.name}` : '#'}>
        {item?.Thumbnail_image?.renditionList.find((item) => item.name === 'default').resourceUri ? (
          <img
            src={imgRefactorURI(
              item?.Thumbnail_image?.renditionList?.find((item) => item?.name === 'default')?.resourceUri,
            )}
            alt={item?.Thumbnail_image?.renditionList.find((item) => item.name === 'default').altText}
            onError={defaultImageThumbSrc}
          />
        ) : (
          <img src={pathTodefaultImageThumb} alt="defaultThumb" onError={defaultImageThumbSrc} />
        )}
      </Link>
      <Link href={item.name ? `/location/${item.name}` : '#'}>
        Services, opening times and location details
      </Link>
    </div>
  ));

  return (
    <>
      {showCarousel ? (
        <OwlCarousel
          items={items.totalItems}
          className="carouselLocations__owl-theme owl-theme"
          responsive={carouselResponsiveConfig}
          margin={16}
        >
          {carouselItem}
        </OwlCarousel>
      ) : (
        <span></span>
      )}
    </>
  );
};

export default FooterLocations;
