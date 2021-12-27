import React from 'react';
import { Modal } from 'react-bootstrap';
import CustomIFrame, { ICustomIFrameProps } from 'components/common/customIframe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

// const Lightbox = require('../../../../node_modules/react-popupbox')
// const ReactPlayer = require('../../../../node_modules/react-player/youtube')

export interface IVideoLightBoxLinkProps {
  linkText: string;
  videoUrl?: string;
  showHide?: boolean;
  iFrame?: ICustomIFrameProps;
}

export interface IVideoLightBoxLinkState {
  showHide?: boolean;
  iFrame?: ICustomIFrameProps;
}

class VideoLightBoxLink extends React.Component<IVideoLightBoxLinkProps, IVideoLightBoxLinkState> {
  constructor(props: IVideoLightBoxLinkProps) {
    super(props);
    this.state = {
      showHide: props.showHide,
      iFrame: {
        width: '100%',
        height: '500px',
        frameBorder: '0',
        src: 'https://www.youtube.com/embed/PBktSo0bXas',
        allow: 'accelerometer; autoplay;',
      },
    };
  }

  handleModalShowHide(event: any) {
    event.preventDefault();
    this.setState({
      showHide: !this.state.showHide,
    });
  }

  render() {
    return (
      <div className="videoLightBoxLink text-center">
        <a href="#" onClick={(e: any) => this.handleModalShowHide(e)}>
          {this.props.linkText} <FontAwesomeIcon icon={faPlayCircle} size="xs" style={{ width: '16px' }} />
        </a>

        <Modal show={this.state.showHide} onEscapeKeyDown={(e: any) => this.handleModalShowHide(e)}>
          <Modal.Body>
            <Modal.Header closeButton onClick={(e) => this.handleModalShowHide(e)} />
            <CustomIFrame {...this.state.iFrame} />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default VideoLightBoxLink;
