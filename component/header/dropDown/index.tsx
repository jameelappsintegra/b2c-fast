import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/router';
import { clearAllLocalData } from 'libs/utils/localStorage';
import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const DropDownMenu = (props) => {
  const { customName } = props;
  const router = useRouter();
  const { instance } = useMsal();
  const dispatch = useDispatch();

  const handleLogout = () => {
    instance.logoutPopup().then(() => {
      sessionStorage.removeItem('idTokenMyAccount');
      sessionStorage.removeItem('guestUser');
      // Cookies.remove('idTokenMyAccount', { path: '/' });
      dispatch({ type: 'CHECK_CUSTOMER', payload: {} });
      router.push({
        pathname: '/',
      });
    });
    clearAllLocalData();
  };
  const redirecturl = (url) => {
    router.push({
      pathname: url,
    });
  };
  return (
    <Dropdown
      className="dropDownMenu"
      key="down"
      id="dropdown-button-drop-down"
      drop="down"
      alignRight={true}
    >
      <Dropdown.Toggle variant="link" className="iconDropdown">
        <FontAwesomeIcon icon={faUser} style={{ width: '16px' }} color="#009fe3" />
        <span className="mx-2">{customName}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          as="button"
          onClick={() => {
            redirecturl('/account/details');
          }}
        >
          Account
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            redirecturl('/account/orders');
          }}
        >
          Orders
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          className="logout"
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropDownMenu;
