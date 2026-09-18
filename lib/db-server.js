import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase.js";
import React from "react";

const cache = React.cache || ((fn) => fn);

export const WEBSITE_ID = "humanbiomedicalsin";
export const PRIMARY_COMPANY = "human";
export const ALL_COMPANIES = ["human", "rajbiosis"];

export const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Check if an item is enabled for the current website based on websiteIds and publish state
 */
export function isVisibleOnWebsite(item, websiteId = WEBSITE_ID) {
  if (!item) return false;
  if (item.isPublished === false) return false;
  if (!item.websiteIds || !Array.isArray(item.websiteIds) || item.websiteIds.length === 0) {
    return true; // default visible if no restrictions
  }
  return item.websiteIds.includes("all") || item.websiteIds.includes(websiteId);
}

/**
 * Normalize product fields into a consistent schema
 */
export function normalizeProduct(raw = {}, defaultCategory = "", defaultSubCategory = "") {
  const title = (raw.title || raw.name || "Untitled Product").trim();
  const slug = raw.slug || makeSlug(title);
  
  // Extract images array
  let images = [];
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    images = raw.images.filter(Boolean);
  } else if (raw.image) {
    images = [raw.image];
  } else if (Array.isArray(raw.originalImages) && raw.originalImages.length > 0) {
    images = raw.originalImages.filter(Boolean);
  }

  const category = raw.category || defaultCategory || (raw.type === "normal" ? "Other Products" : "General");
  const subCategory = raw.subCategory || raw.subcategory || defaultSubCategory || category;

  return {
    id: raw.id || raw.productId || raw.categoryProductId || slug,
    productId: raw.productId || raw.categoryProductId || raw.id || "",
    categoryProductId: raw.categoryProductId || raw.productId || raw.id || "",
    title,
    name: title,
    slug,
    price: raw.price ? String(raw.price).trim() : "",
    desc: raw.desc || raw.description || "",
    description: raw.description || raw.desc || "",
    brand: raw.brand ? String(raw.brand).trim() : "",
    model: raw.model ? String(raw.model).trim() : "",
    capacity: raw.capacity ? String(raw.capacity).trim() : "",
    throughput: raw.throughput ? String(raw.throughput).trim() : "",
    instrument: raw.instrument ? String(raw.instrument).trim() : "",
    usage: raw.usage ? String(raw.usage).trim() : "",
    parameters: raw.parameters ? String(raw.parameters).trim() : "",
    automation: raw.automation ? String(raw.automation).trim() : "",
    availability: raw.availability ? String(raw.availability).trim() : "",
    size: raw.size ? String(raw.size).trim() : "",
    images,
    image: images[0] || "",
    video: raw.video || "",
    pdf: raw.pdf || "",
    category,
    subCategory,
    categoryId: raw.categoryId || makeSlug(category),
    subcategoryId: raw.subcategoryId || makeSlug(subCategory),
    isPublished: raw.isPublished !== false,
    websiteIds: Array.isArray(raw.websiteIds) ? raw.websiteIds : ["all"],
    type: raw.type || (category && category !== "Other Products" ? "category" : "normal"),
    createdAt: raw.createdAt || "",
    updatedAt: raw.updatedAt || "",
  };
}

/**
 * Fetch products and categories across Company Master Catalog and Website Documents
 */
async function fetchRawCatalogData() {
  const productsMap = new Map(); // slug -> normalized product
  const categoryTree = new Map(); // catId -> { id, name, category, slug, subcategories: Map(subId -> { id, name, slug, products: [] }) }

  // Helper to add product to category tree
  const placeProductInTree = (prod) => {
    const catName = prod.category || "Other Products";
    const subName = prod.subCategory || catName;
    const catId = prod.categoryId || makeSlug(catName);
    const subId = prod.subcategoryId || makeSlug(subName);

    if (!categoryTree.has(catId)) {
      categoryTree.set(catId, {
        id: catId,
        name: catName,
        category: catName,
        slug: catId,
        subcategories: new Map(),
      });
    }

    const catObj = categoryTree.get(catId);
    if (!catObj.subcategories.has(subId)) {
      catObj.subcategories.set(subId, {
        id: subId,
        name: subName,
        subCategory: subName,
        slug: subId,
        products: [],
      });
    }

    const subObj = catObj.subcategories.get(subId);
    // Avoid duplicate products in subcategory list
    if (!subObj.products.some((p) => p.slug === prod.slug)) {
      subObj.products.push(prod);
    }
  };

  // 1. Fetch Company Master Categories & Subcategories with products array
  // Structure: companies/{companyId}/categories/{catId}/subcategories/{subId} -> doc.data().products
  for (const companyId of ALL_COMPANIES) {
    try {
      const catsSnap = await getDocs(collection(db, "companies", companyId, "categories"));
      for (const catDoc of catsSnap.docs) {
        const catData = catDoc.data();
        if (!isVisibleOnWebsite(catData, WEBSITE_ID)) continue;

        const catName = catData.name || catData.category || catDoc.id;
        const catSlug = catData.slug || catDoc.id || makeSlug(catName);

        const subsSnap = await getDocs(
          collection(db, "companies", companyId, "categories", catDoc.id, "subcategories")
        );

        for (const subDoc of subsSnap.docs) {
          const subData = subDoc.data();
          if (!isVisibleOnWebsite(subData, WEBSITE_ID)) continue;

          const subName = subData.name || subData.subCategory || subDoc.id;
          const subSlug = subData.slug || subDoc.id || makeSlug(subName);
          const rawProds = Array.isArray(subData.products) ? subData.products : [];

          for (const rawP of rawProds) {
            if (isVisibleOnWebsite(rawP, WEBSITE_ID)) {
              const norm = normalizeProduct(
                {
                  ...rawP,
                  categoryId: catSlug,
                  subcategoryId: subSlug,
                  category: catName,
                  subCategory: subName,
                },
                catName,
                subName
              );

              if (!productsMap.has(norm.slug)) {
                productsMap.set(norm.slug, norm);
              } else {
                const existing = productsMap.get(norm.slug);
                productsMap.set(norm.slug, {
                  ...existing,
                  ...norm,
                  images: norm.images.length > 0 ? norm.images : existing.images,
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn(`Error loading company catalog for ${companyId}:`, err.message);
    }
  }

  // 2. Fetch Website-level Categories & Nested Subcategories (if any)
  try {
    const catSnap = await getDocs(
      collection(db, "websites", WEBSITE_ID, "pages", "categoryproducts", "categories")
    );

    for (const catDoc of catSnap.docs) {
      const catData = catDoc.data();
      if (!isVisibleOnWebsite(catData, WEBSITE_ID)) continue;

      const catName = catData.name || catData.category || catDoc.id;
      const catSlug = catData.slug || catDoc.id || makeSlug(catName);

      const subSnap = await getDocs(
        collection(db, "websites", WEBSITE_ID, "pages", "categoryproducts", "categories", catDoc.id, "subcategories")
      );

      for (const subDoc of subSnap.docs) {
        const subData = subDoc.data();
        if (!isVisibleOnWebsite(subData, WEBSITE_ID)) continue;

        const subName = subData.name || subData.subCategory || subDoc.id;
        const subSlug = subData.slug || subDoc.id || makeSlug(subName);
        const rawProds = Array.isArray(subData.products) ? subData.products : [];

        for (const p of rawProds) {
          if (isVisibleOnWebsite(p, WEBSITE_ID)) {
            const norm = normalizeProduct(
              {
                ...p,
                categoryId: catSlug,
                subcategoryId: subSlug,
                category: catName,
                subCategory: subName,
              },
              catName,
              subName
            );

            if (!productsMap.has(norm.slug)) {
              productsMap.set(norm.slug, norm);
            }
          }
        }
      }
    }
  } catch (err) {
    // Non-fatal if websites categoryproducts collection does not exist
  }

  // 3. Fetch Company Direct Products Collection (fallback if any)
  try {
    const directProdsSnap = await getDocs(
      collection(db, "companyCatalogs", PRIMARY_COMPANY, "products")
    );
    directProdsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      if (isVisibleOnWebsite(data, WEBSITE_ID)) {
        const norm = normalizeProduct({ ...data, id: docSnap.id });
        if (!productsMap.has(norm.slug)) {
          productsMap.set(norm.slug, norm);
        }
      }
    });
  } catch (err) {
    // Non-fatal
  }

  // 4. Fetch Website-level Legacy Normal Products (fallback)
  try {
    const prodDocSnap = await getDoc(
      doc(db, "websites", WEBSITE_ID, "pages", "products")
    );
    if (prodDocSnap.exists()) {
      const list = prodDocSnap.data().products || [];
      list.forEach((p, idx) => {
        if (isVisibleOnWebsite(p, WEBSITE_ID)) {
          const norm = normalizeProduct(
            {
              ...p,
              id: p.id || `normal-${idx}`,
              type: "normal",
              category: "Other Products",
              subCategory: p.subCategory || "Other Products",
            },
            "Other Products",
            "Other Products"
          );

          if (!productsMap.has(norm.slug)) {
            productsMap.set(norm.slug, norm);
          }
        }
      });
    }
  } catch (err) {
    // Non-fatal
  }

  // 5. Place all normalized products into the category hierarchy
  const allProducts = Array.from(productsMap.values());
  allProducts.forEach(placeProductInTree);

  // Convert category map into clean array
  const categoryList = Array.from(categoryTree.values()).map((cat) => ({
    id: cat.id,
    name: cat.name,
    category: cat.name,
    slug: cat.slug,
    subcategories: Array.from(cat.subcategories.values()),
  }));

  return {
    categoryList,
    categoryProducts: allProducts,
    totalCount: allProducts.length,
  };
}

/**
 * Request-scoped cached catalog retrieval for Next.js SSR
 */
export const fetchFullCatalog = cache(async () => {
  return fetchRawCatalogData();
});

/**
 * Helper for category products & category list
 */
export async function getCategoriesData() {
  const data = await fetchFullCatalog();
  return {
    categoryList: data.categoryList,
    categoryProducts: data.categoryProducts,
  };
}

/**
 * Helper for featured / all products on homepage & listings
 */
export async function getProductsData() {
  const data = await fetchFullCatalog();
  return data.categoryProducts || [];
}

/**
 * Find a product by its URL slug or ID
 */
export async function getProductBySlug(slug) {
  if (!slug) return null;
  const targetSlug = String(slug).toLowerCase().trim();
  const data = await fetchFullCatalog();
  return (
    data.categoryProducts.find(
      (p) =>
        p.slug.toLowerCase() === targetSlug ||
        String(p.id).toLowerCase() === targetSlug ||
        String(p.productId).toLowerCase() === targetSlug ||
        String(p.categoryProductId).toLowerCase() === targetSlug
    ) || null
  );
}

/**
 * Page helpers
 */
export async function getHomeData() {
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "pages", "home"));
  return snap.exists() ? snap.data() : null;
}

export async function getServicesData() {
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "pages", "services"));
  return snap.exists() ? snap.data().services || [] : [];
}

export async function getContactData() {
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "pages", "contact"));
  return snap.exists() ? snap.data().contactInfo || [] : [];
}

export async function getDistrictData(districtSlug) {
  if (!districtSlug || districtSlug.toLowerCase() === "jaipur") {
    return null;
  }
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "districts", districtSlug));
  return snap.exists() ? snap.data() : null;
}
