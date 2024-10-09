import DashImage from "@/components/DashImage";
import Hero from "@/components/Hero";
import { BentoGridThirdDemo } from "@/components/BentoGrid";
import { SparklesPreview } from "@/components/SparklingFeature";
import LogoTicker from "@/components/LogoTicker";
import { FeaturesSectionDemo } from "@/components/FeatureSection";
import Footer from "@/components/Footer";


export default function LandingPage() {
    return (
        <div className="min-h-screen text-white bg-black">
            <Hero />
            <LogoTicker />
            <DashImage />
            <div className="">
                {/* <h1 className="text-4xl font-bold pb-40 text-center text-white">A Variety of Features</h1> */}
                <SparklesPreview tittle="A Variety of Features" />
                <BentoGridThirdDemo />
            </div>
            <FeaturesSectionDemo />
            <Footer />
        </div>
    )
}