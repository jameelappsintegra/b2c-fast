import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toTitleHeadCase } from 'libs/utils/global';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HEADER_FOOTER_ENDPOINT } from '/config/config';
import { commonFetch } from '/store/actions/thunk';
import { HEADER_FOOTER_CONTENT } from '/store/actions/types';

interface IDrawerProps {
  visible: boolean;
  onClick: () => void;
}
const Drawer = (props: IDrawerProps) => {
  const { visible } = props;

  //   const [active, setActive] = useState<string>("");
  const dispatch = useDispatch();
  const [sitemap, setSitemap] = useState([]);

  // Store data selection
  const headerFooterContent = useSelector((state: any) => state?.storeReducer?.headerFooterContent);

  useEffect(() => {
    // Fetching Header/Footer...
    dispatch(
      commonFetch({
        URL: HEADER_FOOTER_ENDPOINT,
        type: HEADER_FOOTER_CONTENT,
        method: 'GET',
      }),
    );
  }, []);

  useEffect(() => {
    const sitemapResult = headerFooterContent?.sitemap?.filter((itemData) => {
      return itemData?.visibility?.catalogue === 'show';
    });
    setSitemap(sitemapResult);
  }, [headerFooterContent]);

  const drawerList = (
    <ul className="drawer__navList">
      {sitemap &&
        sitemap.map((item: any, index: any) => (
          <li className="drawer__navList-item" key={index}>
            <Link
              key={index}
              // className={
              //   item.title === active ? "drawer__navList-item__active-nav" : ""
              // }
              href={item?.path ? `${item?.path.split('/')[3]}` : '#'}
              // onClick={props.onClick}
              // isActive={(match) => {
              //   if (match) {
              //     setActive(item.title);
              //     return true;
              //   }
              //   return false;
              // }}
            >
              {toTitleHeadCase(item.title)}
            </Link>
          </li>
        ))}
    </ul>
  );
  let drawerClasses = 'drawer__drawer d-sm-block d-md-none';
  if (visible) {
    drawerClasses = 'drawer__drawer drawer__drawer--visible d-sm-block d-md-none';
  }
  return (
    <nav className={drawerClasses}>
      <div className="drawer__drawer-header">
        {/* TEMPORARILY HIDDEN LANGUAGE */}
        <a href="#" style={{ color: 'var(--color-azure)' }}>
          {/* عربي */}
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            props.onClick();
          }}
        >
          <FontAwesomeIcon className="drawer__closeMenuButton" icon={faTimes} />
        </a>
      </div>
      {drawerList}
    </nav>
  );
};

export default Drawer;
