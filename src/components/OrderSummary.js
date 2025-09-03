import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeQuantity, removeItem, clearCart } from "../redux/cartSlice";
import PaymentModal from "./PaymentModal";
import "../App.css";

function OrderSummary() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState("");

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const openModal = (method) => {
    setPayMethod(method);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <div className="order-summary-container">
      <div className="cart-box">
        <div className="cart-table-header">
          <div>번호</div>
          <div>메뉴</div>
          <div>수량</div>
          <div>가격</div>
          <div></div>
        </div>

        <div className="cart-table-wrapper">
          {cartItems.length === 0 ? (
            <div className="empty-cart">장바구니가 비어 있습니다.</div>
          ) : (
            <table className="cart-table">
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ width: "50px", textAlign: "center", color: "#003c96", fontWeight: "bold" }}>
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td style={{ width: "380px" }} className="summary-name">
                      {item.name}
                      {item.options && (
                        <span style={{ display: "block", color: "#a3a3a3ff", fontSize: "14px", fontWeight: "300" }}>
                          {Object.values(item.options)
                            .map(opt => {
                              if (Array.isArray(opt)) return opt.map(o => o.name).join(", "); 
                              if (typeof opt === "object") return opt.name; 
                              return opt; 
                            })
                            .join(" / ")}
                        </span>
                      )}
                    </td>
                    <td style={{ width: "145px", textAlign: "center" }}>
                      <button className="qty-btn minus" onClick={() => dispatch(changeQuantity({ id: item.id, delta: -1 }))}>
                        -
                      </button>
                      <span style={{ margin: "0 20px" }}>{item.quantity}</span>
                      <button className="qty-btn plus" onClick={() => dispatch(changeQuantity({ id: item.id, delta: 1 }))}>
                        +
                      </button>
                    </td>
                    <td style={{ width: "140px", textAlign: "right", fontWeight: "bold" }}>
                      {(item.price * item.quantity).toLocaleString()}원
                    </td>
                    <td style={{ width: "40px", textAlign: "center" }}>
                      <button className="remove-btn" onClick={() => dispatch(removeItem(item.id))}>
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-summary">
            <span>주문수량 : {totalQuantity}</span>
            <span>주문금액 : {totalPrice.toLocaleString()}원</span>
          </div>

          <div className="cart-buttons">
            <button className="all-cancel-btn" onClick={() => dispatch(clearCart())}>
              전체<br />취소
            </button>

            <div className="pay-buttons">
              <button onClick={() => openModal("모바일")}>
                <img src="/images/pay.png" alt="kakaopay" className="pay-icon kakao" />
                <span>모바일 결제 / 상품권</span>
              </button>
              <button onClick={() => openModal("현금")}>
                <img src="/images/cash.png" alt="cash" className="pay-icon" />
                <span>현금결제</span>
              </button>
              <button onClick={() => openModal("카드")}>
                <img src="/images/card.png" alt="card" className="pay-icon" />
                <span>카드결제</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <PaymentModal
          cartItems={cartItems}
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
          payMethod={payMethod}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default OrderSummary;
