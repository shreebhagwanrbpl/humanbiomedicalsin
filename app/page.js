import Hero from "../components/Hero";
import Stats from "../components/Stats";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChooseUs from "../components/WhyChooseUs";
import CTA from "../components/CTA";

export default function Home() {
    return (
        <>
            <Hero />
            <Stats />
            <FeaturedProducts />
            <WhyChooseUs />
            <CTA />
        </>
    );
}