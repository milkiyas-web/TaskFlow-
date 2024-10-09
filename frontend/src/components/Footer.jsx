import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const FooterSection = ({ title, links }) => (
    <div className="flex flex-col space-y-2">
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        {links.map((link, index) => (
            <a key={index} href="#" className="text-gray-400 hover:text-white">
                {link}
            </a>
        ))}
    </div>
);

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white py-12 px-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-start flex-wrap">
                    <div className="mb-8 md:mb-0">
                        <h2 className="text-2xl font-bold mb-4">TaskFlow</h2>
                        <div className="flex space-x-4 mt-4">
                            <FaTwitter className="text-gray-400 hover:text-white cursor-pointer" />
                            <FaLinkedin className="text-gray-400 hover:text-white cursor-pointer" />
                            <FaGithub className="text-gray-400 hover:text-white cursor-pointer" />
                        </div>
                    </div>

                    <FooterSection
                        title="Platform"
                        links={['Overview', 'Features', 'Integrations', 'Pricing']}
                    />

                    <FooterSection
                        title="Solutions"
                        links={['Predictive Analytics', 'Data Visualization', 'Real-time Analytics']}
                    />

                    <FooterSection
                        title="Company"
                        links={['About Us', 'Team', 'Partners', 'Contact']}
                    />


                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 flex justify-between items-center flex-wrap">
                    <div className="flex items-center space-x-2">
                        <img src="/path-to-flag-icon.png" alt="US Flag" className="w-6 h-4" />
                        { }
                    </div>
                    <p className="text-gray-400">© TaskFlow {currentYear}. All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
