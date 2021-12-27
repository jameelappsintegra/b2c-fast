import Section from 'components/common/section';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const SectionStaticCategoryListing = (props) => {
  const { servicesProps } = props;
  return (
    <>
      <Section className="sectionStaticCategoryListing" titleProps={props.titleProps}>
        <Container>
          <StaticTileListing props={servicesProps} />
        </Container>
      </Section>
    </>
  );
};

const StaticTileListing = (servicesProps) => {
  return (
    <>
      <div className="staticTileListing">
        <ul>
          {servicesProps &&
            servicesProps?.props?.split(',').map((item, index) => (
              <li key={index}>
                <span>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span>{item}</span>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};
export default SectionStaticCategoryListing;
