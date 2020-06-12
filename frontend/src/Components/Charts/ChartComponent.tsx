import React from 'react';
import { Bar } from 'react-chartjs-2';
import './ChartComponent.css';

interface IBooking {
  createdAt?: string;
  updatedAt?: string;
  event?: {
    date?: string;
    description?: string;
    price?: number;
    title?: string;
    _id?: string;
    creator?: {
      _id?: string;
      email?: string;
    };
  };
  user?: {
    _id?: string;
    email?: string;
  };
}

interface IChartComponentProps {
  bookings: any;
}

const ChartComponent: React.FC<IChartComponentProps> = (props) => {
  const bookingPriceArray = props.bookings.map(
    (booking: any) => booking.event.price
  );
  const CheapEvents = bookingPriceArray.filter((e: any) => e <= 1000);
  const RegularEvents = bookingPriceArray.filter(
    (e: any) => e > 1000 && e <= 5000
  );
  const ExpensiveEvents = bookingPriceArray.filter((e: any) => e > 5000);
  return (
    <div className='chart-container'>
      <Bar
        data={{
          labels: ['Cheap', 'Regular', 'Expensive'],
          datasets: [
            {
              label: 'Events',
              backgroundColor: [
                'rgba(0,255,0,0.5)',
                'rgba(0,0,255,0.5)',
                'rgba(255,0,0,0.5)',
              ],
              data: [
                [0, CheapEvents.length],
                [0, RegularEvents.length],
                [0, ExpensiveEvents.length],
              ],
            },
          ],
        }}
        options={{
          legend: { display: true },
          title: { display: true, text: `Your Bookings` },
        }}
      />
    </div>
  );
};

export default ChartComponent;
