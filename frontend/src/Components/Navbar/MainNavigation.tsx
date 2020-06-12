import React from 'react';
import './MainNavigation.css';
import { NavLink } from 'react-router-dom';
import Context from 'Context';

const MainNavigation = () => {
  return (
    <Context.Consumer>
      {(context) => (
        <header className='main-navigation'>
          <div className='main-navigation__logo'>
            <h1>Easy Event</h1>
          </div>
          <nav className='main-navigation__items'>
            <ul>
              {!context.token && (
                <li>
                  <NavLink to='/auth'>Authentication</NavLink>
                </li>
              )}
              <li>
                <NavLink to='/events'>Events</NavLink>
              </li>
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to='/bookings'>Bookings</NavLink>
                  </li>
                  <li>
                    <NavLink onClick={context.logout} to='/auth'>
                      Logout
                    </NavLink>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      )}
    </Context.Consumer>
  );
};

export default MainNavigation;
