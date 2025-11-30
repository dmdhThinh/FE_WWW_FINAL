"use client";

import React from 'react';
import { useCartInitializer } from '@/hooks/useCartInitializer';

/**
 * Component to initialize cart data once when the app starts
 * Place this inside ReduxProvider to access Redux store
 */
const CartInitializer: React.FC = () => {
  useCartInitializer();

  return null; // This component doesn't render anything
};

export default CartInitializer;