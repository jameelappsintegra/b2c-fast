import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { commonFetch } from '/store/actions/thunk';
import { BRAND_DETAILS_CONTENT } from '/store/actions/types';
import Section from '/components/common/section';
import { Container } from 'react-bootstrap';
import StaticTileListing from '/components/common/staticTileListing';
import VideoSection from '/components/templates/sectionVideo';
import SectionHero from '/components/common/sectionHero';
import Placeholder from '/components/common/placeholder';
import BlogPlaceholder from 'pages/offer/placeholders';
import AppButton from '/components/common/appButton';

const Brand = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [state, setState] = useState<any>({});
  const headerFooterContent = useSelector((state: any) => state?.storeReducer?.headerFooterContent);
  const brandDetailsContent = useSelector((state: any) => state?.storeReducer?.brandDetailsContent);
  useEffect(() => {
    dispatch(
      commonFetch({
        URL: `/bff/dxshort/home/tyres/categories/our_tyres/brands/${router.query.brandName}?subtype=json&srv=cmpnt&cmpntname=AfterSales_Shared/render/brandcontent&WCM_Page.ResetAll=TRUE&source=library`,
        type: BRAND_DETAILS_CONTENT,
        method: 'GET',
      }),
    );
  }, [router.query.brandName]);

  useEffect(() => {
    // console.log("headerFooterContent", headerFooterContent);
    setState((prevState) => ({
      ...prevState,
      videoSection: headerFooterContent?.video,
    }));
    setIsPageLoaded(true);
  }, [headerFooterContent]);

  const blog = {
    heroSection: {
      title: brandDetailsContent?.articleList?.[0].Heading,
      preTitle: '',
      postTitle: brandDetailsContent?.articleList?.[0].Sub_Heading,
    },
    contentSectionOne: {
      title: brandDetailsContent?.articleList?.[0].title,
      content:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries',
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
        <title>{blog?.contentSectionOne?.title} - Al-Futtaim</title>
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
              </Container>
            </Section>
          )}

        {state.videoSection && (
          <VideoSection
            titleProps={{
              text: state.videoSection.Video_Title,
            }}
            url={state.videoSection.Video_Script}
          />
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

export default Brand;
