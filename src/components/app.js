import React, {Component} from 'react';
import {connect} from 'react-redux';
import Header from './header';

import '../stylesheets/main.scss';

class App extends Component {

  render() {
    const {children} = this.props;

    return (
      <div>
        <Header />
        {children}
      </div>
    );
  }
}

export default connect((state) => state.app)(App);
