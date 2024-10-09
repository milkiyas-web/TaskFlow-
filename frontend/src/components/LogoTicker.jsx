import React from 'react'
import logo1 from '../assets/logog1.png'
import logo2 from '../assets/logo2.png'
import logo3 from '../assets/logo3.png'
import logo4 from '../assets/logo4.png'
import logo5 from '../assets/logo5.png'
import logo6 from '../assets/logo6.png'

const LogoTicker = () => {
    const logos = [logo1, logo2, logo3, logo4, logo5, logo6]

    return (
        <div className="py-8 mt-8 mb-24 md:py-12">
            <h2 className="text-center text-3xl font-bold mb-4">Powering the world's best product teams.</h2>
            <p className="text-center text-xl text-gray-500 mb-8">From next-gen startups to established enterprises.</p>
            <div className="flex justify-center items-center flex-wrap gap-12">
                {logos.map((logo, index) => (
                    <img
                        key={index}
                        src={logo}
                        alt={`Company logo ${index + 1}`}
                        className="h-8 w-auto"
                    />
                ))}
            </div>
        </div>
    )
}

export default LogoTicker
