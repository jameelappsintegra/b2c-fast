import Title from '/components/common/section/title';
import { Col, Row } from 'reactstrap';
import { BASE_CMS_ENDPOINT } from '/config/config';
import { imgRefactorURI } from '/utilities/utils';

const UniqueSellingProposition = (props: any) => {
  const { data = [], backgroundImage = {} as any, titleProps = {} as any } = props;
  return (
    <section className="usp">
      <Row className="mr-0 g-0">
        <Col md={12} xl={4}>
          <div
            className="usp__imagePlaceholder"
            style={{
              backgroundImage: `url(${BASE_CMS_ENDPOINT + backgroundImage})`,
            }}
          />
        </Col>
        <Col md={12} xl={8}>
          <div className="usp__contentSide">
            <Title text={titleProps?.text} textAlign={titleProps?.textAlign} />
            <ul className="usp__list">
              {data?.length > 0 &&
                data.map((item, index) => (
                  <li key={index}>
                    <div className="iconOuter">
                      <img src={imgRefactorURI(item?.icon)} />
                    </div>
                    <div className="contentOuter">
                      <h3>{item?.title}</h3>
                      <p>{item?.description}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default UniqueSellingProposition;
