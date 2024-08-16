import logo from '../../../assets/logo.gif';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaCar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <div>
            <div className="footer bg-gray-900 text-gray-100 p-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside>
                        <img src={logo} alt="Logo" className="w-24 rounded-md h-24 mb-4"/>
                        <p className="text-lg text-orange-600 font-semibold">Yusuf's CarEra</p>
                        <p className="mt-2">
                            Your trusted partner in finding the perfect car since 1992.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-gray-100"><FaFacebookF size={20}/></a>
                            <a href="#" className="text-gray-400 hover:text-gray-100"><FaTwitter size={20}/></a>
                            <a href="#" className="text-gray-400 hover:text-gray-100"><FaInstagram size={20}/></a>
                            <a href="#" className="text-gray-400 hover:text-gray-100"><FaLinkedinIn size={20}/></a>
                        </div>
                    </aside>
                    <nav>
                        <h6 className="footer-title text-xl font-bold text-gray-200">Services</h6>
                        <a className="link link-hover text-gray-400 hover:text-white">New Cars</a>
                        <a className="link link-hover text-gray-400 hover:text-white">Used Cars</a>
                        <a className="link link-hover text-gray-400 hover:text-white">Car Financing</a>
                        <a className="link link-hover text-gray-400 hover:text-white">Car Warranty</a>
                    </nav>
                    <nav>
                        <h6 className="footer-title text-xl font-bold text-gray-200">Company</h6>
                        <a className="link link-hover text-gray-400 hover:text-white">About Us</a>
                        <a className="link link-hover text-gray-400 hover:text-white">Contact</a>
                        <a className="link link-hover text-gray-400 hover:text-white">Careers</a>
                        <a className="link link-hover text-gray-400 hover:text-white">Blog</a>
                    </nav>
                    <nav>
                        <h6 className="footer-title text-xl font-bold text-gray-200">Legal</h6>
                        <a className="link link-hover text-gray-400 hover:text-white">Terms of Service</a>
                        <a className="link link-hover text-gray-400 hover:text-white">Privacy Policy</a>
                        <a className="link link-hover text-gray-400 hover:text-white">Cookie Policy</a>
                    </nav>
                </div>
            </div>
            <div className="bg-gray-800 text-gray-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center">
                        <FaPhoneAlt className="mr-3 text-gray-400" />
                        <p className="text-gray-400">+8801729804092</p>
                    </div>
                    <div className="flex items-center">
                        <FaEnvelope className="mr-3 text-gray-400" />
                        <p className="text-gray-400">support@YusufCarEra.com</p>
                    </div>
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-3 text-gray-400" />
                        <p className="text-gray-400">123 CarEra St, Dhaka, Bangladesh</p>
                    </div>
                </div>
            </div>
            <div className="footer footer-center bg-gray-700 text-gray-100 p-4">
                <aside>
                    <p className="flex items-center justify-center space-x-2">
                        <FaCar className="text-yellow-500" />
                        <span>© {new Date().getFullYear()} Yusuf's CarEra - All rights reserved</span>
                    </p>
                </aside>
            </div>
        </div>
    );
};

export default Footer;
