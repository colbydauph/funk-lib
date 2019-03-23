// modules
import React from 'react';
import PropTypes from 'prop-types';

// local
import styles from './Icon.module.css';


const Icon = ({ className, type }) => (
  <span className={ `material-icons ${ className }` }>{ type }</span>
);

Icon.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};

export default Icon;
