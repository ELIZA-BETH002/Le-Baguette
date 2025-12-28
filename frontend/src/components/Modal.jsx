/**
 * Modal Component
 */
import PropTypes from 'prop-types';
export default function Modal({ isOpen, children }) { return isOpen ? <div className="modal">{children}</div> : null; }

Modal.propTypes = {
  // TODO: define props
};

// 🥖