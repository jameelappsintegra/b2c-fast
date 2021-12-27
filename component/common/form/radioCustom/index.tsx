import * as React from 'react';
import { Form } from 'react-bootstrap';

export interface IRadioCustomProps {
  id: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void | undefined;
  label?: string;
  name: string;
  value: string;
  isChecked?: boolean;
}

const RadioCustom = (props: IRadioCustomProps) => (
  <div className="custom-radio">
    <Form.Check
      custom
      type="radio"
      name={props.name}
      value={props.value}
      id={props.id}
      label={props.label}
      checked={props.isChecked}
      onChange={props.onChange}
    />
  </div>
);

export default RadioCustom;
