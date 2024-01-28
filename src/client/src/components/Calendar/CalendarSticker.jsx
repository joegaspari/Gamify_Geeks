import React from 'react';
import styles from './CalendarStricker.module.css';
import FireIcon from '../icon/fireIcon/FireIcon';
import "./CalendarStricker.module.css"

export default function CalendarSticker({ date }) {
  return (
    <div className={styles.calendarDate}>
      <div className="relative ">
        <div className="absolute text-white1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">{date}</div>
        <FireIcon />
      </div>
    </div>
  );
}
