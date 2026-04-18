import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import siteConfig from '../config/siteConfig.json';

function FAQPage() {
  const { faq } = siteConfig.customerServicePages;
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container py-5">
      <Link to="/" className="back-link"><FiArrowLeft size={14} /> Back to Home</Link>
      <div className="cs-page-header">
        <FiHelpCircle size={32} style={{ color: 'var(--spiritual-teal)' }} />
        <h1>{faq.title}</h1>
        <p>{faq.subtitle}</p>
      </div>

      <div className="faq-list">
        {faq.faqs.map((item, idx) => (
          <div key={idx} className={`faq-item ${openIndex === idx ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggleFAQ(idx)}>
              <span>{item.question}</span>
              {openIndex === idx ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </button>
            <div className={`faq-answer ${openIndex === idx ? 'faq-answer-open' : ''}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQPage;
