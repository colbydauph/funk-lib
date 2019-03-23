import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

// components
import Code from '../Code';
import Icon from '../Icon';

// local
import styles from './Card.module.css';

const Card = ({ doc, onQuery }) => (
  <div className={ `${ styles.card } ${ styles[doc.kind] }` } style={{ display: (doc.ignore ? 'none' : 'default') }}>
    <a className={ styles.sourceLink } href={ doc.url } target={ '_new' } title={ 'View Source' }>
      <Icon type={ 'code' } />
    </a>
    <h2>
      { /* fixme */ }
      <Link to={ `/#${ doc.path.replace(/\//g, '.') }` }>{ doc.path }</Link>
    </h2>
    <Code >{ doc.sig }</Code>
    <div className={ styles.description }>{ doc.description }</div>
    <div>{ (doc.deprecated ? 'deprecated' : '') }</div>
    {
      doc.examples.length
        ? (
          <div>
            <h4>{ 'Example' }</h4>
            {
              doc.examples.map((example, i) => (
                <Code
                  lang={ 'javascript' }
                  className={ styles.example }
                  key={ i }
                  inline={ false }
                >{ example }</Code>
              ))
            }
          </div>
        )
        : null
    }
  </div>
);

Card.propTypes = {
  doc: PropTypes.shape({
    path: PropTypes.string,
  }),
  id: PropTypes.string,
  onQuery: PropTypes.func,
};

Card.defaultProps = {
  doc: {},
  onQuery: () => {},
};

export default Card;
