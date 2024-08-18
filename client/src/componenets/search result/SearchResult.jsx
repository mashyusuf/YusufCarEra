import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { animated, useSpring } from '@react-spring/web';
import { MdDirectionsCar } from 'react-icons/md';
import { AiFillStar, AiOutlineShoppingCart, AiOutlineInfoCircle, AiOutlineArrowLeft } from 'react-icons/ai';
import { format } from 'date-fns';
import useAxiosCommon from '../../hooks/useAxiosCommon';

const SearchResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [infoIconClicked, setInfoIconClicked] = useState(null);
    const axiosCommon = useAxiosCommon();

    useEffect(() => {
        const fetchResults = async () => {
            const query = new URLSearchParams(location.search).get('query');
            if (query) {
                try {
                    const response = await axiosCommon.get(`/cars?query=${encodeURIComponent(query)}`);
                    setResults(response.data.cars);
                } catch (err) {
                    setError('Error fetching search results');
                }
            }
            setLoading(false);
        };

        fetchResults();
    }, [location.search]);

    const handleInfoIconClick = (id) => {
        setInfoIconClicked(infoIconClicked === id ? null : id);
    };

    const springProps = useSpring({ opacity: 1, from: { opacity: 0 } });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white py-2 px-4 rounded flex items-center mb-6 hover:bg-blue-600 transition"
                style={{ position: 'relative', left: 0 }}
            >
                <AiOutlineArrowLeft className="mr-2" />
                Go Back
            </button>
            <h1 className="text-2xl font-bold text-center my-6">Search Results</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-8">
                {results.map(car => (
                    <animated.div
                        key={car._id}
                        style={springProps}
                        className="border p-4 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 bg-gradient-to-r from-cyan-200 via-white to-rose-200"
                    >
                        <img
                            src={car.productImage}
                            alt={car.productName}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                            <MdDirectionsCar className="mr-2 text-blue-500" />
                            {car.productName}
                        </h2>
                        <p className="text-gray-600 mb-2">Brand: {car.brandName}</p>
                        <p className="text-gray-600 mb-2">Category: {car.category}</p>
                        <p className="text-green-600 font-semibold mb-2">
                            <span className="text-blue-600">Price:</span> ${car.price.toLocaleString()}
                        </p>
                        {car.discount && (
                            <p className="text-red-600 font-semibold mb-2">
                                <span className="text-yellow-800">Discount:</span> {car.discount.percentage}% off - Save ${car.discount.amount.toLocaleString()}
                            </p>
                        )}
                        <p className="text-gray-600 mb-2">
                            Rating: {car.ratings} <AiFillStar className="inline text-yellow-500" />
                        </p>
                        <p className="text-gray-600 mb-2">
                            Added on: {format(new Date(car.creationDate), 'dd MMM yyyy')}
                        </p>
                        <p className="text-gray-600 mb-4">
                            {car.description.split(' ').slice(0, 10).join(' ')}...
                        </p>
                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 text-white py-2 px-4 rounded flex items-center hover:bg-blue-600 transition">
                                <AiOutlineShoppingCart className="mr-2" />
                                Add to Cart
                            </button>
                            <AiOutlineInfoCircle
                                onClick={() => handleInfoIconClick(car._id)}
                                className={`cursor-pointer transition-all ${
                                    infoIconClicked === car._id
                                        ? 'text-orange-500 text-2xl font-bold'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            />
                        </div>
                        {infoIconClicked === car._id && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                <h3 className="text-lg font-semibold mb-2">More Information</h3>
                                <p className="text-gray-700">{car.additionalInfo}</p>
                            </div>
                        )}
                    </animated.div>
                ))}
            </div>
        </div>
    );
};

export default SearchResult;
