import React from "react";
import ReactDOM from "react-dom";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function ReceiptModal({ onConfirm, onClose }) {
  return ReactDOM.createPortal(
    <div className="pay-modal-overlay">
      <div className="receipt-modal-content">
        <div className="pay-modal-header">
          <span>영수증 출력 선택</span>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="receipt-modal-body">
          영수증을 출력하시겠습니까?
        </div>

        <div className="receipt-modal-footer">
          <button className="receipt-yes" onClick={onConfirm}>예</button>
          <button className="receipt-no" onClick={onClose}>아니오</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ReceiptModal;
