import React, { Component, createRef } from 'react';
import './module.css';
import Context from 'Context';

class AuthPage extends Component {
  state = {
    isLogin: true,
  };

  static contextType = Context;

  public emailEl: any;
  public passwordEl: any;
  constructor(props: any) {
    super(props);
    this.emailEl = createRef();
    this.passwordEl = createRef();
  }

  switchButtonHandler = () => {
    this.setState({
      isLogin: !this.state.isLogin,
    });
  };

  handleFormSubmit = (e: any) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    if (email.trim().length === 0 && password.trim() === 0) {
      return;
    } else {
      let requestBody = {
        query: `
          query loginUser($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              userId
              token
              tokenExpiration
            }
          }
        `,
        variables: {
          email,
          password,
        },
      };
      if (!this.state.isLogin) {
        requestBody = {
          query: `
            mutation signUp($email: String!, $password: String!) {
              createUser(userInput: {email: $email, password: $password}) {
                email
                password
                _id
              }
            }
          `,
          variables: {
            email,
            password,
          },
        };
      }
      fetch(`http://localhost:5000/graphql`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            return new Error('Failed');
          }
          return res.json();
        })
        .then((resData) => {
          if (this.state.isLogin) {
            this.context.login(
              resData.data.login.token,
              resData.data.login.userId,
              resData.data.login.tokenExpiration
            );
          } else {
            console.log(resData);
          }
        })
        .catch((err) => {
          console.log('Fetch API Failed', err);
          return new Error('Failed');
        });
    }
  };
  render() {
    return (
      <form className='auth-form' onSubmit={this.handleFormSubmit}>
        <div className='form-control'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            required
            name='email'
            id='email'
            ref={this.emailEl}
          />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            required
            name='password'
            id='password'
            ref={this.passwordEl}
          />
        </div>
        <div className='form-actions'>
          <button type='submit'>Submit</button>
          <button type='button' onClick={this.switchButtonHandler}>
            Switch to {this.state.isLogin ? 'SignUp' : 'Login'}{' '}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
