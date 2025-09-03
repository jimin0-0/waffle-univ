import React from "react";

function MenuItemCard({ item, onClick }) {
  return (
    <div className="menu-item-card" onClick={() => onClick(item)} style={{ cursor: "pointer" }}>
      <img src={item.image} alt={item.name} className="menu-image" />
      <div className="menu-name">{item.name}</div>
      <div className="menu-price">{item.price.toLocaleString()}원</div>
      <div className="menu-kcal">{item.kcal}kcal</div>
    </div>
  );
}

export default MenuItemCard;
