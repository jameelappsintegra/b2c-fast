import React from 'react';
/**
 * validation class name, it turns the input field into red
 */
export const VALIDATION_ERROR_CLASS = 'invalid';

export const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
);

export const validPasswordRegex = RegExp(
  /^.{8,20}$/, // limits charter length from 8 to 20
);

export const validateForm = (errors: any = {}) => {
  let valid = true;
  Object.values(errors).forEach((val: any) => val?.length > 0 && (valid = false));
  return valid;
};

/**
 * This fucntion is to validate text fields. It allows only alphabets and spaces
 */
export const validateTextFields = RegExp(/^[a-zA-Z ]*$/);

/**
 * This fucntion is to validate phone(mobile) field. It allows only digits and min/max length 10,
 * Used specifically for Dubai phone digits without country code and +
 */
export const validatePhoneNumber = RegExp(/^[0-9]{9,10}$/);

/**
 * Iterates over each form key and validate if its valid prop is true or false
 * @param form
 * @returns boolean
 */
export const checkFormKeysValidStatus = (form: any): boolean => {
  let formValid = true;
  for (const key in form) {
    if (form[key]) {
      formValid = form[key]?.valid && formValid;
    }
  }
  return formValid;
};

// export const FormErrors = ({ formErrors: any }) => (
//   <div className="formErrors">
//     {Object.keys(formErrors).map((fieldName, i) => {
//       if (formErrors[fieldName].length > 0) {
//         return (
//           <p key={i}>
//             {fieldName} {formErrors[fieldName]}
//           </p>
//         )
//       } else {
//         return ''
//       }
//     })}
//   </div>
// )
