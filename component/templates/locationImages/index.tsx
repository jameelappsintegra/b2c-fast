import { defaultImageThumb, defaultImageThumbSrc, pathTodefaultImageThumb } from 'libs/utils/global';
import { imgRefactorURI } from '/utilities/utils';

const LocationImages = (props: any) => {
  const { images } = props;
  const galleryImages = () => {
    return (
      images &&
      images.map((item, index: number) => (
        <div className="locationImages__item" key={index.toString()}>
          {item?.renditionList.find((item) => item.name === 'default').resourceUri ? (
            <img
              // src={item?.renditionList.find((item) => item.name === 'default').resourceUri}
              src={imgRefactorURI(item?.renditionList?.find((item) => item?.name === 'default')?.resourceUri)}
              alt={item?.renditionList.find((item) => item.name === 'default').altText}
              onError={defaultImageThumb}
            />
          ) : (
            <img src={pathTodefaultImageThumb} alt="defaultThumb" onError={defaultImageThumbSrc} />
          )}
        </div>
      ))
    );
  };
  return <div className="locationImages">{galleryImages()}</div>;
};

export default LocationImages;
