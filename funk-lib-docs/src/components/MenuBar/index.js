// modules
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

// local
import styles from './MenuBar.module.css';

import github from '../../images/github.svg';


const MenuBar = ({ className, version }) => (
  <div className={ `${ styles.menuBar } ${ className }` }>
    <h2>
      <Link className={ styles.home } to={ '/' }>{ 'funk-lib' }</Link>
      <span className={ styles.version }>{ `v${ version }` }</span>
    </h2>
    <a href={ 'https://github.com/colbydauph/funk-lib' } target={ '_new' }>
      <img className={ styles.github } src={ github } />
    </a>
  </div>
);

MenuBar.propTypes = {
  className: PropTypes.string,
  version: PropTypes.string,
};

export default MenuBar;
