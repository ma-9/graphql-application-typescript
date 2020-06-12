import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class FourOFourPage extends Component {
  render() {
    return (
      <div>
        <h1>Sorry, This page is not available</h1>
        <Link to='/auth'>Go To Login</Link>
      </div>
    );
  }
}

export default FourOFourPage;
