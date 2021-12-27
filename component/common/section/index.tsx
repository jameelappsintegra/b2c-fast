import * as React from 'react';
import Title, { ITitleProps } from '/components/common/section/title';

export interface ISectionProps {
  titleProps?: ITitleProps;
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  className?: string;
}

class Section extends React.Component<ISectionProps> {
  constructor(props: ISectionProps) {
    super(props);
  }

  render() {
    return (
      <section
        className={`section ${this.props.className ? this.props.className : ''}`}
        style={{ ...this.props.styles }}
      >
        {this.props.titleProps?.text && <Title {...this.props.titleProps} />}
        {this.props.children}
      </section>
    );
  }
}

export default Section;
