import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { AuthPage, BookingsPage, EventsPage, FourOFourPage } from 'Pages';
import { NavBar } from 'Components';
import Context from 'Context';

class App extends Component {
  state = {
    token: null,
    userId: null,
    tokenExpiration: null,
  };

  componentDidMount() {
    if (window.localStorage.getItem('token') !== null) {
      const token = window.localStorage.getItem('token');
      this.setState({ token });
    } else {
      return;
    }
  }

  login = (token: string, userId: string, tokenExpiration: number) => {
    this.setState({
      token,
      userId,
      tokenExpiration,
    });
    window.localStorage.setItem('token', token);
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null,
      tokenExpiration: null,
    });
    window.localStorage.removeItem('token');
  };

  render() {
    return (
      <BrowserRouter>
        <Context.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <NavBar />
          <main className='main-content'>
            <Switch>
              {!this.state.token && <Redirect from='/' to='/auth' exact />}
              {this.state.token && <Redirect from='/' to='/events' exact />}
              {this.state.token && <Redirect from='/auth' to='/events' exact />}
              {!this.state.token && (
                <Route path='/auth' component={AuthPage} exact />
              )}
              <Route path='/events' component={EventsPage} exact />
              {this.state.token && (
                <Route path='/bookings' component={BookingsPage} exact />
              )}
              <Route component={FourOFourPage} />
            </Switch>
          </main>
        </Context.Provider>
      </BrowserRouter>
    );
  }
}
export default App;
