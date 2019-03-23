// module
import React, { PureComponent, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// local
import styles from './Code.module.css';

export default class Code extends PureComponent {
  
  static propTypes = {
    // the code to display
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
      PropTypes.array,
    ]),
    className: PropTypes.string,
    inline: PropTypes.bool,
    // the code's language
    lang: PropTypes.oneOf(['javascript']),
    onClick: PropTypes.func,
  }
  
  static defaultProps = {
    children: '',
    inline: true,
    onClick: () => {},
  }

  render() {
    let { children } = this.props;
    const { className, inline, onClick } = this.props;
    const computedClassNames = classnames(className, styles.code, {
      [styles.inline]: inline,
    });
    
    if (typeof children === 'object' && !isValidElement(children)) {
      const spaces = inline ? 0 : 2;
      children = JSON.stringify(children, null, spaces);
    }
    
    return (
      <pre onClick={ onClick } className={ computedClassNames }>
        <code>{ children }</code>
      </pre>
    );
  }

}
