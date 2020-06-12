import React, { Component } from 'react';
import './module.css';
import { SpinnerComponent, BookingListings, ChartComponent } from 'Components';
import Context from 'Context';

class BookingsPage extends Component {
  state = {
    bookings: [],
    isLoading: false,
    tabIndex: 0,
  };

  static contextType = Context;

  isActive = true;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            updatedAt
            user {
              _id
              email
            }
            event {
              _id
              title
              price
              description
              date
              creator {
                _id
                email
              }
            }
          }
        }
      `,
    };
    fetch(`http://localhost:5000/graphql`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          return new Error('Failed');
        }
        return res.json();
      })
      .then((resData) => {
        if (this.isActive) {
          this.setState({ bookings: resData.data.bookings, isLoading: false });
        }
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
        return new Error('Failed');
      });
  };

  deleteBookingHandler = (bookingId: string) => {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
        mutation cancelBooking($bookingId: ID!) {
          cancelBooking(bookingId: $bookingId) {
            _id
            title
          }
        }
      `,
      variables: {
        bookingId,
      },
    };
    fetch(`http://localhost:5000/graphql`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          return new Error('Failed');
        }
        return res.json();
      })
      .then((resData) => {
        if (this.isActive) {
          const updatedBookings = this.state.bookings.filter(
            (booking: any) => booking._id !== bookingId
          );
          this.setState({ bookings: updatedBookings, isLoading: false });
        }
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
        return new Error('Failed');
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    const handleTabSwitches = () => {
      return this.state.tabIndex === 0 ? (
        <BookingListings
          bookings={this.state.bookings}
          onDelete={this.deleteBookingHandler}
        />
      ) : (
        <ChartComponent bookings={this.state.bookings} />
      );
    };
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <SpinnerComponent />
        ) : (
          <React.Fragment>
            <div className='tabs-container'>
              <button onClick={() => this.setState({ tabIndex: 0 })}>
                Booking Lists
              </button>
              <button onClick={() => this.setState({ tabIndex: 1 })}>
                Insights
              </button>
            </div>
            <hr className='hr-container' />
            <div className='tab-data-container'>{handleTabSwitches()}</div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
