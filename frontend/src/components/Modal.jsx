const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
