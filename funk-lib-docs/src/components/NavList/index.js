import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import * as R from 'ramda';
// import { StaticQuery, graphql } from 'gatsby';

import Icon from '../Icon';
import styles from './NavList.module.css';

// a ->
const chainPairs = R.curry((pred, obj) => {
  return R.fromPairs(R.chain(pred, R.toPairs(obj)));
});

// { /* <StaticQuery
//   query={ graphql`
//     query SiteTitleQuery {
//       site {
//         siteMetadata {
//           title
//         }
//       }
//     }
//   ` }
//   render={ data => (
//     <>
//       <Header siteTitle={ data.site.siteMetadata.title } />
//       <div
//         style={{
//           margin: '0 auto',
//           maxWidth: 960,
//           padding: '0px 1.0875rem 1.45rem',
//           paddingTop: 0,
//         }}
//       >
//         <main>{children}</main>
//         <footer>
//           © {new Date().getFullYear()}, Built with
//           {' '}
//           <a href="https://www.gatsbyjs.org">Gatsby</a>
//         </footer>
//       </div>
//     </>
//   ) }
// /> */ }

// eslint-disable-next-line no-useless-escape
export const escapeRegExpStr = R.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

const matches = query => doc => {
  if (doc.ignore) return false;
  return new RegExp(escapeRegExpStr(query), 'gi').test(doc.path);
  // || (doc.sig || '').toLowerCase().includes(query.toLowerCase());
};

const nestDocs = R
  .reduce((out, doc) => R.assocPath(
    R.intersperse('members', doc.path.split('/')),
    doc,
    out
  ), {});
  
const flattenDocs = (docs) => {
  return R.chain(([path, doc]) => {
    return [
      { ...doc, members: undefined },
      ...flattenDocs(doc.members),
    ];
  }, R.toPairs(docs));
};

const filter = R.curry((match, docs) => {
  return chainPairs(([path, doc]) => {
    const selfMatches = match({ ...doc, path: doc.path });
    const members = doc.members
      ? filter(match, doc.members)
      : {};
    if (selfMatches || Object.keys(members).length) {
      return [[path, { ...doc, members }]];
    }
    return [];
  }, docs);
});

const NavList = ({
  className,
  jsdocs,
  query,
  onQuery,
  onLinkClick,
  getLink,
}) => {
  
  return (
    <div className={ `${ styles.navList } ${ className }` }>
      <div className={ styles.query }>
        <input
          placeholder={ 'Filter' }
          value={ query }
          // eslint-disable-next-line react/jsx-no-bind
          onChange={ ({ target: { value } }) => onQuery(value) } />
        <Icon
          className={ styles.searchIcon }
          style={{ cursor: (query ? 'pointer' : 'null') }}
          onClick={ (query ? _ => onQuery('') : null) }
          type={ (query ? 'close' : 'search') } />
      </div>
      <ul className={ styles.docs }>
        {
          R.applyTo(jsdocs, R.pipe(
            nestDocs,
            filter(matches(query)),
            flattenDocs,
          ))
            .map((jsdoc, i, arr) => (
              <li
                className={ `${ styles.path } ${ (jsdoc.kind === 'module' ? styles.module : '') }` }
                key={ jsdoc.path }
                
              >
                <Link
                  className={ styles.link }
                  onClick={ onLinkClick(jsdoc) }
                  to={ getLink(jsdoc) }
                  style={{
                    borderBottom: jsdoc.kind === 'module' && (arr[i + 1] && arr[i + 1].kind === 'module')
                      ? 'none'
                      : undefined,
                    // borderTop: jsdoc.kind === 'module' && (!i || (arr[i - 1] && arr[i - 1].kind === 'module'))
                    //   ? 'none'
                    //   : undefined,
                  }}
                >
                  { jsdoc.kind === 'module' ? jsdoc.path : R.last(jsdoc.path.split('/')) }
                </Link>
              </li>
            ))
        }
      </ul>
    </div>
  );
};

NavList.propTypes = {
  className: PropTypes.string,
  getLink: PropTypes.func,
  jsdocs: PropTypes.arrayOf(PropTypes.shape({})),
  onLinkClick: PropTypes.func,
  onQuery: PropTypes.func,
  query: PropTypes.string,
};

NavList.defaultProps = {
  jsdocs: {},
  onQuery: () => {},
  onLinkClick: () => () => {},
  getLink: () => {},
};

export default NavList;
