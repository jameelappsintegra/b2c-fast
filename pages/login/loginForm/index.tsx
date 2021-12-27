import AppButton from '/components/common/appButton';
import FormCustom from '/components/common/form';
import FormGroup from 'components/common/form/formGroup';
import Card from 'components/common/card';

export interface LoginFormProps {}

const handleSubmit = () => {};
const LoginForm: React.SFC<LoginFormProps> = () => {
  return (
    <div className="loginCard--outer">
      {/* {isLoading && <Loader color={'var(--color-white)'} loading={isLoading} />} */}
      <Card
        header={{
          children: <span>Customer</span>,
          classes: 'd-none d-md-block',
        }}
      >
        <FormCustom onSubmit={handleSubmit}>
          <div className="formRow">
            <div>
              <FormGroup
                id="email"
                // fieldLabel="Email"
                formControl={{
                  name: 'email',
                  //   className: isValidForm.classWrongEmail,
                  type: 'email',
                  //   onChange: handleChange,
                }}
              />
            </div>
            <div>
              <FormGroup
                id="password"
                // fieldLabel="Password"
                formControl={{
                  name: 'password',
                  //   className: isValidForm.classWrongPassword,
                  type: 'password',
                  //   onChange: handleChange,
                }}
              />
            </div>
            <div className="login__buttonOuter">
              <AppButton
                variant="filled"
                type="submit"
                shape="rounded"
                text="Login"
                // disabled={
                //   isValidForm.classWrongEmail.length ||
                //   isValidForm.classWrongPassword.length ||
                //   !form?.email.length ||
                //   !form?.password.length
                // }
              />
            </div>
          </div>
        </FormCustom>

        <div className="text-center">
          <a
            className="login__forgottenLink"
            href="#"
            // onClick={(e) => {
            //   LoginService.resetPasswordMsal(e)
            //     .then((_resp: any) => {
            //       e.preventDefault();
            //       notification(
            //         NOTIFICATION_TYPE.info,
            //         MESSAGES.passwordChange.passwordChangedSuccess,
            //       );
            //       history.push({
            //         pathname: ROUTES.login,
            //       });
            //     })
            //     .catch((err: any) => {
            //       console.log(err);
            //     });
            // }}
          >
            Forgotten password?
          </a>
        </div>
      </Card>
      <div className="text-center">
        <a
          className="login__registerLink"
          href="#"
          //   onClick={(e) => {
          //     LoginService.loginMsal(e)
          //       .then(async (resp: any) => {
          //         e.preventDefault();
          //         const claimsResponse = resp.idToken;
          //         try {
          //           if (claimsResponse.rawIdToken) {
          //             const signUpResp = await Http.post(API_ENDPOINTS.signup, {
          //               idToken: claimsResponse.rawIdToken,
          //             });
          //             if (signUpResp) {
          //               await notification(
          //                 NOTIFICATION_TYPE.info,
          //                 MESSAGES.account.accountCreation,
          //               );
          //               if (window.location.pathname === ROUTES.checkoutJourney) {
          //                 history.push({
          //                   pathname: ROUTES.checkoutJourney,
          //                 });
          //               } else {
          //                 history.push({
          //                   pathname: ROUTES.login,
          //                 });
          //               }
          //             } else {
          //               history.push({
          //                 pathname: ROUTES.default,
          //               });
          //             }
          //           } else {
          //             history.push({
          //               pathname: ROUTES.login,
          //             });
          //             notification(NOTIFICATION_TYPE.error, MESSAGES.defaultError);
          //           }
          //         } catch (error) {
          //           if (
          //             error.hasOwnProperty('data') &&
          //             typeof error?.data === 'object' &&
          //             Array.isArray(error?.data?.messages)
          //           ) {
          //             notification(
          //               NOTIFICATION_TYPE.error,
          //               error.data.messages[0]?.message,
          //             );
          //           } else {
          //             notification(NOTIFICATION_TYPE.error, error.messages[0]?.message);
          //           }
          //           console.log(error);
          //         }
          //       })
          //       .catch((err: any) => {
          //         console.log(err);
          //       });
          //   }}
        >
          I need to register for an account
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
