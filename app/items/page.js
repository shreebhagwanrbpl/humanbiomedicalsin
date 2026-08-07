import "./Products.css";
import ProductsClient from "./ProductsClient";
import { getCategoriesData, getProductsData } from "../../lib/db-server";

export const revalidate = 3600;

export default async function ItemsPage({ district = "" }) {
    // Fetch products and categories on the server side
    const { categoryList, categoryProducts } = await getCategoriesData();

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "";

    // Combine all products (already unified by server helper)
    const allProducts = categoryProducts;

    return (
        <ProductsClient
            initialCategories={categoryList}
            initialProducts={allProducts}
            city={city}
            district={district}
        />
    );
}