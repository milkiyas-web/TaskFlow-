import React from 'react'
import dashImage from '../assets/dashhimg.png'
import GradientBackground from './GradientBackground'
import { BorderBeam } from "@/components/ui/border-beam";

const DashImage = () => {
    return (
        <div className="mt-12 relative w-11/12 max-w-6xl mx-auto h-[80vh] bg-black/90 overflow-hidden rounded-xl">
            <GradientBackground>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <img
                        src={dashImage}
                        alt="Dashboard"
                        className="rounded-lg shadow-2xl max-w-full max-h-full object-contain opacity-90"
                    />
                </div>
                <BorderBeam />
            </GradientBackground>
        </div>
    )
}

export default DashImage