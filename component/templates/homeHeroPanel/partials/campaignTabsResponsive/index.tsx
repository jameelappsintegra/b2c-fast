import React, { useState, useEffect } from 'react';
// import OwlCarousel from 'react-owl-carousel';
import dynamic from 'next/dynamic';
import { Col } from 'react-bootstrap';
import PersonalizeTab from 'components/templates/homeHeroPanel/personalizeTab';
import { ICampaignTabsProps } from '../campaignTabs';

let OwlCarousel: any = <></>;
const CampaignTabsResponsive = (props: ICampaignTabsProps) => {
  const [showCarousel, setShowCarousel] = useState(false);
  useEffect(() => {
    OwlCarousel = dynamic(import('react-owl-carousel'));
    OwlCarousel = dynamic(import('react-owl-carousel-autoheight'));
    // setTimeout(() => {setShowCarousel(true)}, 2000)
    if (OwlCarousel) {
      setShowCarousel(true);
    }
  }, []);

  const { heroSection = [] } = props;
  const carouselItems =
    heroSection?.length > 0 &&
    heroSection.map((item: any, index: number) => (
      <PersonalizeTab key={index} tabIndex={index} {...item?.body} />
    ));

  return (
    <Col className="campaignTabsResponsive">
      {showCarousel ? (
        <OwlCarousel
          items={1}
          autoHeight={true}
          className="campaignTabsResponsive__owlTheme owl-theme"
          margin={8}
        >
          {carouselItems}
        </OwlCarousel>
      ) : (
        <span></span>
      )}
    </Col>
  );
};

export default CampaignTabsResponsive;
