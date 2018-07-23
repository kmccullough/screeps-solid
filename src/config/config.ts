
export const defaultCreepState = 'idle';

export const creepStateTransitions = [
  { name: 'idle',                     to: 'idle' },
  { name: 'next', from: 'idle',       to: 'hauling' },
  { name: 'next', from: 'hauling',    to: 'harvesting' },
  { name: 'next', from: 'harvesting', to: 'storing' },
  { name: 'next', from: 'storing',    to: 'idle' },
  { name: 'store',                    to: 'storing' },
];
