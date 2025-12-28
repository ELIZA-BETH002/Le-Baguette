import { useEffect, useState } from 'react';
/**
 * Toast Component
 */
import PropTypes from 'prop-types';
export default function Toast({ msg, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null; return <div className="toast">{msg}</div>; }

Toast.propTypes = {
  // TODO: define props
};