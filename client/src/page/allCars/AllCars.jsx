import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AiOutlineShoppingCart, AiFillStar, AiOutlineInfoCircle } from 'react-icons/ai';
import { MdDirectionsCar } from 'react-icons/md';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { format } from 'date-fns';
import { useSpring, animated } from '@react-spring/web';
import Select from 'react-select';
import { IoMdArrowDropdown } from 'react-icons/io';

// Custom styles for react-select
const customStyles = {
    option: (provided) => ({
        ...provided,
        padding: 20,
        borderBottom: '2px solid #e5e7eb', // Color of the line
    }),
    menu: (provided) => ({
        ...provided,
        marginTop: 0,
    }),
    control: (provided) => ({
        ...provided,
        borderRadius: '8px',
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
        fontSize: '16px',
        fontWeight: 'bold',
    }),
    singleValue: (provided) => ({
        ...provided,
        fontWeight: 'bold',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#007bff', // Color of the dropdown arrow
    }),
};

const options = [
    { value: '', label: 'Select Your Brand', icon: null },
    { value: 'Rolls-Royce', label: 'Rolls-Royce', icon: <MdDirectionsCar /> },
    { value: 'Toyota', label: 'Toyota', icon: <MdDirectionsCar /> },
    { value: 'Mercedes-Benz', label: 'Mercedes-Benz', icon: <MdDirectionsCar /> },
    { value: 'BMW', label: 'BMW', icon: <MdDirectionsCar /> },
    { value: 'Subaru', label: 'Subaru', icon: <MdDirectionsCar /> },
    { value: 'Audi', label: 'Audi', icon: <MdDirectionsCar /> },
    { value: 'Tesla', label: 'Tesla', icon: <MdDirectionsCar /> },
    { value: 'Chevrolet', label: 'Chevrolet', icon: <MdDirectionsCar /> },
    { value: 'Ford', label: 'Ford', icon: <MdDirectionsCar /> },
    { value: 'Honda', label: 'Honda', icon: <MdDirectionsCar /> },
    { value: 'Nissan', label: 'Nissan', icon: <MdDirectionsCar /> },
    { value: 'Volkswagen', label: 'Volkswagen', icon: <MdDirectionsCar /> },
    { value: 'Lexus', label: 'Lexus', icon: <MdDirectionsCar /> },
];

const AllCars = () => {
    const [infoIconClicked, setInfoIconClicked] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const axiosCommon = useAxiosCommon();

    const { data: allCars = [], refetch, isLoading, error } = useQuery({
        queryKey: ['cars', selectedCategory, selectedBrand],
        queryFn: async () => {
            const res = await axiosCommon.get('/cars', {
                params: { category: selectedCategory, brandName: selectedBrand } // Ensure brandName is used
            });
            return res.data;
        },
        refetchOnWindowFocus: false,
    });

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        refetch();
    };

    const handleBrandChange = (option) => {
        setSelectedBrand(option.value);
        refetch();
    };

    const springProps = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { duration: 500 }
    });

    const handleInfoIconClick = (carId) => {
        setInfoIconClicked(prev => (prev === carId ? null : carId));
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <span className="loading loading-ring loading-lg" style={{ width: '6rem', height: '6rem' }}></span>
        </div>
    );
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Yusuf Car Era</h1>
            <p className="text-center text-gray-600 mb-8">
                Welcome to Yusuf Car Era, where luxury meets craftsmanship. Discover our exclusive collection of cars designed to meet your desires.
            </p>

            <div className="mb-8 bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex flex-wrap gap-2 justify-center ">
                    {['All', 'Luxury', 'Family Car', 'SUV', 'Compact Car', 'Sports Car', 'Electric Car', 'Truck', 'Sedan'].map(category => (
                        <a
                            key={category}
                            className={`tab ${selectedCategory === category ? 'tab-active' : 'text-gray-700'} flex items-center justify-center px-4 rounded-lg transition-colors ${selectedCategory === category ? `bg-${getColorForCategory(category)} text-black font-semibold` : 'bg-gray-200 hover:bg-gray-300'}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </a>
                    ))}
                </div>
            </div>

            <div className="mb-8 flex justify-evenly bg-gray-100 p-4 rounded-lg shadow-md">
                <h1>hie Yoooo</h1>
                <Select
                    value={options.find(option => option.value === selectedBrand)}
                    onChange={handleBrandChange}
                    options={options}
                    styles={customStyles}
                    components={{ DropdownIndicator: () => <IoMdArrowDropdown /> }}
                    formatOptionLabel={({ label, icon }) => (
                        <div className="flex items-center">
                            {icon && <span className="mr-2 text-blue-500">{icon}</span>}
                            {label}
                        </div>
                    )}
                    placeholder="Select Your Brand"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCars.map(car => (
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
                        <p className="text-green-600 font-semibold mb-2"><span className='text-blue-600'>Price :</span> ${car.price.toLocaleString()}</p>
                        {car.discount && (
                            <p className="text-red-600 font-semibold mb-2"><span className='text-yellow-800'>Discount:</span> {car.discount.percentage}% off - Save ${car.discount.amount.toLocaleString()}</p>
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

const getColorForCategory = (category) => {
    switch (category) {
        case 'Luxury': return 'purple-200';
        case 'Family Car': return 'green-200';
        case 'SUV': return 'orange-200';
        case 'Compact Car': return 'blue-200';
        case 'Sports Car': return 'red-200';
        case 'Electric Car': return 'teal-200';
        case 'Truck': return 'yellow-200';
        case 'Sedan': return 'pink-200';
        default: return 'gray-200';
    }
};

export default AllCars;
