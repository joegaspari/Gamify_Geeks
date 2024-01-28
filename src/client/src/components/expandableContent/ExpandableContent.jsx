import React, { useState } from 'react';
import styles from './ExpandableContent.module.css';

function ExpandableContent() {
  const [isHidden, setIsHidden] = useState(false);

  const toggleSlide = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div>
      <button onClick={toggleSlide}>
        {isHidden ? 'Slide In' : 'Slide Out'}
      </button>
      <div className={`${styles.slideContainer} ${isHidden ? styles.slideOut : styles.slideIn}`}>
        Slide Content
      </div>

    </div>
  );
}

export default ExpandableContent;
