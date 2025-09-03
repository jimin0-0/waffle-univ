import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MenuItemCard from "../components/MenuItemCard";
import OrderSummary from "../components/OrderSummary";
import OptionModal from "../components/OptionModal";
import PaymentModal from "../components/PaymentModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import menuData from "../data/menuData.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const tabs = ["베스트메뉴", "와플", "아이스와플", "커피", "음료", "아이스크림"];
const languages = ["한국어", "English", "日本語", "中文"];

function MenuPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("베스트메뉴");
  const [showLang, setShowLang] = useState(false);
  const [currentLang, setCurrentLang] = useState("한국어");
  const [selectedItem, setSelectedItem] = useState(null);

  const [tabPageStartIndex, setTabPageStartIndex] = useState(0);
  const TABS_PER_PAGE = 5;

  const [menuPage, setMenuPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const [cartItems, setCartItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState("");

  const handleLangSelect = (lang) => {
    setCurrentLang(lang);
    setShowLang(false);
  };

  const visibleTabs = useMemo(() => {
    const slice = tabs.slice(tabPageStartIndex, tabPageStartIndex + TABS_PER_PAGE);
    const lastIndex = tabPageStartIndex + TABS_PER_PAGE;
    if (lastIndex >= tabs.length && !slice.includes("아이스크림")) {
      const newSlice = slice.slice(0, TABS_PER_PAGE - 1);
      newSlice.push("아이스크림");
      return newSlice;
    }
    return slice;
  }, [tabPageStartIndex]);

  const nextTabPage = () => {
    if (tabPageStartIndex + TABS_PER_PAGE < tabs.length) setTabPageStartIndex(tabPageStartIndex + 1);
  };

  const prevTabPage = () => {
    if (tabPageStartIndex > 0) setTabPageStartIndex(tabPageStartIndex - 1);
  };

  const onTabClick = (tab) => {
    setActiveTab(tab);
    setMenuPage(1);
  };

  const filteredMenu = menuData.filter((item) =>
    Array.isArray(item.category) ? item.category.includes(activeTab) : item.category === activeTab
  );

  const totalMenuPages = Math.max(1, Math.ceil(filteredMenu.length / ITEMS_PER_PAGE));
  const paginatedMenu = filteredMenu.slice((menuPage - 1) * ITEMS_PER_PAGE, menuPage * ITEMS_PER_PAGE);


  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
    );
  };

  const handleRemoveItem = (id) => setCartItems((prev) => prev.filter((item) => item.id !== id));
  const handleClearCart = () => setCartItems([]);
  const openModal = (method) => { setPayMethod(method); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  useEffect(() => setMenuPage(1), [activeTab]);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="menu-page" style={{ width: "1070px", margin: "0 auto", backgroundColor: "#F1F1F1" }}>
      <header className="menu-header">
        <button className="home-btn" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} size="lg" />
        </button>
        <img src="/images/logo.png" alt="Logo" className="logo" />

        <div className="lang-dropdown">
          <button className="lang-btn" onClick={() => setShowLang(!showLang)}>{currentLang}</button>
          {showLang && (
            <ul className="lang-menu">
              {languages.map((lang) => <li key={lang} onClick={() => handleLangSelect(lang)}>{lang}</li>)}
            </ul>
          )}
        </div>
      </header>

      <div style={{ position: "relative" }}>
        {tabPageStartIndex > 0 && (
          <button className="tab-arrow" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }} onClick={prevTabPage}>
            <FontAwesomeIcon icon={faAngleLeft} size="lg" />
          </button>
        )}

        <div className="nav nav-tabs flex-nowrap" style={{ backgroundColor: "white", display: "flex", justifyContent: "center" }}>
          {visibleTabs.map((tab) => (
            <button key={tab} className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => onTabClick(tab)} style={{ minWidth: 120 }}>
              {tab}
            </button>
          ))}
        </div>

        {tabPageStartIndex + TABS_PER_PAGE < tabs.length && (
          <button className="tab-arrow" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }} onClick={nextTabPage}>
            <FontAwesomeIcon icon={faAngleRight} size="lg" />
          </button>
        )}
      </div>

      <div className="menu-grid">
        {paginatedMenu.map((item) => <MenuItemCard key={item.id} item={item} onClick={setSelectedItem} />)}
        {Array.from({ length: ITEMS_PER_PAGE - paginatedMenu.length }).map((_, i) => <div key={"empty" + i} className="menu-card empty-card"></div>)}
      </div>

      <div className="pagination">
        <button onClick={() => setMenuPage((p) => Math.max(1, p - 1))} disabled={menuPage === 1} className="prev-btn">이전</button>
        <div className="dots" style={{ display: "flex", gap: "8px", margin: "0 12px" }}>
          {Array.from({ length: totalMenuPages }, (_, i) => (
            <span key={i} className={menuPage === i + 1 ? "active" : ""} onClick={() => setMenuPage(i + 1)}></span>
          ))}
        </div>
        <button onClick={() => setMenuPage((p) => Math.min(totalMenuPages, p + 1))} disabled={menuPage === totalMenuPages} className="next-btn">다음</button>
      </div>

      <OrderSummary
        cartItems={cartItems}
        handleQuantityChange={handleQuantityChange}
        handleRemoveItem={handleRemoveItem}
        handleClearCart={handleClearCart}
        onPayClick={openModal}
      />


      {selectedItem && <OptionModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

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

export default MenuPage;
