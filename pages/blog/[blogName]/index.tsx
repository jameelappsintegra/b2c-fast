import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { commonFetch } from '../../../store/actions/thunk';
import { BLOG_CONTENT_ENDPOINT } from '/config/config';
import { normalizeOffersData } from '/utilities/utils';
import SectionHero from '/components/common/sectionHero';
import Placeholder from '/components/common/placeholder';
import BlogPlaceholder from 'pages/offer/placeholders';
import { Container } from 'react-bootstrap';
import SectionOffersCarousel from '/components/templates/sectionOffersCarousel';
import AppButton from '/components/common/appButton';
import ReactHtmlParser from 'react-html-parser';

const Blog = (props: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [state, setState] = useState<any>({});
  const offersSectionContent = useSelector((state: any) => state?.storeReducer?.offersSectionContent);
  const blogContent = useSelector((state: any) => state?.storeReducer?.blogContent);
  console.log(blogContent, 'blog content------');
  useEffect(() => {
    if (router?.query?.blogName) {
      dispatch(
        commonFetch({
          URL: `/bff/dxshort/home/sharedcontent/Footer/vehicle_care/looking_after_your_vehicle/${router?.query?.blogName}?WCM_Page.ResetAll=TRUE&SRV=Page&subtype=json&presentationtemplate=AfterSales_Shared%2Fcontentdetail`,
          type: 'BLOG_CONTENT',
          method: 'GET',
        }),
      );
    }
  }, [router?.query?.blogName]);

  useEffect(() => {
    // console.log(offersSectionContent?.articleList?.[0], 'brndDetailsContent---');
    if (offersSectionContent) {
      const data = normalizeOffersData(offersSectionContent);
      setState((prevState) => ({
        ...prevState,
        offersSection: data ?? {},
      }));
    }
    setIsPageLoaded(true);
  }, [offersSectionContent]);
  return (
    <>
      <Head>
        <title>Vehicle Care - Al-Futtaim</title>
      </Head>
      <Placeholder togglePlaceholder={isPageLoaded} placeholderBody={BlogPlaceholder()}>
        <SectionHero
          title={blogContent?.contentdetails?.[0]?.Heading}
          preTitle={{ children: 'Vehicle Care' }}
        >
          <Container>
            <b>{blogContent?.contentdetails?.[0]?.Sub_Heading}</b>
          </Container>
        </SectionHero>
        <Container>
          <section>
            <h3 className="title__text text-center">
              <span className="separator "></span>
              {blogContent?.contentdetails?.[0]?.Section_1_headline}
            </h3>
            {ReactHtmlParser(blogContent?.contentdetails?.[0]?.Section_1_body)}
          </section>
        </Container>
        <section className="section">
          <h3 className="title__text text-center" style={{ background: 'var(--color-light-grey)' }}>
            <div>
              <span className="separator"></span>
              {blogContent?.contentdetails?.[0]?.Video_title}
            </div>
          </h3>
          <div style={{ background: 'var(--color-light-grey)' }}>
            {blogContent?.contentdetails?.[0]?.Video_Script}
          </div>
        </section>
        <Container>
          <section>
            <Container>
              <h3 className="title__text text-center">
                <span className="separator "></span>
                {blogContent?.contentdetails?.[0]?.Section_2_headline}
              </h3>
              <span className="separator "></span>
              {ReactHtmlParser(blogContent?.contentdetails?.[0]?.Section_2_body)}
            </Container>
          </section>
        </Container>
        <section className="blog_cnt" style={{ background: 'var(--color-light-grey)' }}>
          <Container>
            <h3 className="title__text text-center">
              <span className="separator "></span>
              {blogContent?.contentdetails?.[0]?.Feature_checlist_headline}
            </h3>
            <div style={{ background: 'var(--color-white)', padding: '20px', margin: '0 0 20px 0' }}>
              {ReactHtmlParser(blogContent?.contentdetails?.[0]?.Feature_checlist_items)}
            </div>
            {ReactHtmlParser(blogContent?.contentdetails?.[0]?.Feature_checlist_body)}
            <div className="text-center" style={{ padding: '0 0 30px 0' }}>
              <AppButton
                variant="filled"
                type="submit"
                shape="rounded"
                text={blogContent?.contentdetails?.[0]?.CTA_label}
              />
              <div className="sectionHero__preTitle">
                {blogContent?.contentdetails?.[0]?.Others_queries_headline}
              </div>
              <span style={{ color: 'var(--color-azure)' }}>
                {blogContent?.contentdetails?.[0]?.Other_queries_subhead}
              </span>
            </div>
          </Container>
        </section>

        <section>
          {state.offersSection?.offers?.length > 0 && (
            <SectionOffersCarousel
              isDark
              styles={{ backgroundColor: 'var(--color-promo-background)' }}
              data={state.offersSection?.offers}
              titleProps={{
                text: state.offersSection?.title,
                textColor: 'var(--color-white)',
              }}
            />
          )}
        </section>
      </Placeholder>
    </>
  );
};
export default Blog;
