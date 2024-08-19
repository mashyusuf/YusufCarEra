import React, { useState } from 'react';
import useCart from '../../hooks/useCart';
import { FaTrash, FaRegStar, FaCreditCard, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../form/CheckOutFrom';
import { Helmet } from 'react-helmet';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const MyCartItem = () => {
    const [cart, setCart,refetch] = useCart();
    const axiosSecure = useAxiosSecure();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate the total price considering discounts
    const totalPrice = cart.reduce((sum, item) => {
        const discountAmount = item.discount?.amount || 0;
        const itemTotal = (item.price - discountAmount) * (item.quantity || 1);
        return sum + itemTotal;
    }, 0);

    const handleDelete = (itemId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/carts/${itemId}`)
                    .then(() => {
                        setCart(cart.filter(item => item._id !== itemId));
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your item has been deleted.",
                            icon: "success"
                        });
                    })
                    .catch(() => {
                        Swal.fire({
                            title: "Error!",
                            text: "Something went wrong!",
                            icon: "error"
                        });
                    });
            }
        });
    };

    const handlePayNowClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4"> 
        <Helmet>
                <title>Yusuf Car Era | Your Cart Items</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-center mb-6 text-sky-600">Yusuf Car Era - Your Cart</h1>
            <div className="flex justify-around items-center mb-6">
                <h2 className="text-xl font-semibold mb-4">Total Cars: {cart.length}</h2>
                <h2 className="text-2xl text-orange-600 font-bold mb-6">Total Price: ${totalPrice.toFixed(2)}</h2>
                <button 
                    className="bg-blue-500 text-gray-200 font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition duration-300"
                    onClick={handlePayNowClick}
                >
                    <FaCreditCard className="w-5 h-5" />
                    <span className='text-black'>Pay Now</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr className="text-left">
                            <th className="p-4 text-xl font-bold">Image</th>
                            <th className="p-4 text-xl font-bold">Product Name</th>
                            <th className="p-4 text-xl font-bold">Description</th>
                            <th className="p-4 text-xl font-bold">Discount Price</th>
                            <th className="p-4 text-xl font-bold">User Email</th>
                            <th className="p-4 text-xl font-bold">Brand</th>
                            <th className="p-4 text-xl font-bold">Category</th>
                            <th className="p-4 text-xl font-bold">Rating</th>
                            <th className="p-4 text-xl font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item._id} className="border-t">
                                <td className="p-4">
                                    <img src={item.productImage} alt={item.productName} className="w-24 h-24 object-cover" />
                                </td>
                                <td className="p-4 text-lg font-semibold">{item.productName}</td>
                                <td className="p-4 text-lg">{item.description}</td>
                                <td className="p-4 text-lg text-green-600 font-bold">
                                    ${item.price - item.discount.amount} 
                                    <span className="text-red-500 ml-2">(-${item.discount.amount})</span>
                                </td>
                                <td className="p-4 text-lg">{item.email}</td>
                                <td className="p-4 text-lg">{item.brandName}</td>
                                <td className="p-4 text-lg">{item.category}</td>
                                <td className="p-4 text-lg">
                                    <FaRegStar className="inline text-yellow-500" /> {item.ratings}
                                </td>
                                <td className="p-4 text-lg">
                                    <button 
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
                    <div 
                        className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative"
                        onClick={(e) => e.stopPropagation()}  // Prevent click from closing modal when clicking inside content
                    >
                        <button 
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                            onClick={closeModal}
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item._id} className="flex justify-between">
                                    <span>{item.productName} (x{item.quantity})</span>
                                    <span className="font-bold">${(item.price - item.discount.amount) * (item.quantity || 1)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between text-xl mb-4 font-bold">
                                <span>Total Price :</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <Elements  stripe={stripePromise}>
                            {/*Check Out Form*/}
                            <CheckoutForm refetch={refetch} closeModal={closeModal} cart={cart} totalPrice={totalPrice}></CheckoutForm>
                        </Elements>
                       
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCartItem;
