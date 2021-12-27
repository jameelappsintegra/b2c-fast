import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Section from 'components/common/section';
import SectionHero from 'components/common/sectionHero';
import SectionOffersCarousel from 'components/templates/sectionOffersCarousel';
import CustomAccordion from 'components/common/customAccordion';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import SectionProductDescription from 'components/templates/sectionProductDescription';
import ProductUnderHero from 'components/templates/productUnderHero';
import VideoSection from 'components/templates/sectionVideo';
import 'react-placeholder/lib/reactPlaceholder.css';
import {
  camelToTitleCase,
  getBilingualValue,
  getDiscountPercentage,
  getQueryStringParams,
  toTitleHeadCase,
  getProductVariant,
} from 'libs/utils/global';
import {
  normalizeFAQsData,
  normalizeOffersData,
  normalizeProductDetailsData,
  offersCatTypeLookup,
} from '/utilities/utils';
import { IProductDetailType } from '/types/productDetail';
import PdpPlaceholder from 'components/common/pdpPlaceholder';
import Placeholder from 'components/common/placeholder';
import TagManager from 'react-gtm-module';
import { commonFetch } from '/store/actions/thunk';
import {
  categoryTypesToB2cTypes,
  FAQS_ENDPOINT,
  OFFERS_FILTERED_ENDPOINT,
  PRODUCT_DETAILS_ENDPOINT,
} from '/config/config';
import { FAQS_CONTENT, OFFERS_SECTION_FILTERED_CONTENT, PRODUCT_DETAILS_CONTENT } from '/store/actions/types';
import Head from 'next/head';

const ProductDetail = ({ productName }) => {
  const props: IProductDetailType = {};

  const dispatch = useDispatch();
  const router = useRouter();

  const productDetailsContent = useSelector((state: any) => state?.storeReducer?.productDetailsContent);
  const faqsContent = useSelector((state: any) => state?.storeReducer?.faqsContent);
  const offersSectionFilteredContent = useSelector(
    (state: any) => state?.storeReducer?.offersSectionFilteredContent,
  );

  const [state, setState] = useState<any>({
    product: null,
    videoSection: null,
    // aboutSection: null,
    offersSection: null,
    faqsSection: null,
    isPdpLoaded: false,
  });
  // console.log(state, '-=-=-=-=-==-==-=');
  useEffect(() => {
    const queryParams = getQueryStringParams(window.location.search);
    dispatch(
      commonFetch({
        URL: PRODUCT_DETAILS_ENDPOINT(
          productName,
          categoryTypesToB2cTypes[queryParams?.category],
          queryParams?.id,
        ),
        type: PRODUCT_DETAILS_CONTENT,
        method: 'GET',
      }),
    );
    getOffersSection();
  }, []);

  useEffect(() => {
    if (productDetailsContent) {
      // console.log('productDetailsContent', productDetailsContent);
      const data = normalizeProductDetailsData(productDetailsContent);
      // console.log('productDetailsContent (normalized)', data);
      handleProductDetail(data);
    }
  }, [productDetailsContent]);

  useEffect(() => {
    if (faqsContent) {
      // console.log('faqsContent', faqsContent);
      const data = normalizeFAQsData(faqsContent);
      // console.log('faqsContent (normalized)', data);
      setState((prevState) => ({
        ...prevState,
        faqsSection: data ?? {},
      }));
    }
  }, [faqsContent]);

  useEffect(() => {
    if (offersSectionFilteredContent) {
      // console.log('offersSectionFilteredContent', offersSectionFilteredContent);
      const data = normalizeOffersData(offersSectionFilteredContent);
      // console.log('offersSectionFilteredContent (normalized)', data);
      const queryParams = getQueryStringParams(window.location.search);
      setState((prevState) => ({
        ...prevState,
        offersSection: data ? { ...data, category: queryParams?.category } : {},
      }));
    }
  }, [offersSectionFilteredContent]);

  const handleProductDetail = async (data) => {
    try {
      if (data) {
        const product = data?.product || {};
        if (Object.entries(product).length > 0) {
          // When the PDP is displayed

          const queryParams = getQueryStringParams(window.location.search);
          const category: string = queryParams?.type;
          const variant: string = getProductVariant(product.primaryAttributes, product?.type);
          window?.['dataLayer'].push({
            event: 'productDetails',
            ecommerce: {
              detail: {
                products: [
                  {
                    name: getBilingualValue(product?.name || []) || '',
                    id: product?.code || '',
                    price: product?.retailPrice || '',
                    brand: getBilingualValue(product?.brandAttribute.name || []) || '',
                    category: category || '',
                    quantity: product?.quantity || '',
                    variant: variant || '',
                    'Product - Coupon': '',
                    'Product - List Price': product?.retailPrice || '',
                    'Product - Discount Amount': product?.specialPrice.toString() || '',
                    'Product - Discount Percentage':
                      getDiscountPercentage(product?.specialPrice, product?.retailPrice) || '',
                    'Product - OEM': '',
                    'Product - Stock Status': product?.stockStatus || '',
                    'Product - Bundle Indicator': '',
                  },
                ],
              },
            },
          });
        }

        setState((prevState) => ({
          ...prevState,
          product: data,
          videoSection: data?.attributes?.ff_video_links,
          // aboutSection: data?.aboutSection,
          isPdpLoaded: true,
        }));
        getFAQsSection(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOffersSection = () => {
    const queryParams = getQueryStringParams(window.location.search);
    dispatch(
      commonFetch({
        URL: OFFERS_FILTERED_ENDPOINT(offersCatTypeLookup[queryParams?.category] ?? ''),
        type: OFFERS_SECTION_FILTERED_CONTENT,
        method: 'GET',
      }),
    );
  };

  const getFAQsSection = (data: any) => {
    const queryParams = getQueryStringParams(window.location.search);
    const subTypePimCodes = data?.categories && Object.keys(data?.categories);
    if (subTypePimCodes && subTypePimCodes.length > 0) {
      dispatch(
        commonFetch({
          URL: FAQS_ENDPOINT(queryParams?.category ?? '', subTypePimCodes?.[0] ?? ''),
          type: FAQS_CONTENT,
          method: 'GET',
        }),
      );
    }
  };

  const { product = {} } = state;

  return (
    <>
      <Head>
        <title>{product?.attributes?.ff_name?.value} - Al-Futtaim</title>
      </Head>
      <Placeholder togglePlaceholder={state?.isPdpLoaded} placeholderBody={PdpPlaceholder()}>
        <div className="productDetailPage">
          <SectionHero
            title={product?.attributes?.ff_name?.value}
            preTitle={{
              children: product?.preTitle,
              styles: { color: 'var(--color-azure)' },
            }}
          >
            <ProductUnderHero product={product} />
          </SectionHero>
          <>
            <SectionProductDescription product={product} />
          </>
          {/* TEMPORARILY COMMENTING. REMOVE IF NOT PART OF MVP */}
          {/* <Section
				titleProps={{
					text: '10k Mileage checklist',
				}}
				styles={{backgroundColor: 'var(--color-lightest-grey)'}}
			>
				<Container>
					<ChecklistAccordion data={checklistAccordionData} />
				</Container>
			</Section> */}
          {state?.videoSection && Object.entries(state.videoSection).length > 0 && (
            <VideoSection
              url={state?.videoSection?.value}
              titleProps={{
                text: camelToTitleCase(state?.videoSection?.label),
              }}
              isWistiaVideo={false}
            />
          )}
          {state?.faqsSection && state?.faqsSection?.faqs?.faqlist?.length > 0 && (
            <Section
              titleProps={{
                text: 'Frequently asked questions',
              }}
            >
              <Container>
                <CustomAccordion data={state?.faqsSection?.faqs?.faqlist} type="faq" />
              </Container>
            </Section>
          )}
          {/* {state?.aboutSection && Object.entries(state?.aboutSection?.attribute).length > 0 && (
        <Section
          titleProps={{
            text: state?.aboutSection?.title ?? '',
          }}
          styles={{ backgroundColor: 'var(--color-lightest-grey)' }}
        >
          <Container>
            <p>{getBilingualValue(state?.aboutSection?.attribute?.values)}</p>
          </Container>
        </Section>
      )} */}
          {state?.offersSection?.offers?.length > 0 && (
            <SectionOffersCarousel
              isDark={false}
              // styles={{ backgroundColor: 'var(--color-promo-background)' }}
              data={state?.offersSection?.offers}
              titleProps={{
                text: `Latest ${state?.offersSection?.title} in ${toTitleHeadCase(
                  state?.offersSection?.category,
                )}`,
                textColor: 'var(--color-black)',
              }}
            />
          )}
        </div>
      </Placeholder>
    </>
  );
};

export default ProductDetail;
export async function getServerSideProps(context) {
  const { productName } = context.query;

  return {
    props: { productName },
  };
}
