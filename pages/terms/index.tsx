import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { commonFetch } from '../../store/actions/thunk';
import { TERMS_CONDITIONS_ENDPOINT } from '/config/config';
import SectionHero from '/components/common/sectionHero';
import { Container } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';

const termsCondition = (props: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [state] = useState<any>({});

  const termsConditionContent = useSelector((state: any) => state?.storeReducer?.termsConditionContent);
  console.log(termsConditionContent, 'blog content------');
  useEffect(() => {
    dispatch(
      commonFetch({
        URL: TERMS_CONDITIONS_ENDPOINT,
        type: 'TERMS_CONDITIONS',
        method: 'GET',
      }),
    );
  }, []);

  return (
    <>
      <Head>
        <title>Terms and Condition - Al-Futtaim</title>
      </Head>
      <SectionHero
        title={termsConditionContent?.articleList[0].title}
        postTitle={{
          children: termsConditionContent?.articleList[0].Heading,
        }}
      />
      <section className="section">
        <Container>
          {
            <div>
              <span>{ReactHtmlParser(termsConditionContent?.articleList[0].Article_Body)}</span>
            </div>
          }
        </Container>
      </section>
    </>
  );
};
export default termsCondition;
