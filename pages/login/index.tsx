import Head from 'next/head';
import { useEffect, useState } from 'react';

import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from 'components/pages/login/loginForm';
import AppButton from '/components/common/appButton';
import Title from '/components/common/section/title';
import { b2cPolicies, loginRequest } from '/config/authConfig';
import { useRouter } from 'next/router';
import { ROUTES } from '/utilities/constants';
import SectionHero from '/components/common/sectionHero';

export interface LoginProps {}

const Login: React.SFC<LoginProps> = () => {
  const isAuthenticated = useIsAuthenticated();

  // const isAuthenticated: boolean = useIsAuthenticated();
  const { instance } = useMsal();
  const router = useRouter();

  const loginDataLayer = (res) => {
    window?.['dataLayer'].push({
      event: 'afterPageview',
      brand: 'Fastfit', // Fastfit _ dynamic value has to be capture
      environment: res.account.environment, // live or staging
      language: 'en', // ar
      region: 'UAE', // KSA
      login: 'true', // Boolean (true if logged in, false if not)
      userId: res?.account.uniqueId, // Capture User ID from cookie
      alfuttaimId: 'xxxxx', // Pass unique customer id if user is logged in
    });
  };
  const loginClickDL = () => {
    window?.['dataLayer'].push({
      event: 'accountEvent',
      event_category: 'Account',
      event_action: 'Login',
      event_label: window.location.pathname, // dynamc
    });
  };
  const registrationClickDL = () => {
    window?.['dataLayer'].push({
      event: 'accountEvent',
      event_category: 'Account',
      event_action: 'Registration',
      event_label: window.location.pathname, // Optional
    });
  };
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     localStorage.isAuthenticated = true;
  //     router.push({
  //       pathname: ROUTES.accountOrders,
  //     });
  //   }
  // }, [isAuthenticated]);

  const handleLogin = () => {
    loginClickDL();
    instance
      .loginPopup(loginRequest)
      .then((res) => {
        console.log('signin', res);
        if (res) {
          loginDataLayer(res);
        }
        router.push({
          pathname: ROUTES.accountOrders,
        });
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  };
  const handleRegister = () => {
    registrationClickDL();
    instance
      .loginPopup(b2cPolicies.authorities.signUp)
      .then((res) => {
        const idToken = res.idToken;
        console.log(res, 'res---->>');
        // sessionStorage.setItem('idTokenMyAccount', authTokenObj);
        sessionStorage.setItem('idTokenMyAccount', idToken);
        // Cookies.remove('idTokenMyAccount', { path: '/' });
        // addToast(mesg, {
        //   appearance: 'success',
        //   autoDismiss: true,
        // });
        // addToast(`You are successfully logged in`, {
        //   appearance: 'success',
        //   autoDismiss: true,
        // });
        router.push({
          pathname: ROUTES.accountOrders,
        });
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  };
  const handleLogout = () => {
    instance.logoutPopup().then((res) => {
      // sessionStorage.removeItem('idTokenMyAccount');
      // sessionStorage.removeItem('guestUser');
      // Cookies.remove('idTokenMyAccount', { path: '/' });
    });
  };
  return (
    <SectionHero>
      <Head>
        <title>Login - Al-Futtaim</title>
      </Head>
      <div className="login">
        <Title text="Register or Login to My Account" />
        <Container>
          <Row>
            <Col sm="6">
              <LoginForm title="Register for a new account" buttonText="Register" onclick={handleRegister} />
            </Col>
            <Col sm="6">
              <LoginForm title="Already a customer" buttonText="Login" onclick={handleLogin} />
            </Col>
          </Row>
        </Container>
      </div>
    </SectionHero>
  );
};

export default Login;
