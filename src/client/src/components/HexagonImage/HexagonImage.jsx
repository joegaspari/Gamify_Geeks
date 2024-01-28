import React from 'react';
import styles from './HexagonImage.module.css';




const defaultImg = 'https://via.placeholder.com/64';

export default function HexagonImage({ profileImg, resize = 1, roundingUp = false, borderColor = 'bg-bgBlue2', hasContainer = false }) {

  const containerSize = 5;
  const boxSize = 4.5;
  const hexSize = 4;
  const roundSize = 3;
  const heightWidthRatio = 0.9;

  const containerSizing = {
    width: `${containerSize * resize}rem`,
    height: `${containerSize * resize * heightWidthRatio}rem`,
    marginTop: roundingUp ? `${-roundSize * resize * (1 - (1 - heightWidthRatio) / 2)}rem` : 0,
  };

  const boxSizing = {
    width: `${boxSize * resize}rem`,
    height: `${boxSize * resize * heightWidthRatio}rem`,
  };

  const hexSizing = {
    width: `${hexSize * resize}rem`,
    height: `${hexSize * resize * heightWidthRatio}rem`,
  };


  const renderProfileImage = () => (
    <div style={boxSizing} className={`${styles.hexBorder} ${borderColor}`}>
      <div className={`${styles.hex} flex justify-center items-center`} style={hexSizing}>
        <img className="object-cover h-full w-full" src={profileImg || defaultImg} alt="Profile" />
      </div>
    </div>
  );

  const renderContainer = () => (
    <div className={`bg-white1 ${styles.hexContainer}`} style={containerSizing}>
      {renderProfileImage()}
    </div>
  );

  return hasContainer ? renderContainer() : renderProfileImage();
}
