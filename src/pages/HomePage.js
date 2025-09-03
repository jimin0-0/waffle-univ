import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            <div className="background">
                <div className="choice-container">
                    <button onClick={() => navigate('/menu')} className="choice-button">
                        <img src="/images/waffle.png" alt="매장식사" />
                        <div>매장식사<br /><span>Eat in</span></div>
                    </button>
                    <button onClick={() => navigate('/menu')} className="choice-button">
                        <img src="/images/takeout.png" alt="포장" />
                        <div>포장<br /><span>Take out</span></div>
                    </button>
                </div>
                <div className="notice-box">
                    <div className="notice-left">
                        <p>알림</p>
                        <img src="/images/bell.png" alt="bell" className="notice-icon" />
                    </div>
                    <div className="notice-right">
                        <p>
                            젤라또와플은 포장이 어렵습니다.<br />
                            매장 내 1회용품(Cup) 사용이 불가합니다.<br />
                            쿠폰 발급 및 사용은 데스크에 문의바랍니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;