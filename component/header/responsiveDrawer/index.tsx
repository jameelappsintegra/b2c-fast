import { useState } from 'react';
import Drawer from './drawer';
import Toolbar from './toolbar';

const ResponsiveDrawer = (items) => {
  const [sideDrawerOpen, setsideDrawerOpen] = useState(false);
  const handleDrawerToggle = () => {
    setsideDrawerOpen(!sideDrawerOpen);
  };

  return (
    <div className="responsiveDrawer">
      {items && <Toolbar onClick={handleDrawerToggle} logo={items} />}
      <Drawer visible={sideDrawerOpen} onClick={handleDrawerToggle} />
    </div>
  );
};

export default ResponsiveDrawer;
