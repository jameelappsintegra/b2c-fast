import * as React from 'react';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { useRouter } from 'next/router';

class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }
  render() {
    return (
      <Html dir={this.props.locale === 'ar' ? 'rtl' : 'ltr'}>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N6RZTL8');
          `,
            }}
          />
        </Head>
        <body dir={this.props.locale === 'ar' ? 'rtl' : 'ltr'}>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-N6RZTL8"
              height="0"
              width="0"
              style={{ display: 'red', visibility: 'hidden' }}
            ></iframe>
          </noscript>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
AppDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () => {
    return originalRenderPage({
      // eslint-disable-next-line react/display-name
      enhanceApp: (App: any) => (props) => <App {...props} />,
    });
  };

  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles)],
  };
};

export default AppDocument;
