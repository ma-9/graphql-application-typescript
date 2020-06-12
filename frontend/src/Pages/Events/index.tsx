// Important Note: We have user "~~" this sign to parse current value as s Number

import React, { Component } from 'react';
import './module.css';
import {
  Modal,
  BackDrop,
  EventListComponent,
  SpinnerComponent,
} from 'Components';
import Context from 'Context';

interface IState {
  isOpen: boolean;
  events: any;
  isLoading: boolean;
  selectedEvent: {
    _id?: string;
    title?: string;
    description?: string;
    price?: number;
    date?: string;
    creator?: {
      _id?: string;
    };
  };
}

class EventsPage extends Component {
  state: IState = {
    isOpen: false,
    events: [],
    isLoading: false,
    selectedEvent: {},
  };

  isActive = true;

  static contextType = Context;

  componentDidMount() {
    this.fetchEvents();
  }

  public title: any;
  public price: any;
  public date: any;
  public description: any;

  constructor(props: any) {
    super(props);
    this.title = React.createRef();
    this.price = React.createRef();
    this.date = React.createRef();
    this.description = React.createRef();
  }

  handleCreateEvent = () => {
    this.setState({ isOpen: true });
  };

  handleOnConfirmModal = () => {
    this.setState({ isOpen: false });
    const event = {
      title: this.title.current.value,
      price: ~~this.price.current.value,
      date: this.date.current.value,
      description: this.description.current.value,
    };

    if (
      event.title.length === 0 ||
      event.price <= 0 ||
      event.date.length === 0 ||
      event.description.length === 0
    ) {
      return;
    }
    let requestBody = {
      query: `
        mutation createNewEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `,
      variables: {
        title: event.title,
        description: event.description,
        price: event.price,
        date: event.date,
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
        this.setState((prevState: any) => {
          const updatedState = [...prevState.events];
          updatedState.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            price: resData.data.createEvent.price,
            date: resData.data.createEvent.date,
            creator: {
              _id: this.context.userId,
            },
          });
          return { events: updatedState };
        });
      })
      .catch((err) => {
        return new Error('Failed');
      });
  };

  handleOnCancelModal = () => {
    this.setState({ isOpen: false, selectedEvent: {} });
  };

  handleBookEvent = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: {} });
      return;
    }
    let requestBody = {
      query: `
        mutation bookAnEvent($_id: ID!) {
          bookEvent(eventId: $_id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        _id: this.state.selectedEvent._id,
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
        this.setState({ selectedEvent: {} });
      })
      .catch((err) => {
        return new Error('Failed');
      });
  };

  fetchEvents = () => {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
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
          this.setState({ events: resData.data.events, isLoading: false });
        }
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
        return new Error('Failed');
      });
  };

  showDetailHandler = (eventId: string) => {
    this.setState((prevState: any) => {
      const selectedEvent = prevState.events.find(
        (e: any) => e._id === eventId
      );
      selectedEvent.date = new Date(selectedEvent.date).toLocaleDateString();
      return { selectedEvent };
    });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.isOpen || this.state.selectedEvent._id) && <BackDrop />}
        {this.state.isOpen && (
          <Modal
            title='Create an Event'
            canCancel
            canConfirm
            onCancel={this.handleOnCancelModal}
            onConfirm={this.handleOnConfirmModal}
            confirmText='Confirm'
          >
            <form
              className='create-event-form'
              onSubmit={this.handleOnConfirmModal}
            >
              <div className='form-control'>
                <label htmlFor='title'>Title</label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  required
                  ref={this.title}
                />
              </div>
              <div className='form-control'>
                <label htmlFor='price'>Price</label>
                <input
                  type='number'
                  name='price'
                  id='price'
                  required
                  ref={this.price}
                />
              </div>
              <div className='form-control'>
                <label htmlFor='date'>Date</label>
                <input
                  type='datetime-local'
                  name='date'
                  id='date'
                  required
                  ref={this.date}
                />
              </div>
              <div className='form-control'>
                <label htmlFor='description'>Description</label>
                <textarea
                  name='description'
                  id='description'
                  rows={4}
                  required
                  ref={this.description}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent._id && (
          <Modal
            title='Book an Event'
            canCancel
            canConfirm
            onCancel={this.handleOnCancelModal}
            onConfirm={this.handleBookEvent}
            confirmText={this.context.token ? 'Book' : 'Login to Book'}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h3>
              ₹{this.state.selectedEvent.price} -{' '}
              {this.state.selectedEvent.date}
            </h3>
            <p> {this.state.selectedEvent.description} </p>
          </Modal>
        )}
        <div className='event-body'>
          {this.context.token && (
            <div className='event-controls'>
              <p>Share your own events!</p>
              <button onClick={this.handleCreateEvent}>Create Event</button>
            </div>
          )}
          {this.state.isLoading ? (
            <SpinnerComponent />
          ) : (
            <EventListComponent
              events={this.state.events}
              AuthUserID={this.context.userId}
              viewEventDetails={this.showDetailHandler}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
