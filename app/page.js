import Hero from "../components/Hero";
import Stats from "../components/Stats";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChooseUs from "../components/WhyChooseUs";
import CTA from "../components/CTA";
import { getHomeData, getProductsData } from "../lib/db-server";

export const revalidate = 3600;

export default async function Home({ city = "", district = "" }) {
    const heroData = await getHomeData();
    const allProducts = await getProductsData();
    const featuredProducts = allProducts.slice(0, 4);

    return (
        <>
            <Hero heroData={heroData} city={city} district={district} />
            <Stats />
            <FeaturedProducts products={featuredProducts} district={district} />
            <WhyChooseUs />
            <CTA />
        </>
    );
}