import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { commonFetch } from '../../store/actions/thunk';
import SectionHero from '/components/common/sectionHero';
import { Container } from 'react-bootstrap';
import { PRIVACY_POLICY_ENDPOINT } from '/config/config';
import ReactHtmlParser from 'react-html-parser';

const PrivacyPolicy = (props: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [state, setState] = useState<any>({});

  useEffect(() => {
    dispatch(
      commonFetch({
        URL: PRIVACY_POLICY_ENDPOINT,
        type: 'PRIVACY_POLICY',
        method: 'GET',
      }),
    );
  }, []);
  const privacyPolicyContent = useSelector((state: any) => state?.storeReducer?.privacyPolicyContent);
  return (
    <>
      <Head>
        <title>Privacy policy - Al-Futtaim</title>
      </Head>
      <SectionHero
        title={privacyPolicyContent?.articleList[0].Heading}
        postTitle={{
          children: privacyPolicyContent?.articleList[0].Sub_Heading,
        }}
      />

      <section className="section">
        <Container>
          {
            <div>
              <span>{ReactHtmlParser(privacyPolicyContent?.articleList[0].Article_Body)}</span>
            </div>
          }
        </Container>
      </section>
    </>
  );
};
export default PrivacyPolicy;
