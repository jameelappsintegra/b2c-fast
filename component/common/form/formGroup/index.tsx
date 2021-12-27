import React from 'react';
import { Form } from 'react-bootstrap';
import classNames from 'classnames';
import FormControl, { IFormControlProps } from '../formControl';

export interface IFormGroupProps {
  id: string;
  formControl: IFormControlProps;
  fieldLabel?: string;
  labelColor?: string;
  info?: React.ReactNode | any;
  /** Form group styles */
  groupStyles?: React.CSSProperties;
  /** Whether or not the field is optional */
  isOptional?: boolean;
  noChoose?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormGroup = (props: IFormGroupProps) => (
  <Form.Group controlId={props.id} style={props.groupStyles}>
    {props.fieldLabel && (
      <Form.Label
        style={{ color: props.labelColor && props.labelColor }}
        className={`${classNames({
          optional: props.isOptional,
        })}`}
      >
        {props.fieldLabel}
      </Form.Label>
    )}
    <FormControl {...props.formControl} />
    {props.info && <Form.Text className="text-muted" dangerouslySetInnerHTML={{ __html: props.info }} />}
  </Form.Group>
);

export default FormGroup;
