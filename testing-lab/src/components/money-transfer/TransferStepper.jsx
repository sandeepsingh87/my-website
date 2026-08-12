import React from 'react';
import { tid } from '../../lib/money-transfer/tid.js';

const STEPS = [
  { id: 'amount', label: 'Amount' },
  { id: 'receiver', label: 'Receiver' },
  { id: 'review', label: 'Review' },
  { id: 'receipt', label: 'Receipt' }
];

export default function TransferStepper({ current }) {
  const index = STEPS.findIndex((step) => step.id === current);
  return (
    <ol className="mt-stepper" {...tid('transfer-stepper')}>
      {STEPS.map((step, i) => {
        const state = i < index ? 'done' : i === index ? 'current' : 'todo';
        return (
          <li key={step.id} className={`mt-step-item ${state}`} {...tid(`transfer-step-${step.id}`)}>
            <span className="mt-step-num">{i + 1}</span>
            <span>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
