import * as React from 'react';
import { Row } from 'react-bootstrap';
import CampaignTabs from './partials/campaignTabs';
import CampaignTabsResponsive from './partials/campaignTabsResponsive';

export interface IHomeHeroPanelProps {
  heroSection: any[];
}

const HomeHeroPanel = (props: IHomeHeroPanelProps) => {
  return (
    <div className="homeHeroPanel">
      <Row className="d-block d-sm-block d-md-none">
        <CampaignTabsResponsive heroSection={props.heroSection} />
      </Row>
      <div className="d-none d-md-block">
        <CampaignTabs heroSection={props.heroSection} />
      </div>
    </div>
  );
};

export default HomeHeroPanel;
