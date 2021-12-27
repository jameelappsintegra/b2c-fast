import AppButton from 'components/common/appButton';

const NotFound = () => (
  <>
    <section className="section notFoundWrapper">
      <h1>Page Not Found</h1>
      <p className="zoom-area">The page you are looking might does not exist.</p>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      <div className="link-container">
        <AppButton
          text="Go Home"
          shape="rounded"
          variant="filled"
          onClick={() => {
            window.location.replace('/');
          }}
        />
      </div>
    </section>
  </>
);

export default NotFound;
