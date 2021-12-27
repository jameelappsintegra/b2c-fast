import * as React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PersonalizeTab from 'components/templates/homeHeroPanel/personalizeTab';
import { BASE_URL } from 'libs/utils/constants';
export interface ICampaignTabsProps {
  heroSection: any[];
}

const CampaignTabs = (props: ICampaignTabsProps) => {
  const { heroSection = [] } = props;
  const defaultActiveTab = heroSection?.length && heroSection[0]?.id;

  const tabs =
    heroSection?.length > 0 &&
    heroSection.map((item: any, index: number) => {
      const tabId: number = parseInt(item?.id ?? 0, 0);
      return (
        <Tab
          className="campaignTabs__item"
          eventKey={item?.id?.toString()}
          key={index}
          title={item?.tabName}
          style={{
            backgroundImage: `url(${item?.body?.backgroundImage?.url})`,
          }}
        >
          {<PersonalizeTab tabIndex={index} {...item?.body} />}
        </Tab>
      );
    });

  const heropanelChangeDL = (heroSection, key) => {
    console.log('selected tab', heroSection.filter((it) => it.id === key)?.[0]);
    window?.['dataLayer'].push({
      event: 'homepageEvent',
      event_category: 'Homepage', // Static
      event_action: heroSection.filter((it) => it.id === key)?.[0].headline, // Captures the category of element,
      event_label: heroSection.filter((it) => it.id === key)?.[0]?.tabName, // Capture the Element user clicked
    });
  };

  return (
    <div className="d-flex flex-column campaignTabs">
      <Tabs
        id="homeHeroPanelTabs"
        className="campaignTabs__tabs"
        defaultActiveKey={defaultActiveTab}
        onSelect={(e) => {
          heropanelChangeDL(heroSection, e);
        }}
      >
        {tabs}
      </Tabs>
    </div>
  );
};

export default CampaignTabs;
