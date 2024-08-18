import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import './styles.css';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { ImSpinner9 } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { SiFampay } from "react-icons/si";
const CheckoutForm = ({ closeModal, cart, totalPrice}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [cardError, setCardError] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const [,refetch] = useCart()

  useEffect(() => {
    if (totalPrice && totalPrice > 1) {
      getClientSecret({ price: totalPrice });
    }
  }, [totalPrice]);

  const getClientSecret = async (price) => {
    const { data } = await axiosSecure.post('/create-payment-intent', price);
    setClientSecret(data.clientSecret);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (card == null) {
      setProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
      return;
    } else {
      setCardError('');
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: user?.email,
          name: user?.displayName,
        },
      },
    });

    if (confirmError) {
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        for (const item of cart) {
          const paymentInfo = {
            email: user?.email,
            transactionId: paymentIntent.id,
            status: 'pending',
            dateTime: new Date().toISOString(),
            productId: item.productId,
            productName: item.productName,
            brandName: item.brandName,
            productImage: item.productImage,
            description: item.description,
            price: item.price,
            category: item.category,
            ratings: item.ratings,
            discount: item.discount,
            quantity: item.quantity,
          };

          await axiosSecure.post('/buy', paymentInfo);

          // Delete item from cart
          await axiosSecure.delete(`/carts/${item._id}`);
        }

        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Congratulations!',
          text: 'Your payment was successful. Thank you for your purchase!',
          footer: '<a href="/products">Continue Shopping</a>',
        }).then(() => {
          // Refetch cart data to update the UI
          if (typeof refetch === 'function') {
            refetch();
          } else {
            console.error('refetch is not a function');
          }

          // Navigate to "My Purchase" page
          navigate('/myPurchase');

          // Close the modal
          closeModal();
        });
      } catch (error) {
        setCardError('There was an issue processing your payment. Please contact support.');
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
     <button
  disabled={!stripe || !clientSecret || processing}
  className={`mt-6 w-full bg-gradient-to-r from-blue-400 to-blue-600 text-black font-semibold py-3 px-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
    processing ? 'opacity-50 cursor-not-allowed' : ''
  } flex items-center justify-center space-x-2`}
>
  {processing ? (
    <ImSpinner9 className="animate-spin" size={24} />
  ) : (
    <>
      <SiFampay size={24} />
      <span>Payment Now ${totalPrice}</span>
    </>
  )}
</button>

    </form>
  );
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default CheckoutForm;
