import React, { useState } from 'react';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ReminderModal from './ReminderModal';
import { IDateClick, IEventClick, IReminder, IToastState } from '../utils/intefaces';
import { v4 as uuidv4 } from 'uuid';
import { getColorByTemperature, getWeather } from '../utils/utils';
import Toast from './Toast';
import { ToastType } from '../utils/type';

const Calendar: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const initialReminder = {
    id: uuidv4(),
    date: moment().startOf('day'),
    city: '',
    reminderText: '',
    time: '',
  };
  const [reminder, setReminder] = useState<IReminder>(initialReminder);
  const [reminders, setReminders] = useState<IReminder[]>([]);
  const [isEditingReminder, setIsEditingReminder] = useState(false);
  const [toast, setToast] = useState<IToastState>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleDateClick = (arg: IDateClick) => {
    const clickedDate = moment(arg.dateStr).startOf('day');
    if (clickedDate.isBefore(moment().startOf('day'))) {
      showToast('date should be on future', 'error')
      return;
    }
    const newReminder = {
      id: uuidv4(),
      date: clickedDate,
      city: '',
      reminderText: '',
      time: '',
    };
    setIsEditingReminder(false);
    setReminder(newReminder);
    setModalIsOpen(true);
  };

  const handleEventClick = (clickInfo: IEventClick) => {
    const eventID = clickInfo.event.id;
    const eventToEdit = reminders.find((event) => event.id === eventID);
    if (eventToEdit) {
      const editedEvent = {
        ...eventToEdit,
        date: moment(eventToEdit.date).startOf('day'),
      };
      setIsEditingReminder(true);
      setReminder(editedEvent);
      setModalIsOpen(true);
    }
  };

  const onDeleteEvent = (recurringId: string) => {
    const currentReminders = reminders.filter(
      (reminder) => reminder.id !== recurringId
    );
    setReminders([...currentReminders])
    setModalIsOpen(false)
    showToast('Reminder was removed', 'warning')
  }

  const saveReminder = async (currentReminder: IReminder) => {
    try {
      currentReminder.date = currentReminder.date.startOf('day');
      const weather = await getWeather(
        currentReminder.city,
        currentReminder.date.format('YYYY-MM-DD')
      );
      currentReminder.weather = weather;
      const existingIndex = reminders.findIndex(
        (reminder) => reminder.id === currentReminder.id
      );
      const updatedReminders = [...reminders];
      if (existingIndex > -1) {
        updatedReminders[existingIndex] = { ...currentReminder };
      } else {
        updatedReminders.push(currentReminder);
      }
      updatedReminders.sort(
        (a, b) => a.date.diff(b.date)
      );
      setReminders(updatedReminders);
      setModalIsOpen(false)
      showToast('Reminder saved successfully', 'success')
    } catch(err) {
      console.log(err)
      showToast('We cannot add a reminder right now, try later', 'error')
    }

  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        dayHeaderFormat={{ weekday: 'long' }}
        eventContent={(args) => {
          const reminder = reminders.find(
            (rmder) => rmder.id === args.event.id
          );
          const formattedTime = moment(reminder?.time, 'HH:mm').format('HH:mm');
          const cityName = reminder?.city.split(',')[0];
          const backgroundColor = getColorByTemperature(reminder?.weather || 0);
          return (
            <div
              key={args.event.id}
              className="reminder-item"
              style={{ backgroundColor }}
            >
              {reminder?.weather && (
                <div className="weather-info">{`${reminder?.weather}°F - ${cityName}`}</div>
              )}
              <div className="reminder-time-text">
                <span className="time">{formattedTime}</span>
                <span className="text">{reminder?.reminderText}</span>
              </div>
            </div>
          );
        }}
        events={reminders.map((reminder) => ({
          id: reminder.id,
          title: reminder.reminderText,
          start: reminder.date
            .clone()
            .add(moment.duration(reminder.time))
            .toISOString(),
          end: reminder.date
            .clone()
            .add(moment.duration(reminder.time))
            .add(1, 'minutes')
            .toISOString(),
          allDay: false,
        }))}
        themeSystem="standard"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
      />
      <ReminderModal
        isEdit={isEditingReminder}
        isOpen={modalIsOpen}
        reminder={reminder}
        setReminder={setReminder}
        onClose={() => setModalIsOpen(false)}
        onDeleteEvent={onDeleteEvent}
        onSave={saveReminder}
      />
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
};

export default Calendar;
