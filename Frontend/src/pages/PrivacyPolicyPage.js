import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import siteConfig from '../config/siteConfig.json';

function PrivacyPolicyPage() {
  const { privacyPolicy } = siteConfig.customerServicePages;

  return (
    <div className="container py-5">
      <Link to="/" className="back-link"><FiArrowLeft size={14} /> Back to Home</Link>
      <div className="cs-page-header">
        <FiLock size={32} style={{ color: 'var(--spiritual-teal)' }} />
        <h1>{privacyPolicy.title}</h1>
        <p>{privacyPolicy.subtitle}</p>
      </div>

      <p className="cs-last-updated">Last updated: {privacyPolicy.lastUpdated}</p>

      <div className="cs-content">
        {privacyPolicy.sections.map((section, idx) => (
          <div key={idx} className="cs-section">
            <h3>{section.heading}</h3>
            <ul>
              {section.content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
