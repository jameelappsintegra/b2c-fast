import * as React from 'react';
import { Form } from 'react-bootstrap';

export interface IFormCustomProps {
  method?: any;
  action?: any;
  ref?: any;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
  children?: React.ReactNode;
  className?: string;
}

const FormCustom = (props: IFormCustomProps) => {
  const { className = '' } = props;
  return (
    <div className="customForm__formOuter">
      <Form
        ref={props?.ref}
        method={props?.method}
        action={props?.action}
        className={`customForm ${className}`}
        onSubmit={props.onSubmit ? props.onSubmit : undefined}
      >
        {props.children}
      </Form>
      <div className="clear_left" />
    </div>
  );
};

export default FormCustom;
