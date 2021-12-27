import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SectionHero from '/components/common/sectionHero';
import LocationImages from 'components/templates/locationImages';
import { Container } from 'react-bootstrap';
import GoogleMap from '/components/common/googleMaps';
import { LOCATION_DETAILS_ENDPOINT, OFFERS_ENDPOINT } from '/config/config';
import { LOCATION_DETAILS_CONTENT, OFFERS_SECTION_CONTENT } from '/store/actions/types';
import SectionStaticCategoryListing from '/components/templates/sectionStaticCategoryListing';
import Head from 'next/head';
import { normalizeOffersData } from '/utilities/utils';
import SectionContact from '/components/templates/sectionContact';
import SectionOffersCarousel from '/components/templates/sectionOffersCarousel';
import { commonFetch } from '/store/actions/thunk';

const locationDetail = ({ locationName }) => {
  const dispatch = useDispatch();
  const [offersSection, setOffersSection] = useState<any>({} as any);
  const offersSectionContent = useSelector((state: any) => state?.storeReducer?.offersSectionContent);
  const locationDetailsContent = useSelector((state: any) => state?.storeReducer?.locationDetailsContent);
  useEffect(() => {
    // Fetching Offers Section...
    dispatch(
      commonFetch({
        URL: OFFERS_ENDPOINT,
        type: OFFERS_SECTION_CONTENT,
        method: 'GET',
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(
      commonFetch({
        URL: LOCATION_DETAILS_ENDPOINT(locationName),
        type: LOCATION_DETAILS_CONTENT,
        method: 'GET',
      }),
    );
  }, [locationName]);

  useEffect(() => {
    // setLocationDetails(LOCATION_DETAILS_CONTENT);
  }, [locationDetailsContent]);
  const data = locationDetailsContent?.location_details;
  console.log('Location Details for', data);

  useEffect(() => {
    if (offersSectionContent) {
      const data = normalizeOffersData(offersSectionContent);
      setOffersSection(data ?? {});
    }
  }, [offersSectionContent]);

  return (
    <>
      <Head>
        <title>{data?.title} - Al-Futtaim</title>
      </Head>

      {data && (
        <SectionHero
          title={data?.title}
          preTitle={{
            children: 'Service Centre',
            styles: { color: 'var(--color-azure)' },
          }}
        />
      )}
      <Container>
        <LocationImages images={data?.imageslist} />
      </Container>
      <SectionStaticCategoryListing
        servicesProps={data?.services_value}
        titleProps={{
          text: data?.services_label,
        }}
      />
      <div className="mapLocation">
        <GoogleMap embedMap={data?.google_embeed_map} />
      </div>
      <SectionContact {...data} />
      {offersSection && offersSection?.offers?.length > 0 && (
        <SectionOffersCarousel
          isDark={false}
          styles={{ backgroundColor: 'var(--color-promo-background)' }}
          data={offersSection.offers}
          titleProps={{
            text: offersSection.title,
            textColor: 'var(--color-white)',
          }}
        />
      )}
    </>
  );
};

export default locationDetail;
export async function getServerSideProps(context) {
  const { locationName } = context.query;

  return {
    props: { locationName },
  };
}
