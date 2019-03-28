// modules
import React, { Component, Fragment } from 'react';
import {
  curry,
  filter,
  fromPairs,
  join,
  map,
  pipe,
  prop,
  replace,
  sortBy,
  split,
  toPairs,
} from 'ramda';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';

// local
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

const parseQueryString = pipe(
  replace(/^\?/, ''),
  split('&'),
  map(split('=')),
  filter(([key]) => key),
  fromPairs,
);

const serializeQuery = pipe(
  toPairs,
  map(join('=')),
  join('&'),
);


const docHash = doc => doc.path.replace(/\//g, '.');

export default class Index extends Component {
  
  static propTypes = {
    data: PropTypes.shape(),
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
      hash: PropTypes.string.isRequired,
    }),
  }
  static defaultProps = {
    data: {},
    location: {},
  }
    
  handleQuery = value => {
    const { search, hash } = this.props.location;
    const nextSearch = serializeQuery({
      ...parseQueryString(search),
      q: encodeURIComponent(value),
    });
    navigate(`/?${ nextSearch }${ hash }`);
  }
  
  handleLinkClick = doc => event => {
    event.preventDefault();
    const { search } = this.props.location;
    navigate(`/${ search }#${ docHash(doc) }`);
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
          onLinkClick={ this.handleLinkClick }
          getLink={ doc => `/#${ docHash(doc) }` }
          jsdocs={ docs } />
        <div className={ styles.content }>{
          docs
            .filter(_ => _)
            .map(doc => (
              <Fragment key={ doc.path }>
                <div
                  className={ styles.id }
                  id={ docHash(doc) }
                >
                  { docHash(doc) }
                </div>
                <Card
                  onLinkClick={ this.handleLinkClick(doc) }
                  link={ `/#${ docHash(doc) }` }
                  collapse={ (doc.kind === 'module') }
                  onQuery={ this.handleQuery }
                  doc={ doc } />
              </Fragment>
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
