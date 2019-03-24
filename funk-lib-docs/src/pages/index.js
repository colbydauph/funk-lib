// modules
import React, { Component } from 'react';
import { fromPairs, sortBy, prop, curry } from 'ramda';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
// import { graphql } from "gatsby"

import Card from '../components/Card';
import NavList from '../components/NavList';
import MenuBar from '../components/MenuBar';

import styles from './index.module.css';
import '../global.module.css';

export const debounce = curry((delay, fn) => {
  let timeoutID;
  return (...args) => {
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn(...args);
      timeoutID = null;
    }, delay);
  };
});

const parseQueryString = url => {
  return fromPairs(url
    .replace(/^\?/, '')
    .split('&')
    .map(str => str.split('=')));
};

const serializeQuery = query => {
  return Object
    .entries(query)
    .map(([key, val]) => `${ key }=${ val }`)
    .join('&');
};

export default class Index extends Component {
  
  static propTypes = {
    data: PropTypes.shape(),
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
  }
  static defaultProps = {
    data: {},
    location: {},
  }
    
  handleQuery = value => {
    const { pathname, search } = this.props.location;
    const nextQuery = {
      ...parseQueryString(search),
      q: encodeURIComponent(value),
    };
    navigate(`${ pathname }?${ serializeQuery(nextQuery) }`);
  }
  
  render() {
    const { data } = this.props;
    const { q: query = '' } = parseQueryString(this.props.location.search);
    
    const docs = sortBy(prop('path'), data.site.siteMetadata.jsdocs);
    
    return (
      <div className={ styles.index }>
        <NavList
          className={ styles.navList }
          query={ decodeURIComponent(query) }
          onQuery={ this.handleQuery }
          jsdocs={ docs } />
        <div className={ styles.content }>{
          docs
            .filter(_ => _)
            .map(doc => (
              <div key={ doc.path }>
                <div
                  className={ styles.id }
                  id={ doc.path.replace(/\//g, '.') }
                >
                  { doc.path.replace(/\//g, '.') }
                </div>
                <Card
                  onQuery={ this.handleQuery }
                  doc={ doc } />
              </div>
            ))
          
        }</div>
        <MenuBar
          className={ styles.menuBar }
          version={ data.site.siteMetadata.version } />
      </div>
    );
  }
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        version
        jsdocs {
          path
          sig
          examples
          kind
          description
          deprecated
          url
          ignore
        }
      }
    }
  }
`;
