"use client"
import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        className: 'font-body-md',
        style: {
          background: 'hsl(var(--surface-container-lowest))',
          border: '1px solid hsl(var(--outline-variant))',
          color: 'hsl(var(--on-surface))',
        },
      }}
    />
  );
}
