import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AiOutlineShoppingCart, AiFillStar, AiOutlineInfoCircle } from 'react-icons/ai';
import { MdDirectionsCar } from 'react-icons/md';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { format } from 'date-fns';
import { useSpring, animated } from '@react-spring/web';
import Select from 'react-select';
import { IoMdArrowDropdown } from 'react-icons/io';
import Slider from '@mui/material/Slider'; // Import from MUI

import Swal from 'sweetalert2'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
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
    const [priceRange, setPriceRange] = useState([0, 500000]); // Default price range
    const [sortOption, setSortOption] = useState(''); // State for selected sort option
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const axiosCommon = useAxiosCommon();
    const location = useLocation()
    const navigate = useNavigate()
    const axiosSecure = useAxiosSecure()
    const {user} = useAuth()
    const [, refetch] = useCart()

    const { data,  isLoading, error } = useQuery({
        queryKey: [
            'cars',
            selectedCategory,
            selectedBrand,
            priceRange,
            sortOption,
            currentPage,
            itemsPerPage,
        ],
        queryFn: async () => {
            const res = await axiosCommon.get('/cars', {
                params: {
                    category: selectedCategory,
                    brandName: selectedBrand,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    sort: sortOption,
                    page: currentPage,
                    limit: itemsPerPage,
                },
            });
            return res.data; // Ensure the structure returned here has 'cars'
        },
        keepPreviousData: true, 
        refetchOnWindowFocus: false,
    });
    
    const cars = data?.cars || [];
    

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
    
    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handlePriceRangeCommit = () => {
        refetch();
    };
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        refetch(); // Refetch data with the new sorting option
    };
    
    const totalPages = data?.totalPages || 1; // Total pages from the response, ensure your API returns this

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            refetch(); // Trigger refetch when page changes
        }
    };

    //Cart post Start Now -----
    const handleAddToCart = (product) => {
        if (user && user.email) {
            // Prepare the cart item object with all relevant details
            const cartItem = {
                email: user?.email,
                productId: product._id,
                productName: product.productName,
                brandName: product.brandName,
                productImage: product.productImage,
                description: product.description,
                price: product.price,
                category: product.category,
                ratings: product.ratings,
                creationDate: product.creationDate,
                discount: product.discount, // Include the discount object
                quantity: 1 // Default quantity, can be changed later
            };
    
            axiosSecure.post('/carts', cartItem).then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `${product.productName} Added To Cart`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    refetch();
                }
            });
        } else {
            Swal.fire({
                title: "You Are Not Logged In",
                text: "Please Login To Add To The Cart?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Login Now!"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login', { state: { from: location } });
                }
            });
        }
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

            <div className="mb-8 grid bg-gray-100 p-4 rounded-lg shadow-md  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:justify-center lg:justify-center justify-items-center">
    <div className="flex flex-col items-center w-full">
        <span className="text-gray-700 font-semibold">Price Range: ${priceRange[0]} - ${priceRange[1]}</span>
        <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            onChangeCommitted={handlePriceRangeCommit}
            valueLabelDisplay="auto"
            min={0}
            max={500000}
            step={1000}
            className="w-full sm:w-64"
        />
    </div>
    <div className="flex flex-col lg:ml-20 justify-between items-center w-full">
        <div className="w-full"> 
            <select
                value={sortOption}
                onChange={handleSortChange}
                className="mt-1 block w-full p-3 px-4 border border-gray-300 rounded-md" 
            >
                <option value="">Filter Your Price And Show New Cars</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="date-desc">Date Added: Newest First</option>
            </select>
        </div>
    </div>
    <div className="flex flex-col justify-between items-center w-full">
        <Select
            value={options.find(option => option.value === selectedBrand)}
            onChange={handleBrandChange}
            options={options}
            styles={{
                ...customStyles,
                control: (provided) => ({
                    ...provided,
                    padding: '0.5rem',
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    width: '100%',
                    minWidth: '300px',
                }),
                menu: (provided) => ({
                    ...provided,
                    padding: '0.5rem',
                }),
            }}
            components={{ DropdownIndicator: () => <IoMdArrowDropdown /> }}
            formatOptionLabel={({ label, icon }) => (
                <div className="flex items-center">
                    {icon && <span className="mr-2 text-blue-500">{icon}</span>}
                    {label}
                </div>
            )}
            placeholder="Select Your Brand"
            className="w-full sm:w-64"
        />
    </div>
</div>




            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map(car => (
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
                            <button 
                            onClick={()=> handleAddToCart(car)}
                             className="bg-blue-500 text-white py-2 px-4 rounded flex items-center hover:bg-blue-600 transition">
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
                                <h3 className="text-lg font-semibold mb-2">{car.description}</h3>
                                <p className="text-gray-700">{car.additionalInfo}</p>
                            </div>
                        )}
                    </animated.div>
                ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
                <button
                    className="px-4 py-2 mx-1 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                {[...Array(totalPages).keys()].map((_, index) => (
                    <button
                        key={index + 1}
                        className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-orange-500 text-white' : 'text-gray-700 bg-white'} border border-gray-300 rounded-md hover:bg-gray-100`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="px-4 py-2 mx-1 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
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
