import React from 'react';
import good from '../../images/good.svg';
import fail from '../../images/fail.svg';

const InfoToolTip = ({ toolTip, isOpen, onClose, message }) => {
  return (
    <>
      <div className={`pop-up ${isOpen ? 'pop-up_opened' : ''} `}>
        <div className="pop-up__container pop-up__container_info">
          {toolTip ? <img className="pop-up__img-tooltip" src={good} alt=""/> : <img className="pop-up__img-tooltip" src={fail} alt=""/>}
          <h2 className="pop-up__title pop-up__title_info">{message}</h2>
          <button type="button" className="pop-up__btnClose" onClick={onClose} />
        </div>
      </div>
    </>
  );
}

export default InfoToolTip;