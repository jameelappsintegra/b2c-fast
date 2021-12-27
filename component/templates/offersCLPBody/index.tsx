import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SectionOffersCarousel from '/components/templates/sectionOffersCarousel';
import { OFFERS_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import { useRouter } from 'next/router';
import { OFFERS_SECTION_CONTENT } from '/store/actions/types';
import { normalizeOffersData } from '/utilities/utils';
import { toTitleHeadCase } from 'libs/utils/global';
import Head from 'next/head';

const OffersCLPBody = (props: any) => {
  const dispatch = useDispatch();
  const router: any = useRouter();

  const [state, setState] = useState<any>({});

  const offersSectionContent = useSelector((state: any) => state?.storeReducer?.offersSectionContent);

  useEffect(() => {
    getOffersSection();
  }, []);

  useEffect(() => {
    if (offersSectionContent) {
      // console.log('offersSectionContent', offersSectionContent);
      const data = normalizeOffersData(offersSectionContent);
      // console.log('offersSectionContent (normalized)', data);
      setState((prevState) => ({
        ...prevState,
        offersSection: data ?? {},
        offersSectionCategories: getOffersSectionCategories(data ?? {}),
      }));
    }
  }, [offersSectionContent]);

  const getOffersSection = () => {
    dispatch(
      commonFetch({
        URL: OFFERS_ENDPOINT,
        type: OFFERS_SECTION_CONTENT,
        method: 'GET',
      }),
    );
  };

  const getOffersSectionCategories = (data) => {
    const allUniqueCategories = Array.from(
      new Set(data.offers.map((obj) => obj.categoryNames).flat()),
    ).reverse();
    return allUniqueCategories;
  };

  return (
    <>
      <Head>
        <title>Offers - Al-Futtaim</title>
      </Head>
      {(state?.offersSectionCategories ?? []).map((category: string, index: number) => (
        <div key={index}>
          {state.offersSection?.offers?.length > 0 && (
            <SectionOffersCarousel
              subTextColor={'#000'}
              isDark={false}
              styles={{
                marginBottom: '2px',
              }}
              data={state.offersSection?.offers?.filter((offer: any) =>
                (offer?.categoryNames ?? []).indexOf(category) === -1 ? false : true,
              )}
              titleProps={{
                text: `Latest ${state.offersSection?.title} in ${toTitleHeadCase(category ?? '')}`,
              }}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default OffersCLPBody;
