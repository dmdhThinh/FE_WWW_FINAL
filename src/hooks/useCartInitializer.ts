import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems, selectCartInitialized } from '@/redux/features/cart-slice';
import { AppDispatch } from '@/redux/store';

/**
 * Hook to initialize cart data only once when the app starts
 * Call this hook in your main layout or root component
 */
export const useCartInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialized = useSelector(selectCartInitialized);

  useEffect(() => {
    // Only fetch cart data if it hasn't been initialized yet
    if (!isInitialized) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isInitialized]);

  return { isInitialized };
};