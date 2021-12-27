import { useState, useEffect } from 'react';
import Placeholder from '/components/common/placeholder';
import SectionHero from '/components/common/sectionHero';
import BlogPlaceholder from './placeholders';
import AppButton from '/components/common/appButton';
import StaticTileListing from '/components/common/staticTileListing';
import Section from '/components/common/section';
import { Container, Figure } from 'react-bootstrap';
import { BASE_CMS_ENDPOINT, HEADER_FOOTER_ENDPOINT, OFFER_DETAILS_ENDPOINT } from '/config/config';
import { HEADER_FOOTER_CONTENT, OFFER_DETAILS_CONTENT } from '/store/actions/types';
import { useDispatch, useSelector } from 'react-redux';
import { commonFetch } from '/store/actions/thunk';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { imgRefactorURI } from '/utilities/utils';

const offerDetails = ({ offersName }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [state, setState] = useState<any>({});

  const offerDetailsContent = useSelector((state: any) => state?.storeReducer?.offerDetailsContent);

  console.log(offerDetailsContent?.articleList, 'offerDetailsContent?.articleList');

  useEffect(() => {
    dispatch(
      commonFetch({
        URL: `/bff/dxshort/home/Offers/${router.query.offersName}?&WCM_Page.ResetAll=TRUE&SRV=Page&subtype=json&presentationtemplate=AfterSales_Shared/OfferDetail`,
        type: OFFER_DETAILS_CONTENT,
        method: 'GET',
      }),
    );
  }, [router.query.offersName]);

  useEffect(() => {
    // Fetching Header/Footer...
    dispatch(
      commonFetch({
        URL: HEADER_FOOTER_ENDPOINT,
        type: HEADER_FOOTER_CONTENT,
        method: 'GET',
      }),
    );
  }, []);

  useEffect(() => {
    setIsPageLoaded(true);
  }, [offerDetailsContent]);

  const blog = {
    heroSection: {
      title: offerDetailsContent?.articleList?.[0].title,
      preTitle: '',
      postTitle: offerDetailsContent?.articleList?.[0].Sub_Heading,
    },
    contentSectionOne: {
      title: '',
      content: offerDetailsContent?.articleList?.[0].Article_Body,
      image: offerDetailsContent?.articleList?.[0].Hero_Image?.renditionList?.[0].resourceUri,
    },
    contentSectionTwo: {
      title: '',
      content: '',
    },
    featuresSection: {
      title: '',
      content: '',
      link: {
        title: '',
        url: '',
      },
      staticAttributes: [{}, {}],
    },
  };
  return (
    <>
      <Head>
        <title>{blog?.heroSection?.title} - Al-Futtaim</title>
      </Head>
      <Placeholder togglePlaceholder={isPageLoaded} placeholderBody={BlogPlaceholder()}>
        <SectionHero
          title={blog?.heroSection?.title}
          preTitle={{
            children: blog?.heroSection?.preTitle,
            styles: { color: 'var(--color-azure)' },
          }}
          postTitle={{
            children: blog?.heroSection?.postTitle,
          }}
        />

        {blog?.contentSectionOne &&
          Object.entries(blog.contentSectionOne).length > 0 &&
          !!blog?.contentSectionOne?.content && (
            <Section
              titleProps={{
                text: blog?.contentSectionOne?.title,
              }}
            >
              <Container>
                <span
                  dangerouslySetInnerHTML={{
                    __html: blog?.contentSectionOne?.content,
                  }}
                />
                {blog?.contentSectionOne?.image && (
                  <Figure className="blog_figure">
                    <Figure.Image
                      width={530}
                      height={595}
                      alt={blog?.heroSection?.title}
                      src={imgRefactorURI(blog?.contentSectionOne?.image)}
                    />
                  </Figure>
                )}
              </Container>
            </Section>
          )}

        {blog?.contentSectionTwo.title && Object.entries(blog.contentSectionTwo).length > 0 && (
          <Section
            titleProps={{
              text: blog?.contentSectionTwo?.title,
            }}
          >
            <Container>
              <span
                dangerouslySetInnerHTML={{
                  __html: blog?.contentSectionTwo?.content,
                }}
              />
            </Container>
          </Section>
        )}

        {blog?.featuresSection?.title && Object.entries(blog.featuresSection).length > 0 && (
          <Section
            className="sectionBlogFeatures"
            styles={{ backgroundColor: 'var(--color-lightest-grey)' }}
            titleProps={{
              text: blog?.featuresSection?.title,
            }}
          >
            <Container>
              {blog?.featuresSection?.staticAttributes?.length > 0 && (
                <StaticTileListing data={blog?.featuresSection?.staticAttributes} />
              )}
              <span
                className="section__richText"
                dangerouslySetInnerHTML={{
                  __html: blog?.featuresSection?.content,
                }}
              />

              {blog?.featuresSection?.link && (
                <AppButton
                  text={blog?.featuresSection.link?.title}
                  variant="filled"
                  url={blog?.featuresSection.link?.url}
                  shape="rounded"
                  isLarge
                  isCentered
                />
              )}
            </Container>
          </Section>
        )}
      </Placeholder>
    </>
  );
};

export default offerDetails;
