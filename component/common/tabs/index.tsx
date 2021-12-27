import * as React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import classNames from 'classnames';

export interface ITabsCustomItemProps {
  title: string | React.ReactNode;
  key: string;
  children: React.ReactNode;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface ITabsCustomProps {
  /**
   * Provide unique id of each tab component to avoid conflict
   */
  id: string;
  /**
   * Width of each tab, where 'full' means tab items will consume whole container width while 'auto' is self explanatory
   */
  width?: 'auto' | 'full';
  defaultActiveKey: string | any;
  tabs: ITabsCustomItemProps[] | any;
  onClick?: (defaultTab: number) => void;
}

const TabsCustom = (props: ITabsCustomProps) => {
  const tabList = props?.tabs.map((item, index) => (
    <Tab
      key={index}
      eventKey={item.key}
      title={item.title}
      tabClassName={`${classNames({
        auto: props.width === 'auto',
        full: props.width === 'full',
      })}`}
    >
      {item.children}
    </Tab>
  ));
  return (
    <Tabs
      defaultActiveKey={props.defaultActiveKey}
      id="controlled-tab-example"
      className="customTabs"
      onSelect={(e) => {
        if (props.onClick) {
          // subtract 1 as tab index start from 1 and tabsArr starts from 0
          props.onClick(Number(e) - 1);
        }
      }}
    >
      {tabList}
    </Tabs>
  );
};

export default TabsCustom;
