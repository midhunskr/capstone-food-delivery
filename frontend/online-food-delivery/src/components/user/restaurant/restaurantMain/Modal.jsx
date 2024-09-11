
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';

const Modal = forwardRef(({ title, children }, ref) => {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-4">{children}</div>
        <div className="modal-action">
          <button className="btn" onClick={() => dialogRef.current.close()}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
});

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;