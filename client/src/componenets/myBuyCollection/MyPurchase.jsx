import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { IoCarSportSharp } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { FaHashtag, FaTags, FaDollarSign } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';

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
            <Helmet>
                <title>Yusuf Car Era | My Purchase</title>
            </Helmet>
            <h2 className="text-3xl font-bold my-4 text-center">My Purchases</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-sm lg:text-lg border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-4 border border-gray-300"><FaHashtag className="inline-block mr-2" />#</th>
                            <th className="p-4 border border-gray-300"><FaTags className="inline-block mr-2" />Product</th>
                            <th className="p-4 border border-gray-300">Brand</th>
                            <th className="p-4 border border-gray-300"><FaDollarSign className="inline-block mr-2" />Price</th>
                            <th className="p-4 border border-gray-300">Category</th>
                            <th className="p-4 border border-gray-300"><SlCalender className="inline-block mr-2" />Date</th>
                            <th className="p-4 border border-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase, index) => (
                            <tr key={purchase._id} className="bg-white border-b lg:border-b-2 border-gray-300">
                                <td className="p-4 border border-gray-300 text-center text-blue-500">{index + 1}</td>
                                <td className="p-4 border border-gray-300 flex flex-col lg:flex-row items-start lg:items-center">
                                    <img src={purchase.productImage} alt={purchase.productName} className="w-12 h-12 lg:w-16 lg:h-16 mr-0 lg:mr-4" />
                                    <span className="text-blue-500">{purchase.productName}</span>
                                </td>
                                <td className="p-4 border border-gray-300 text-green-500">{purchase.brandName}</td>
                                <td className="p-4 border border-gray-300 flex items-center text-red-500">
                                    <IoCarSportSharp className="mr-2" />
                                    {purchase.price}
                                </td>
                                <td className="p-4 border border-gray-300 text-purple-500">{purchase.category}</td>
                                <td className="p-4 border border-gray-300 flex items-center text-yellow-500">
                                    <SlCalender className="mr-2" />
                                    {new Date(purchase.dateTime).toLocaleDateString()}
                                </td>
                                <td className={`p-4 border border-gray-300 ${purchase.status === 'pending' ? 'text-red-500' : 'text-green-500'}`}>
                                    {purchase.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyPurchase;
