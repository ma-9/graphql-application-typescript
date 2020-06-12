import React from 'react';
import './Modal.css';

interface IModalProps {
  title: string;
  canCancel?: boolean;
  canConfirm?: boolean;
  onCancel?: any;
  onConfirm?: any;
  confirmText?: string;
}

const ModalComponent: React.FC<IModalProps> = (props) => {
  return (
    <div className='modal'>
      <header className='modal__header'>
        <h1>{props.title}</h1>
      </header>
      <section className='modal__content'> {props.children} </section>
      <section className='modal__actions'>
        {props.canCancel && <button onClick={props.onCancel}>Cancel</button>}
        {props.canConfirm && (
          <button onClick={props.onConfirm}>{props.confirmText}</button>
        )}
      </section>
    </div>
  );
};

export default ModalComponent;
