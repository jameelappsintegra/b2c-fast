import { faBars, faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { BASE_CMS_ENDPOINT } from '/config/config';
import { CHECKOUT_JOURNEY } from '/store/actions/types';
import { imgRefactorURI } from '/utilities/utils';

const Toolbar = (props: any) => {
  const dispatch = useDispatch();
  const [itemscount, setItemscount] = useState('initialState');

  const logoUrl = props?.logo?.items ? props?.logo?.items?.Brand_logo : '';
  // const itemsCount = useSelector((state: any) => state?.storeReducer?.itemsCount || 0);
  useEffect(() => {
    let productFromPDPPage: any = localStorage?.getItem('cartItems');
    productFromPDPPage = productFromPDPPage ? JSON.parse(productFromPDPPage) : {};
    setItemscount(productFromPDPPage?.length);
    // storeBasketItemsCount(basketData[0]?.items.length);
  }, []);
  const storeBasketItemsCount = (itemsCount: number) => {
    dispatch({
      type: CHECKOUT_JOURNEY,
      payload: {
        itemsCount,
        type: 'itemsCount',
      },
    });
  };
  return (
    <div className="toolbar__header">
      {props.logo && (
        <a href="\">
          <img src={imgRefactorURI(logoUrl)} alt="logo" />
        </a>
      )}
      <ul className="toolbar__iconList">
        {/* TEMPORARILY HIDDEN LANGUAGE */}
        {/* <li className="d-none d-md-block">
					<Link onClick={toggleBilingual}>
						<span>عربي</span>
					</Link>
				</li> */}
        <li>
          <a href=" ">
            {itemscount && <span className="basketCount">{itemscount}</span>}
            <FontAwesomeIcon icon={faShoppingCart} size="xs" />
          </a>
        </li>

        {/* {isAuthenticated ? (
          <li className="accountAvtar">
            <DropDownMenu />
          </li>
        ) : ( */}
        <li>
          <a href=" ">
            <FontAwesomeIcon icon={faUser} size="xs" />
          </a>
        </li>
        {/* )} */}
        <li>
          <a
            href=" "
            // onClick={() => {
            //   handleSearchToggle();
            // }}
          >
            <FontAwesomeIcon icon={faSearch} size="xs" />
          </a>
        </li>
        <li
          onClick={(e) => {
            e.preventDefault();
            props.onClick();
          }}
        >
          <a href=" ">
            <FontAwesomeIcon icon={faBars} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Toolbar;
