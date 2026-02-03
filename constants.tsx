
import React from 'react';
import { LayoutDashboard, Users, FileText, Calendar, CheckSquare, Trash2 } from 'lucide-react';
import { View, Learner, Document, ScheduleEvent } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'learners' as View, label: 'Learner Registry', icon: <Users size={20} /> },
  { id: 'documents' as View, label: 'School Docs', icon: <FileText size={20} /> },
  { id: 'attendance' as View, label: 'Daily Register', icon: <CheckSquare size={20} /> },
  { id: 'schedule' as View, label: 'School Calendar', icon: <Calendar size={20} /> },
  { id: 'trash' as View, label: 'Trash Bin', icon: <Trash2 size={20} /> },
];

export const INITIAL_LEARNERS: Learner[] = [];

const todayStr = new Date().toISOString().split('T')[0];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'd1',
    title: 'Creche Admission Form (Digital)',
    content: JSON.stringify({
      childName: '',
      surname: '',
      dob: '',
      gender: '',
      address: '',
      parent1: '',
      contact1: '',
      parent2: '',
      contact2: '',
      allergies: '',
      emergencyName: '',
      emergencyPhone: ''
    }),
    type: 'word',
    lastModified: todayStr,
    category: 'Form'
  },
  {
    id: 'd2',
    title: 'Monthly Budget Spreadsheet',
    content: JSON.stringify([
      ['Category', 'Description', 'Budget', 'Spent'],
      ['Food', 'Snacks & Lunch', '2000', '0'],
      ['Cleaning', 'Sanitizers', '500', '0'],
      ['Toys', 'Learning Kits', '1000', '0'],
      ['Admin', 'Stationery', '300', '0']
    ]),
    type: 'excel',
    lastModified: todayStr,
    category: 'Finance'
  }
];

export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: 's1',
    title: 'Morning Story Time',
    startTime: '08:30',
    endTime: '09:00',
    subject: 'Reading',
    room: 'Main Hall',
    date: todayStr
  },
  {
    id: 's2',
    title: 'Nap Time',
    startTime: '12:30',
    endTime: '14:00',
    subject: 'Rest',
    room: 'Sleep Room',
    date: todayStr
  }
];
