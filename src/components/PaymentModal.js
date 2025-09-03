import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ReceiptModal from "./ReceiptModal";

function PaymentModal({ cartItems, totalQuantity, totalPrice, payMethod, onClose }) {
  const [showReceipt, setShowReceipt] = useState(false);

  const handlePayment = () => {
    setShowReceipt(true);
  };

  return ReactDOM.createPortal(
    <>
      <div className="pay-modal-overlay">
        <div className="pay-modal-content">
          <div className="pay-modal-header">
            <span>주문리스트</span>
            <button className="close-btn" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="pay-modal-list-header">
            <span>번호</span>
            <span>주문목록</span>
            <span>수량</span>
            <span>가격</span>
          </div>

          <div className="pay-modal-list">
            {cartItems.map((item, index) => (
              <div key={item.id} className="pay-modal-list-item">
                <div className="pay-modal-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="pay-modal-name">{item.name}</div>
                <div className="pay-modal-quantity">{item.quantity}</div>
                <div className="pay-modal-price">{(item.price * item.quantity).toLocaleString()}원</div>

                {item.options &&
                  Object.values(item.options).map((opt, i) => (
                    <div key={i} className="pay-modal-option">
                      옵션: {typeof opt === "object" ? opt.name : opt}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="pay-modal-footer">
            <span>{payMethod} 결제를 선택하셨습니다</span>
            <span>수량 {totalQuantity}개</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="cancel-btn">
              취소
            </button>
            <button onClick={handlePayment} className="submit-btn">
              결제하기
            </button>
          </div>
        </div>
      </div>

      {showReceipt && (
        <ReceiptModal
          onConfirm={() => {
            console.log("영수증 출력 실행");
            setShowReceipt(false);
          }}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </>,
    document.body
  );
}

export default PaymentModal;
