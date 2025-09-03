import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import optionData from "../data/optionData.json";
import "../App.css";

function OptionModal({ item, onClose }) {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const [quantity, setQuantity] = useState(1);


  const [selectedBread, setSelectedBread] = useState(null);
  const [selectedCream, setSelectedCream] = useState(null);
  const [selectedTopping, setSelectedTopping] = useState([]);             
  const [selectedIcecreamTopping, setSelectedIcecreamTopping] = useState(null); 
  const [selectedTemp, setSelectedTemp] = useState(null);
  const [selectedGelato, setSelectedGelato] = useState(null);

  const { breads, creams, toppings, gelatos, icecreamToppings } = optionData;

  const hasCategory = (cat) => {
    if (Array.isArray(item.category)) return item.category.includes(cat);
    return item.category === cat;
  };

  const getOptionType = () => {
    if (hasCategory("와플") || (hasCategory("베스트메뉴") && item.name.includes("와플"))) return "와플";
    if (hasCategory("아이스와플") || (hasCategory("베스트메뉴") && item.name.includes("아이스와플"))) return "아이스와플";
    if (hasCategory("커피") || (hasCategory("베스트메뉴") && item.name.includes("커피"))) return "커피";
    if (hasCategory("음료") || (hasCategory("베스트메뉴") && item.name.includes("음료"))) return "음료";
    if (hasCategory("아이스크림") || (hasCategory("베스트메뉴") && item.name.includes("아이스크림"))) return "아이스크림";
    return null;
  };
  const optionType = getOptionType();

  const totalPrice =
    (item.price +
      (selectedBread?.price || 0) +
      (selectedCream?.price || 0) +
      (selectedTopping.reduce((sum, t) => sum + t.price, 0)) +
      (selectedIcecreamTopping?.price || 0)) *
    quantity;


  const toggleTopping = (topping) => {
    setSelectedTopping((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.some((t) => t.id === topping.id)) {
        return arr.filter((t) => t.id !== topping.id);
      } else {
        if (arr.length >= 3) {
          alert("토핑은 최대 3개까지 선택 가능합니다.");
          return arr;
        }
        return [...arr, topping];
      }
    });
  };

  const renderOptionItem = (option, selected, onClick) => {
    const isSelected = Array.isArray(selected)
      ? selected.some((t) => t.id === option.id)
      : selected?.id === option.id;

    return (
      <div
        key={option.id}
        className={`option-item ${isSelected ? "selected" : ""}`}
        onClick={() => onClick(option)}
      >
        {option.image && <img src={option.image} alt={option.name} className="option-img" />}
        <div className="option-text">
          <p className="option-name">{option.name}</p>
          <p className="option-price">+{option.price}원</p>
        </div>
      </div>
    );
  };

  const renderOptions = () => {
    if (optionType === "와플") {
      return (
        <>
          <div className="option-section-title"><p className="option-req">필수</p><p className="option-sub">와플 빵 선택</p></div>
          <div className="option-group">{breads.map((b) => renderOptionItem(b, selectedBread, setSelectedBread))}</div>
          <div className="option-section-title"><p className="option-req">필수</p><p className="option-sub">크림 선택</p></div>
          <div className="option-group">{creams.map((c) => renderOptionItem(c, selectedCream, setSelectedCream))}</div>
          <div className="option-section-title"><p className="option-req">필수</p><p className="option-sub">토핑 선택</p></div>
          <div className="option-group">{toppings.map((t) => renderOptionItem(t, selectedTopping, toggleTopping))}</div>
        </>
      );
    }

    if (optionType === "아이스와플") {
      return (
        <>
          <div className="option-section-title"><p className="option-req">필수</p><p className="option-sub">와플 빵 선택</p></div>
          <div className="option-group">{breads.map((b) => renderOptionItem(b, selectedBread, setSelectedBread))}</div>
          <div className="option-section-title"><p className="option-req">필수</p><p className="option-sub">젤라또 선택</p></div>
          <div className="option-group">{gelatos.map((g) => renderOptionItem(g, selectedGelato, setSelectedGelato))}</div>
          <div className="option-section-title"><p className="option-req">필수</p><p className="option-sub">토핑 선택</p></div>
          <div className="option-group">{toppings.map((t) => renderOptionItem(t, selectedTopping, toggleTopping))}</div>
        </>
      );
    }

    if (optionType === "커피" || optionType === "음료") {
      if (item.tempOptional) {
        return <p className="option-sub" style={{ textAlign: "center", marginTop: "80px" }}>추가 옵션 없이 바로 담을 수 있습니다.</p>;
      }
      return (
        <>
          <div className="option-section-title"><p className="option-req">필수</p><p className="option-sub">온도 선택</p></div>
          <div className="option-group coffee-options">
            {["HOT", "ICE"].map((opt, i) => renderOptionItem({ id: i, name: opt, price: 0 }, selectedTemp, () => setSelectedTemp({ id: i, name: opt, price: 0 })))}
          </div>
        </>
      );
    }

    if (optionType === "아이스크림") {
      return (
        <>
          <div className="option-section-title"><p className="option-req">필수</p><p className="option-sub">토핑 선택</p></div>
          <div className="option-group">{icecreamToppings.map((t) => renderOptionItem(t, selectedIcecreamTopping, setSelectedIcecreamTopping))}</div>
        </>
      );
    }

    return <p className="option-sub">옵션 없음</p>;
  };

  const handleAddToCart = () => {
    if (optionType === "와플" && (!selectedBread || !selectedCream || selectedTopping.length === 0)) {
      alert("빵, 크림, 토핑을 모두 선택해주세요.");
      return;
    }
    if (optionType === "아이스와플" && (!selectedBread || !selectedGelato || selectedTopping.length === 0)) {
      alert("빵, 젤라또, 토핑을 모두 선택해주세요.");
      return;
    }
    if (optionType === "아이스크림" && !selectedIcecreamTopping) {
      alert("토핑을 선택해주세요.");
      return;
    }

    dispatch(addToCart({
      ...item,
      quantity,
      options:
        optionType === "와플" ? { bread: selectedBread, cream: selectedCream, topping: selectedTopping } :
        optionType === "아이스와플" ? { bread: selectedBread, gelato: selectedGelato, topping: selectedTopping } :
        (optionType === "커피" || optionType === "음료") && !item.tempOptional ? { temperature: selectedTemp } :
        optionType === "아이스크림" ? { topping: selectedIcecreamTopping } :
        {},
      price: totalPrice / quantity,
    }));

    onClose();
  };

  const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });

  return (
    <div className="modal-overlay">
      <div className="option-modal">
        <div className="option-header">
          <div className="option-title">
            <p>옵션 선택</p>
            <button className="close-btn" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
          </div>
          <div className="option-info">
            <img src={item.image} alt={item.name} className="menu-main-img" />
            <div className="option-details">
              <p className="main-option-name" style={{ width: "100%", fontSize: "20px", marginBottom: 0 }}>{item.name}</p>
              {item.engName && <h4 className="menu-eng-name">{item.engName}</h4>}
              {item.desc && <p className="menu-desc">{item.desc}</p>}
              <div className="price-box">
                <div className="price-qty">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span className="quantity">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <span className="total-price">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        <div className="option-scroll" ref={scrollRef}>{renderOptions()}</div>

        <div className="scroll-btns">
          <button onClick={scrollToTop}><FontAwesomeIcon icon={faChevronUp} /></button>
          <button onClick={scrollToBottom}><FontAwesomeIcon icon={faChevronDown} /></button>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>취소</button>
          <button className="submit-btn" onClick={handleAddToCart}>주문 담기</button>
        </div>
      </div>
    </div>
  );
}

export default OptionModal;
