import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { IReminderModalProps } from '../utils/intefaces';
import CityAutocomplete from './CityAutocomplete';
import { useForm } from 'react-hook-form';

const ReminderModal: React.FC<IReminderModalProps> = ({
  isOpen,
  isEdit,
  reminder,
  setReminder,
  onClose,
  onSave,
  onDeleteEvent,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminder({ ...reminder, [e.target.name]: e.target.value });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm();
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setReminder({ ...reminder, date: moment(date) });
    }
  };

  useEffect(() => {
    reset({
      time: reminder.time,
      city: reminder.city,
      reminderText: reminder.reminderText,
      date: reminder.date,
    })
  }, [reminder, reset])

  const setCity = (city: string) => {
    if (city) {
      clearErrors('city');
      setValue('city', city);
    }

    setReminder({ ...reminder, city });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    await onSave(reminder);
    setIsLoading(false);
    onClose();
  };

  Modal.setAppElement('#root');

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="modal-overlay"
      className="modal-content"
      contentLabel="Reminder Modal"
    >
      {isLoading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <h2>{isEdit ? 'Edit' : 'Add'} Reminder</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control date-picker-container">
          <label>Date</label>
          <DatePicker
            selected={reminder.date.toDate()}
            onChange={handleDateChange}
            className="input date-picker-input"
            minDate={new Date()}
          />
        </div>
        <div className="form-control">
          <label>Time</label>
          <input
            type="time"
            value={reminder.time}
            className={`input ${errors.time ? 'input-error' : ''}`}
            {...register('time', {
              required: true,
              onChange: (e) => handleInputChange(e),
            })}
          />
          <div className="error-messages">
            {errors.time && <span>This field is required</span>}
          </div>
        </div>
        <div className="form-control">
          <label>City</label>
          <CityAutocomplete
            hasErrors={!!errors.city}
            city={reminder.city}
            onCityChange={setCity}
            {...register('city', {
              required: true,
            })}
          />
          <div className="error-messages">
            {errors.city && <span>This field is required</span>}
          </div>
        </div>
        <div className="form-control">
          <label>Reminder</label>
          <input
            type="text"
            maxLength={30}
            placeholder='Set your reminder - max 30 letters'
            className={`input ${errors.reminderText ? 'input-error' : ''}`}
            value={reminder.reminderText}
            {...register('reminderText', {
              required: true,
              maxLength: 30,
              onChange: (e) => handleInputChange(e),
            })}
          />
          <div className="error-messages">
            {errors.reminderText && <span>This field is required</span>}
          </div>
        </div>
        <div className="button-group">
          <button type="submit" className="button">
            Save
          </button>
          <div>
            <button type="button" className="button" onClick={() => {onClose()}}>
              Close
            </button>
            {isEdit && <button type="button" className="button btn-delete" onClick={() => {onDeleteEvent(reminder.id)}}>
              Delete
            </button>}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ReminderModal;
