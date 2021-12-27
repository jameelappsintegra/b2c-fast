import React from 'react';
import { Container } from 'react-bootstrap';
import { ITitleProps } from '/components/common/section/title';
import Section from '/components/common/section';
import Head from 'next/head';
import CustomIFrame from '/components/common/customIframe';

export interface IVideoSectionProps {
  titleProps: ITitleProps;

  /**
   * Temporarily setting attribute as optional is we have to map strapi data at many places.
   * Once strapi data mapped everywhere then this prop can be set as mandatory
   */
  url?: string;
  isWistiaVideo?: boolean;
}

const VideoSection = (props: IVideoSectionProps) => {
  const { titleProps, url = '', isWistiaVideo = true } = props;
  const iframeProps: any = {
    width: '100%',
    height: isWistiaVideo ? 'auto' : '550px',
    frameBorder: '0',
    src: url,
    allow: 'accelerometer; autoplay;',
  };

  const youtubeEmbedURLPrefix = 'https://www.youtube.com/embed/';
  return (
    <>
      {isWistiaVideo && (
        <Head>
          {(props?.url ?? '')
            ?.match(/<script src=[\\]*\".*?\"/gi)
            ?.map((src) => src.replace(/(<script src=)|(\")/gi, ''))
            ?.map((src, index) => (
              <script src={src} async={true} key={index}></script>
            ))}
        </Head>
      )}
      {titleProps.text && (
        <Section
          titleProps={titleProps}
          styles={{
            backgroundColor: 'var(--color-light-grey)',
          }}
        >
          <Container>
            <div className="videoPlayer text-center">
              {isWistiaVideo ? (
                <div
                  {...iframeProps}
                  dangerouslySetInnerHTML={{ __html: iframeProps?.src ?? '' }}
                  style={{ width: '100%' }}
                />
              ) : (
                <CustomIFrame
                  {...iframeProps}
                  src={
                    iframeProps?.src?.indexOf('watch') === -1
                      ? iframeProps?.src?.indexOf('youtu.be') !== -1
                        ? youtubeEmbedURLPrefix + iframeProps?.src?.split('/')?.pop()
                        : iframeProps?.src ?? ''
                      : iframeProps?.src ?? ''
                  }
                />
              )}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
};
export default VideoSection;
