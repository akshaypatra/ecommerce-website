import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import siteConfig from '../config/siteConfig.json';

function ReturnsExchangesPage() {
  const { returnsExchanges } = siteConfig.customerServicePages;

  return (
    <div className="container py-5">
      <Link to="/" className="back-link"><FiArrowLeft size={14} /> Back to Home</Link>
      <div className="cs-page-header">
        <FiRefreshCw size={32} style={{ color: 'var(--spiritual-teal)' }} />
        <h1>{returnsExchanges.title}</h1>
        <p>{returnsExchanges.subtitle}</p>
      </div>

      <div className="cs-content">
        {returnsExchanges.sections.map((section, idx) => (
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

export default ReturnsExchangesPage;
