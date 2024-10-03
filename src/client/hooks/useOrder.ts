import { useState } from 'react';
import { createOrder } from '../services/orderService';

const useOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async (orderData: any) => {
    setLoading(true);
    try {
      await createOrder(orderData);
      // handle successful order
    } catch (err) {
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, placeOrder };
};

export default useOrder;
