import GoogleMapReact from 'google-map-react';
import GoogleMarker from './marker';
import { GOOGLE_API_KEY } from '/utilities/constants';

const GoogleMap = (props) => {
  const { embedMap } = props;
  // const data = props?.props?.split(',');
  // let lat = data && parseFloat(data[0]);
  // let lng = data && parseFloat(data[1]);
  return (
    <div
      style={{ height: 'auto', width: '100%' }}
      dangerouslySetInnerHTML={{
        __html: embedMap,
      }}
    >
      {/* {lat && lng && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
          defaultCenter={{
            lat,
            lng,
          }}
          defaultZoom={12}
        >
          <GoogleMarker marker={'marker'} />
        </GoogleMapReact>
      )} */}
    </div>
  );
};

export default GoogleMap;
