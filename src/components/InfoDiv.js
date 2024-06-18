import React, { useState } from 'react';
import './InfoDiv.css';

const InfoDiv = () => {
  const [activeTab, setActiveTab] = useState(0);
  const customFontStyle = {
    fontFamily: 'sans-serif',
  };
  const tabs = [
    {
      id: 0,
      label: 'Faculty',
      content: (
        <p>
          Promotes accountability by maintaining up-to-date profiles and providing
          tools to streamline tasks, enabling faculty members to focus on student
          engagement.
        </p>
      ),
    },
    {
      id: 1,
      label: 'Dean',
      content: (
        <p>
          A centralized platform is available for deans to manage faculty life-cycle
          progressions, including workload, reviews, evaluations, advancements,
          and professional development activities.
        </p>
      ),
    },
    {
      id: 2,
      label: 'Administrator',
      content: (
        <p style={customFontStyle}>
          Administrators can efficiently configure workflows to reduce manual work
          and gather insightful data from multiple systems to meet
          accreditation and compliance requirements.
        </p>
      ),
    },
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: 'xx-large' }}>Faculty Management Software that caters to everyone's needs</h1>
      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active-tab' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className={`content ${activeTab === 0 ? 'active-content' : ''}`}>
        {tabs[0].content}
      </div>
      <div className={`content ${activeTab === 1 ? 'active-content' : ''}`}>
        {tabs[1].content}
      </div>
      <div className={`content ${activeTab === 2 ? 'active-content' : ''}`}>
        {tabs[2].content}
      </div>
    </div>
  );
};

export default InfoDiv;
