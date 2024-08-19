import React from 'react';
import Slider from 'react-slick';
import { Helmet } from 'react-helmet';
import { GiAutoRepair, GiCarDoor, GiCargoShip, GiF1Car, GiMoneyStack, GiSupersonicArrow, GiZebraShield } from "react-icons/gi";
// Import your images
import car from '../../../assets/car1.gif';
import car3 from '../../../assets/car3.gif';
import car4 from '../../../assets/car4.gif';
import car5 from '../../../assets/car5.gif';
import car6 from '../../../assets/car6.gif';
import car8 from '../../../assets/car8.gif';
import car9 from '../../../assets/car9.gif';

const Banner = () => {
    const settings = {
        dots: false, // Remove dots
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const slides = [
        { 
            src: car, 
            alt: "Car 1", 
            title: "Explore the Speed", 
            description: "Experience unmatched speed with our high-performance cars. Perfect for those who love to feel the thrill of the road.",
            buttonText: "Check Speed"
        },
        { 
            src: car3, 
            alt: "Car 3", 
            title: "Luxury at its Best", 
            description: "Indulge in luxury with our top-of-the-line cars, designed to offer the utmost comfort and style.",
            buttonText: "View Luxury"
        },
        { 
            src: car4, 
            alt: "Car 4", 
            title: "Drive the Future", 
            description: "Step into the future with cutting-edge technology and innovative designs in our latest models.",
            buttonText: "Explore Future"
        },
        { 
            src: car5, 
            alt: "Car 5", 
            title: "Family-Friendly Rides", 
            description: "Our spacious and safe cars are perfect for family outings, ensuring everyone enjoys the journey.",
            buttonText: "View Family Cars"
        },
        { 
            src: car6, 
            alt: "Car 6", 
            title: "Fuel Efficiency Redefined", 
            description: "Save more on fuel with our range of fuel-efficient cars, without compromising on performance.",
            buttonText: "Check Efficiency"
        },
        { 
            src: car8, 
            alt: "Car 8", 
            title: "Innovative Technology", 
            description: "Experience the latest in automotive technology with features designed to enhance your driving experience.",
            buttonText: "Discover Technology"
        },
        { 
            src: car9, 
            alt: "Car 9", 
            title: "Affordable and Stylish", 
            description: "Get the best value for your money with our stylish yet affordable cars, perfect for every budget.",
            buttonText: "Shop Now"
        },
    ];

    return (
        <div className="relative w-full max-w-7xl mx-auto py-12 mb-10">
             <Helmet>
                <title>Yusuf Car Era | Car's World</title>
            </Helmet>
            {/* Carousel */}
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="relative">
                        <div 
                            className="w-full h-[500px] bg-cover bg-center rounded-lg shadow-2xl"
                            style={{ backgroundImage: `url(${slide.src})` }}
                        >
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-blue-200 bg-blue-900 bg-opacity-50 p-8 rounded-lg">
                                <h2 className="text-4xl font-bold mb-4 text-blue-100">{slide.title}</h2>
                                <p className="text-lg max-w-2xl mb-6 text-blue-200">{slide.description}</p>
                                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300 flex items-center">
                                    {slide.buttonText} <GiF1Car className="ml-2 w-10 h-11 text-orange-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Announcement */}
            <div className="absolute top-0 left-0 right-0 mx-auto w-full bg-gradient-to-r from-blue-500 to-orange-500 py-4 text-center text-white z-10">
                <p className="text-xl font-bold text-black animate-pulse flex items-center justify-center gap-10"><GiCargoShip className='text-zinc-50' />   Stay Tuned! More Discounts Coming Soon! <GiSupersonicArrow className='text-red-600' /></p>
            </div>

            {/* Static Cards Section */}
            <div className="relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 z-10 px-4">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-50 transition-colors duration-300">
                    <GiMoneyStack className="text-4xl text-orange-500 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold mb-2 text-blue-600">Best Price Guarantee</h3>
                    <p className="text-black font-bold">Get the best deals on your dream cars with our unmatched price guarantee.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-50 transition-colors duration-300">
                    <GiCarDoor className="text-4xl text-orange-500 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold mb-2 text-blue-600">Luxury Cars</h3>
                    <p className="text-black font-bold">Experience luxury like never before with our top-of-the-line car models.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-50 transition-colors duration-300">
                    <GiAutoRepair className="text-4xl text-orange-500 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold mb-2 text-blue-600">Advanced Technology</h3>
                    <p className="text-black font-bold">Drive into the future with the latest automotive innovations and features.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-50 transition-colors duration-300">
                    <GiZebraShield className="text-4xl text-orange-500 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold mb-2 text-blue-600">Safety First</h3>
                    <p className="text-black font-bold">Our cars are equipped with the best safety features for your peace of mind.</p>
                </div>
            </div>
        </div>
    );
};

export default Banner;
