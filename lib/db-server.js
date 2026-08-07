import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";

export const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export async function getHomeData() {
  const snap = await getDoc(doc(db, "websites", "humanbiomedicalsin", "pages", "home"));
  return snap.exists() ? snap.data() : null;
}

export async function getProductsData() {
  const snap = await getDoc(doc(db, "websites", "humanbiomedicalsin", "pages", "products"));
  if (!snap.exists()) return [];
  return (snap.data().products || [])
    .filter((item) => item.isPublished !== false)
    .map((item, index) => ({
      ...item,
      uid: `other-${index}`,
      slug: item.slug || makeSlug(item.title),
      category: item.category || "Other Products",
    }));
}

export async function getCategoriesData() {
  const snap = await getDocs(
    collection(db, "websites", "humanbiomedicalsin", "pages", "categoryproducts", "categories")
  );
  const categoryList = [];
  const categoryProducts = [];

  await Promise.all(
    snap.docs.map(async (catDoc) => {
      const data = catDoc.data();
      const name = data.category || catDoc.id;

      // Fetch nested subcategories in parallel for each category
      const subSnap = await getDocs(
        collection(db, "websites", "humanbiomedicalsin", "pages", "categoryproducts", "categories", catDoc.id, "subcategories")
      );

      const subcategories = [];
      subSnap.forEach((subDoc) => {
        const subData = subDoc.data();
        const subName = subData.subCategory || subDoc.id;
        const products = subData.products || [];

        const formatted = products.map((p, index) => ({
          ...p,
          uid: `${catDoc.id}-${subDoc.id}-${index}`,
          category: name,
          subCategory: subName,
          slug: p.slug || makeSlug(p.title),
        }));

        subcategories.push({
          id: subDoc.id,
          name: subName,
          products: formatted,
        });

        categoryProducts.push(...formatted);
      });

      categoryList.push({
        id: catDoc.id,
        name,
        subcategories,
      });
    })
  );

  // Unify other products (without category) under a common tree node
  const otherProducts = await getProductsData();
  if (otherProducts.length > 0) {
    categoryList.push({
      id: "other-products",
      name: "Other Products",
      subcategories: [
        {
          id: "other-products-sub",
          name: "Other Products",
          products: otherProducts.map(p => ({
            ...p,
            category: "Other Products",
            subCategory: "Other Products"
          }))
        }
      ]
    });
    categoryProducts.push(...otherProducts.map(p => ({
      ...p,
      category: "Other Products",
      subCategory: "Other Products"
    })));
  }

  return { categoryList, categoryProducts };
}

export async function getServicesData() {
  const snap = await getDoc(doc(db, "websites", "humanbiomedicalsin", "pages", "services"));
  return snap.exists() ? snap.data().services || [] : [];
}

export async function getContactData() {
  const snap = await getDoc(doc(db, "websites", "humanbiomedicalsin", "pages", "contact"));
  return snap.exists() ? snap.data().contactInfo || [] : [];
}

export async function getDistrictData(districtSlug) {
  if (!districtSlug || districtSlug.toLowerCase() === "jaipur") {
    return null;
  }
  const snap = await getDoc(doc(db, "websites", "humanbiomedicalsin", "districts", districtSlug));
  return snap.exists() ? snap.data() : null;
}

export async function getProductBySlug(slug) {
  const { categoryProducts } = await getCategoriesData();
  return categoryProducts.find((p) => p.slug === slug) || null;
}

