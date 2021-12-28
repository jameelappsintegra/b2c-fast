/**
 * Notifications for whole website
 */

export const MESSAGES = {
  cart: {
    itemAdded: 'Item added successfully!',
    invalidQuantity: 'Enter valid quantity and try again',
    quantityLimit: 'Minimum quantity should be one',
    itemRemoved: 'Item removed successfully!',
    itemNotRemoved: 'Item not removed. Try again!',
    itemQtyUpdated: 'Item quantity updated',
    itemNotUpdated: 'Item not updated. Try again!',
  },
  login: {
    loginSuccess: 'Login successful!',
    accessDeny: 'Incorrect email/password. Please try again.',
    invalidEmail: 'Email is not valid!',
    invalidPassword: 'Password must be at least 8 characters long',
    invalidFormData: 'Enter valid email and password to login',
  },
  logout: {
    logoutSuccess: 'Logout successful!',
  },
  passwordChange: {
    passwordChangedSuccess: 'Password changed successfully!',
    passwordChangedError: 'Password does not change, Try again!',
  },
  account: {
    error: 'Error creating account. Try again!',
    accountCreation: 'Account created successfully!',
    noPreferenceSelected: 'No preference selected.',
  },
  profile: {
    success: 'Account details updated successfully!',
  },
  order: {
    orderCreationSuccess: 'Congratulations! Your order has placed successfully.',
    orderPlacingFailure: 'There was an error while placing your order. Please, try again!',
  },
  appointment: {
    noLocation: 'No Matching Location',
  },
  defaultError: 'Something went wrong. Try again!',
  defaultSuccess: 'Updated successfully!',
  checkout: {
    checkoutInvalid: 'Please fill all required fields.',
  },
  payment: {
    paymentInvalid: 'Please select at least one payment type to continue!',
  },
};
