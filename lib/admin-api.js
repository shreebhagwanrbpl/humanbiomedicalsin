/**
 * SuperAdmin MongoDB API Client
 * Connects directly to SuperAdmin MongoDB backend (https://admin.rajbiosis.app)
 * for dynamic products, catalog, categories, site data, and form queries.
 */

import React from "react";

const cache = React.cache || ((fn) => fn);

export const ADMIN_API_BASE_URL =
  process.env.ADMIN_API_BASE_URL ||
  process.env.ADMIN_API_URL ||
  process.env.SQLITE_ADMIN_API_URL ||
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_ADMIN_API_URL ||
  "https://admin.rajbiosis.app";

export const WEBSITE_ID =
  process.env.WEBSITE_ID ||
  process.env.NEXT_PUBLIC_WEBSITE_ID ||
  "humanbiomedicalsin";

export const PRIMARY_COMPANY =
  process.env.COMPANY_ID ||
  process.env.NEXT_PUBLIC_COMPANY_ID ||
  "human";

export const ALL_COMPANIES = ["human", "rajbiosis"];

const SITE_WEBSITE_IDS = [
  WEBSITE_ID,
  "humanbiomedicalsin",
  "humanbiomedicals.in",
  "all",
];

export const makeSlug = (text = "") =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Check if an item (product, category, subcategory) is visible on this website
 */
export function isVisibleOnWebsite(item, websiteId = WEBSITE_ID) {
  if (!item) return false;
  if (item.isPublished === false) return false;
  const websiteIds = Array.isArray(item.websiteIds)
    ? item.websiteIds
    : item.websiteIds
    ? [item.websiteIds]
    : [];

  if (websiteIds.length === 0) return true;
  return (
    websiteIds.includes("all") ||
    websiteIds.includes(websiteId) ||
    websiteIds.includes("humanbiomedicalsin") ||
    websiteIds.includes("humanbiomedicals.in")
  );
}

export const isVisibleOnSite = isVisibleOnWebsite;

/**
 * Standardize product object formatting across all sources
 */
export function normalizeProduct(raw = {}, defaultCategory = "", defaultSubCategory = "", defaultSource = "master") {
  if (!raw) return null;

  const rawTitle = (raw.title || raw.name || "Untitled Product").trim();
  const slug = raw.slug || makeSlug(rawTitle);

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
    ...raw,
    id: raw.id || raw.productId || raw.categoryProductId || slug,
    productId: raw.productId || raw.categoryProductId || raw.id || "",
    categoryProductId: raw.categoryProductId || raw.productId || raw.id || "",
    title: rawTitle,
    name: rawTitle,
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
    source: defaultSource,
    createdAt: raw.createdAt || "",
    updatedAt: raw.updatedAt || "",
  };
}

export const formatProduct = normalizeProduct;

/**
 * Helper to fetch a single document from SQLite Admin API
 */
export async function fetchDoc(path) {
  if (!path) return null;
  const cleanPath = String(path).split("/").filter(Boolean).join("/");
  const url = `${ADMIN_API_BASE_URL}/api/local-firestore?op=get&path=${encodeURIComponent(cleanPath)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.exists && json?.data ? json.data : null;
  } catch (err) {
    if (err.name === "DynamicServerError") throw err;
    console.error(`[admin-api] Error fetching doc at ${cleanPath}:`, err.message);
    return null;
  }
}

/**
 * Helper to fetch a collection from SQLite Admin API
 */
export async function fetchCollection(path, constraints = {}) {
  if (!path) return [];
  const cleanPath = String(path).split("/").filter(Boolean).join("/");
  const filters = constraints.filters || [];
  const order = constraints.order || [];
  const limit = constraints.limit;

  let url = `${ADMIN_API_BASE_URL}/api/local-firestore?op=collection&path=${encodeURIComponent(
    cleanPath
  )}&filters=${encodeURIComponent(JSON.stringify(filters))}&order=${encodeURIComponent(
    JSON.stringify(order)
  )}`;

  if (limit) {
    url += `&limit=${encodeURIComponent(limit)}`;
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.docs) ? json.docs : [];
  } catch (err) {
    if (err.name === "DynamicServerError") throw err;
    console.error(`[admin-api] Error fetching collection at ${cleanPath}:`, err.message);
    return [];
  }
}

/**
 * Helper to save a document or query into SQLite Admin API
 */
export async function saveDoc(path, data, merge = true) {
  if (!path) throw new Error("Path is required");
  const cleanPath = String(path).split("/").filter(Boolean).join("/");
  const url = `${ADMIN_API_BASE_URL}/api/local-firestore`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      op: "set",
      path: cleanPath,
      data,
      merge: Boolean(merge),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to save document to ${cleanPath}: ${errText}`);
  }

  return res.json();
}

/**
 * Submit Contact Query
 */
export async function submitContactQuery(queryData) {
  const queryId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `cq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const path = `websitesQueries/${WEBSITE_ID}/contactQueries/${queryId}`;
  const payload = {
    ...queryData,
    websiteId: WEBSITE_ID,
    createdAt: new Date().toISOString(),
    id: queryId,
  };

  return saveDoc(path, payload, false);
}

/**
 * Submit Product Query
 */
export async function submitProductQuery(queryData) {
  const queryId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `pq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const path = `websitesQueries/${WEBSITE_ID}/productQueries/${queryId}`;
  const payload = {
    ...queryData,
    websiteId: WEBSITE_ID,
    createdAt: new Date().toISOString(),
    id: queryId,
  };

  return saveDoc(path, payload, false);
}

/**
 * Fetch Full Multi-source Catalog from SQLite Admin API
 */
async function fetchRawCatalogData() {
  const startTime = performance.now();
  const productsMap = new Map();
  const categoryTree = new Map();

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
    if (!subObj.products.some((p) => p.slug === prod.slug)) {
      subObj.products.push(prod);
    }
  };

  try {
    // Attempt direct /api/catalog endpoint first
    try {
      const catUrl = `${ADMIN_API_BASE_URL}/api/catalog?websiteId=${encodeURIComponent(WEBSITE_ID)}`;
      const catRes = await fetch(catUrl, {
        next: { revalidate: 60 },
      });

      if (catRes.ok) {
        const catJson = await catRes.json();
        const rawProducts = Array.isArray(catJson.products)
          ? catJson.products
          : Array.isArray(catJson.data)
          ? catJson.data
          : [];

        if (rawProducts.length > 0) {
          rawProducts.forEach((p, idx) => {
            if (!isVisibleOnWebsite(p, WEBSITE_ID)) return;
            const formatted = normalizeProduct(p, p.category, p.subCategory, "admin-catalog");
            formatted.uid = formatted.uid || `admin-${formatted.slug || idx}`;
            const key = formatted.slug || formatted.id;
            if (!productsMap.has(key)) {
              productsMap.set(key, formatted);
            }
          });
        }
      }
    } catch (directErr) {
      console.warn("[admin-api] Direct /api/catalog fetch failed, proceeding to collection queries:", directErr.message);
    }

    // Source 1: Central Master Catalog (companies/{companyId}/categories)
    for (const companyId of ALL_COMPANIES) {
      try {
        const catsSnap = await fetchCollection(`companies/${companyId}/categories`);
        for (const catDoc of catsSnap) {
          const catData = catDoc.data || catDoc;
          if (!isVisibleOnWebsite(catData, WEBSITE_ID)) continue;

          const catName = catData.name || catData.category || catDoc.id;
          const catSlug = catData.slug || catDoc.id || makeSlug(catName);

          const subsSnap = await fetchCollection(
            `companies/${companyId}/categories/${catDoc.id || catData.id}/subcategories`
          );

          for (const subDoc of subsSnap) {
            const subData = subDoc.data || subDoc;
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
                  subName,
                  `company-${companyId}`
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
        console.warn(`[admin-api] Error loading company catalog for ${companyId}:`, err.message);
      }
    }

    // Source 2: Master Standalone Products (companies/{companyId}/products)
    try {
      const compProds = await fetchCollection(`companies/${PRIMARY_COMPANY}/products`);
      compProds.forEach((pDoc) => {
        const pData = pDoc.data || pDoc;
        if (isVisibleOnWebsite(pData, WEBSITE_ID)) {
          const norm = normalizeProduct(pData, pData.category || "General", pData.subCategory || "General", "company-products");
          norm.uid = `comp-prod-${pDoc.id || norm.slug}`;
          const key = norm.slug || norm.id;
          if (!productsMap.has(key)) {
            productsMap.set(key, norm);
          }
        }
      });
    } catch (prodsErr) {
      console.warn(`[admin-api] Error fetching companies/${PRIMARY_COMPANY}/products:`, prodsErr.message);
    }

    // Source 3: Website Category Products (websites/{WEBSITE_ID}/pages/categoryproducts/categories)
    try {
      const webCats = await fetchCollection(`websites/${WEBSITE_ID}/pages/categoryproducts/categories`);
      for (const catDoc of webCats) {
        const catData = catDoc.data || catDoc;
        if (!isVisibleOnWebsite(catData, WEBSITE_ID)) continue;

        const catName = catData.name || catData.category || catDoc.id;
        const catSlug = catData.slug || catDoc.id || makeSlug(catName);

        const subDocs = await fetchCollection(
          `websites/${WEBSITE_ID}/pages/categoryproducts/categories/${catDoc.id || catData.id}/subcategories`
        );

        for (const subDoc of subDocs) {
          const subData = subDoc.data || subDoc;
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
                subName,
                "website-categoryproducts"
              );

              if (!productsMap.has(norm.slug)) {
                productsMap.set(norm.slug, norm);
              }
            }
          }
        }
      }
    } catch (webCatsErr) {
      // Non-fatal
    }

    // Source 4: Legacy Website Products
    try {
      const oldDoc = await fetchDoc(`websites/${WEBSITE_ID}/pages/products`);
      if (oldDoc && Array.isArray(oldDoc.products)) {
        oldDoc.products.forEach((p, idx) => {
          if (isVisibleOnWebsite(p, WEBSITE_ID)) {
            const norm = normalizeProduct(
              {
                ...p,
                id: p.id || `legacy-${idx}`,
                type: "normal",
                category: "Other Products",
                subCategory: p.subCategory || "Other Products",
              },
              "Other Products",
              "Other Products",
              "website-legacy"
            );

            if (!productsMap.has(norm.slug)) {
              productsMap.set(norm.slug, norm);
            }
          }
        });
      }
    } catch (oldErr) {
      // Non-fatal
    }

    const allProducts = Array.from(productsMap.values());
    allProducts.forEach(placeProductInTree);

    const categoryList = Array.from(categoryTree.values()).map((cat) => ({
      id: cat.id,
      name: cat.name,
      category: cat.name,
      slug: cat.slug,
      subcategories: Array.from(cat.subcategories.values()),
    }));

    const duration = performance.now() - startTime;
    console.log(`[admin-api] Loaded ${allProducts.length} multi-source products in ${duration.toFixed(2)}ms`);

    return {
      categoryList,
      categoryProducts: allProducts,
      totalCount: allProducts.length,
    };
  } catch (err) {
    console.error("[admin-api] Error in fetchFullCatalog:", err);
    return {
      categoryList: [],
      categoryProducts: [],
      totalCount: 0,
    };
  }
}

/**
 * Request-scoped cached catalog retrieval for Next.js SSR
 */
export const fetchFullCatalog = cache(async () => {
  return fetchRawCatalogData();
});

export async function getCategoriesData() {
  const data = await fetchFullCatalog();
  return {
    categoryList: data.categoryList,
    categoryProducts: data.categoryProducts,
  };
}

export async function getProductsData() {
  const data = await fetchFullCatalog();
  return data.categoryProducts || [];
}

export async function getProductBySlug(slug) {
  if (!slug) return null;
  const targetSlug = String(slug).toLowerCase().trim();
  const data = await fetchFullCatalog();
  return (
    data.categoryProducts.find(
      (p) =>
        p.slug?.toLowerCase() === targetSlug ||
        String(p.id).toLowerCase() === targetSlug ||
        String(p.productId).toLowerCase() === targetSlug ||
        String(p.categoryProductId).toLowerCase() === targetSlug
    ) || null
  );
}

export const fetchProductBySlug = getProductBySlug;

/**
 * Fetch Site Data for specific page types (home, contact, services, about, districts)
 */
export async function fetchSiteData(type, params = {}) {
  if (!type) return null;

  // 1. Try direct /api/site-data endpoint
  try {
    let url = `${ADMIN_API_BASE_URL}/api/site-data?websiteId=${encodeURIComponent(
      WEBSITE_ID
    )}&type=${encodeURIComponent(type)}`;
    if (params.district) {
      url += `&district=${encodeURIComponent(params.district)}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch (err) {
    if (err.name === "DynamicServerError") throw err;
    console.warn(`[admin-api] /api/site-data?type=${type} error:`, err.message);
  }

  // 2. Fallback to local-firestore document path
  if (type === "districts") {
    if (params.district) {
      return fetchDoc(`websites/${WEBSITE_ID}/districts/${params.district}`);
    }
    const docs = await fetchCollection(`websites/${WEBSITE_ID}/districts`);
    return docs.map((d) => d.data || d);
  }

  return fetchDoc(`websites/${WEBSITE_ID}/pages/${type}`);
}

export async function getHomeData() {
  return fetchSiteData("home");
}

export const fetchHomeData = getHomeData;

export async function getServicesData() {
  const data = await fetchSiteData("services");
  if (!data) return [];
  if (Array.isArray(data.services)) return data.services;
  if (Array.isArray(data)) return data;
  return [];
}

export const fetchServicesData = getServicesData;

export async function getContactData() {
  const data = await fetchSiteData("contact");
  if (!data) return [];
  if (Array.isArray(data.contactInfo)) return data.contactInfo;
  if (Array.isArray(data)) return data;
  return [];
}

export const fetchContactData = getContactData;

export async function getDistrictData(districtSlug) {
  if (!districtSlug || districtSlug.toLowerCase() === "jaipur") {
    return null;
  }
  return fetchSiteData("districts", { district: districtSlug });
}

export const fetchDistrictData = getDistrictData;

export async function fetchDistricts() {
  const result = await fetchSiteData("districts");
  return Array.isArray(result) ? result : [];
}

export const getDistricts = fetchDistricts;
