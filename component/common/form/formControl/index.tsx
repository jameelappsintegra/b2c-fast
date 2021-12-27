import React from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-datepicker/dist/react-datepicker.css';

export interface IFormControlProps {
  value?: string;
  defaultValue?: string | number;
  type?: string;
  min?: string;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
  isDropdown?: boolean;
  options?: any[];
  selectedDate?: any;
  readonly?: boolean;
  required?: boolean;
  className?: string;
  autocomplete?: boolean;
  noChoose?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLSelectElement>) => void;
  // onChange?: (event: React.FormEventHandler<HTMLInputElement>) => void | undefined
  // check which event should be used
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<any>, data?: any) => void;
}
const FormControl = (props: IFormControlProps) => {
  const {
    defaultValue = 'Choose',
    name,
    onChange,
    options = [],
    type,
    value,
    selectedDate,
    noChoose,
    className,
  } = props;

  let formControl;
  switch (type) {
    case 'date':
      formControl = (
        <React.Fragment>
          <div className="datePicker">
            <DatePicker
              selected={selectedDate}
              onChange={(date: any) => {
                if (props.onChange) {
                  props.onChange(date);
                }
              }}
            />
            <span className="datePicker__icon">
              <FontAwesomeIcon icon="calendar-alt" />
            </span>
          </div>
        </React.Fragment>
      );
      break;
    case 'text':
      formControl = <Form.Control {...props} />;
      break;
    case 'select':
      formControl = (
        <Form.Control
          as="select"
          name={name}
          value={value}
          onChange={(event) => onChange(event, props.options)}
          className={className}
        >
          {!noChoose && <option value="">{defaultValue !== '' ? defaultValue : 'Choose'}</option>}
          {options &&
            options.length > 0 &&
            options.map((option, index) => (
              <option key={`${option.value}-${index + 1}`} value={option.value}>
                {option.name}
              </option>
            ))}
        </Form.Control>
      );
      break;
    default:
      formControl = <Form.Control {...props} />;
      break;
  }

  /**
   * Below check is the backward compatibility.
   * Need to remove once all select form controls are replaced with switch case functionality
   */
  if (props.options && type === 'text') {
    formControl = (
      <Form.Control
        as="select"
        {...props}
        onChange={(event) => {
          if (props.onChange) {
            props.onChange(event);
          }
        }}
      >
        {options.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
      </Form.Control>
    );
  }

  return formControl;
};

export default FormControl;
