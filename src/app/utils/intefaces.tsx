import moment from 'moment';
import { ToastType } from './type';

export interface IReminder {
    id: string;
    date: moment.Moment;
    city: string;
    reminderText: string;
    time: string;
    weather?: number;
}

export interface IReminderModalProps {
    isOpen: boolean;
    reminder: IReminder;
    isEdit: boolean;
    setReminder: (reminder: IReminder) => void;
    onClose: () => void;
    onSave: (reminder: IReminder) => void;
    onDeleteEvent: (reminderId: string) => void;
}

export interface IDateClick {
    dateStr: string;
}

export interface IEventClick {
    event: {
        id: string
    }
}

export interface IToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export  interface IToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
  }
