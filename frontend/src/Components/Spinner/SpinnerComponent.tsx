import React from 'react';
import './SpinnerComponent.css';

const SpinnerComponent = () => {
  return (
    <div className='spinner-container'>
      <div className='lds-dual-ring'></div>
    </div>
  );
};

export default SpinnerComponent;
