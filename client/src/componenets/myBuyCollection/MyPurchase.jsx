import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { IoCarSportSharp } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const MyPurchase = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: purchases = [], isLoading, error } = useQuery({
        queryKey: ['purchase', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/myPurchase/${user?.email}`);
            return res.data;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold my-4 text-center">My Purchases</h2>
            <table className="table-auto w-full text-xl">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-4">#</th>
                        <th className="p-4">Product</th>
                        <th className="p-4">Brand</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((purchase, index) => (
                        <tr key={purchase._id} className="bg-white border-b">
                            <td className="p-4">{index + 1}</td>
                            <td className="p-4 flex items-center">
                                <img src={purchase.productImage} alt={purchase.productName} className="w-16 h-16 mr-4" />
                                <span>{purchase.productName}</span>
                            </td>
                            <td className="p-4">{purchase.brandName}</td>
                            <td className="p-4 flex items-center">
                                <IoCarSportSharp className="mr-2" />
                                {purchase.price}
                            </td>
                            <td className="p-4">{purchase.category}</td>
                            <td className="p-4 flex items-center">
                                <SlCalender className="mr-2" />
                                {new Date(purchase.dateTime).toLocaleDateString()}
                            </td>
                            <td className={`p-4 ${purchase.status === 'pending' ? 'text-red-500' : 'text-green-500'}`}>
                                {purchase.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyPurchase;
