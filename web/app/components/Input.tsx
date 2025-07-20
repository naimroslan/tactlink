import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = '', ...props }: Props) {
  return (
    <input
      className={`w-full border border-gray-300 rounded-lg p-3 mb-4 ${className}`}
      {...props}
    />
  );
}
