"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface HomeClientProps {
  faqData: FaqItem[];
}

export default function HomeClient({ faqData }: HomeClientProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="faq-container">
      {faqData.map((item, index) => (
        <div
          key={index}
          className={`faq-item ${activeFaq === index ? "active" : ""}`}
          onClick={() => toggleFaq(index)}
        >
          <div className="faq-question">
            <span>{item.question}</span>
            <span>{activeFaq === index ? "−" : "+"}</span>
          </div>
          <div className="faq-answer">{item.answer}</div>
        </div>
      ))}
    </div>
  );
}
