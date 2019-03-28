// modules
import React from 'react';
import PropTypes from 'prop-types';

// local
// import styles from './Icon.module.css';


const Icon = ({ className, type, onClick, style }) => (
  <span
    style={ style }
    onClick={ onClick }
    className={ `material-icons ${ className }` }>{ type }</span>
);

Icon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.shape({}),
  type: PropTypes.string,
};

Icon.defaultProps = {
  onClick: () => {},
};

export default Icon;
