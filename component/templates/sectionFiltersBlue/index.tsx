import React from 'react';
import { Col, Container, Form } from 'react-bootstrap';
import FormCustom from 'components/common/form';
import FormGroup from 'components/common/form/formGroup';
import Section from 'components/common/section';

export interface ISectionFiltersBlueProps {
  filters?: ISectionFiltersBlueItemProps[];
  onSelect?: any;
}

export interface ISectionFiltersBlueItemProps {
  title?: string;
  label?: string;
  options?: string[];
}

class SectionFiltersBlue extends React.Component<ISectionFiltersBlueProps, {}> {
  getselectedValue = (event) => {
    this.props.onSelect(event.target.value);
    console.log('event', event.target.value);
    // tslint:disable-next-line: semicolon
  };

  render() {
    return (
      <>
        <Section
          className="sectionFiltersBlue"
          // styles={{
          //   backgroundColor: 'var(--color-azure)',
          // }}
        >
          <Container>
            <FormCustom>
              <Form.Row>
                {this.props.filters &&
                  this.props.filters.map((item, index) => (
                    <div className="sectionFiltersBlue__item" key={index}>
                      <h3>{item.title}</h3>
                      <FormGroup
                        id={`label-${index}`}
                        fieldLabel={item.label}
                        labelColor="var(--color-white)"
                        formControl={{
                          type: 'select',
                          options: item.options,
                          onChange: (event) => this.getselectedValue(event),
                        }}
                      />
                    </div>
                  ))}
              </Form.Row>
            </FormCustom>
          </Container>
        </Section>
      </>
    );
  }
}

export default SectionFiltersBlue;
