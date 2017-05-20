import React, { Component } from 'react';

import SearchForm from '../searchForm/SearchForm';
import DevTools from '../../common/DevTools';

/**
 * Stateful class implementing Application
 */
export default class App extends Component {
  render() {
    const shouldShowDevTools = WP_IS_DEV;

    return (
      <div>
        TEST
        <SearchForm />
        {shouldShowDevTools && <DevTools />}
      </div>
    );
  }
}
