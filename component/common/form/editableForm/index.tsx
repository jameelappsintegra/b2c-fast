import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import FormGroup from 'components/common/form/formGroup';
import FormCustom from 'components/common/form';
import {
  checkFormKeysValidStatus,
  validatePhoneNumber,
  VALIDATION_ERROR_CLASS,
} from 'libs/utils/formValidations';
import { INPUT_PHONE_NUMBER } from 'libs/utils/constants';

export interface IEditableFormProps {
  formJson: any;
  editable?: boolean;
  formType?: 'horizontal';
  onChange: (changedObj: object) => void | undefined;
}

const EditableForm = (props: IEditableFormProps) => {
  const [formValues = {}, setFormValues] = useState<any>(props.formJson);

  useEffect(() => {
    setFormValues(props.formJson);
  }, [props.formJson]);

  const formFields: any[] = [];
  Object.entries(formValues).map((key) => {
    let obj = {};
    if (typeof key[1] === 'object') {
      obj = { ...key[1], id: key[0] };
    }
    formFields.push(obj);
  });

  const staticFields = (field: any, index: number) => {
    let value = field?.formControl?.value || '';
    if (field?.formControl?.options && field?.formControl?.options?.length > 0) {
      const obj = field.formControl.options.find((opt: any) => opt.value === value);
      value = obj?.name || '';
    }
    return (
      <div key={`${field?.label}-${index}`}>
        <label>{field?.label || ''}:</label>
        <span>{value.length > 0 ? value : '-'}</span>
      </div>
    );
  };

  const checkInputValidStatus = (element: any) => {
    let isValid = true;
    if (element?.validations?.required) {
      isValid = element?.formControl?.value.trim() !== '' && isValid;
    }
    if (element?.validations?.minLength) {
      isValid = element?.formControl?.value.trim().length >= element?.validations?.minLength && isValid;
    }
    if (element?.validations?.maxLength) {
      isValid = element?.formControl?.value.trim().length <= element?.validations?.maxLength && isValid;
    }
    if (element?.validations?.isValidEmail) {
      isValid = element?.validations?.isValidEmail(element?.formControl?.value.trim()) && isValid;
    }
    if (element?.validations?.isValidText) {
      isValid = element?.validations?.isValidText(element?.formControl?.value) && isValid;
    }
    if (element?.validations?.isValidPhoneNumber) {
      isValid = element?.validations?.isValidPhoneNumber(element?.formControl?.value.trim()) && isValid;
    }
    if (element?.formControl?.name === INPUT_PHONE_NUMBER) {
      isValid = validatePhoneNumber.test(element?.formControl?.value.trim()) && isValid;
    }
    return isValid;
  };

  const checkFormValidStatus = (form: any) => {
    return checkFormKeysValidStatus(form);
  };

  const inputChangedHandler = (event: React.ChangeEvent<HTMLFormElement>, elementIdentifier: string) => {
    const formCopy = { ...formValues };
    const elementCopy = {
      ...formCopy[elementIdentifier],
    };
    elementCopy.formControl.value = event?.target?.value;
    elementCopy.touched = true;
    elementCopy.valid = checkInputValidStatus(elementCopy);
    formCopy[elementIdentifier] = elementCopy;
    const formValidStatus = checkFormValidStatus(formCopy);

    setFormValues(formCopy);

    if (props.onChange) {
      props.onChange({
        formValid: formValidStatus,
        formData: formCopy,
      });
    }
  };

  const editableFields = (field: any, index: number) => {
    const lg = props.formType === 'horizontal' ? 4 : 12;
    return (
      <Col md={12} lg={lg} key={`${field.id}-${index}`}>
        <FormGroup
          id={field.id}
          fieldLabel={field.label}
          info={field?.info}
          formControl={{
            ...field.formControl,
            className: !field.valid && field.touched ? VALIDATION_ERROR_CLASS : '',
            onChange: (event: React.ChangeEvent<HTMLFormElement>) => inputChangedHandler(event, field.id),
          }}
        />
      </Col>
    );
  };

  return (
    <>
      {props.editable ? (
        <FormCustom>
          <Form.Row className="row">{formFields.map((item, index) => editableFields(item, index))}</Form.Row>
        </FormCustom>
      ) : (
        formFields.map((item, index) => staticFields(item, index))
      )}
    </>
  );
};

export default EditableForm;
