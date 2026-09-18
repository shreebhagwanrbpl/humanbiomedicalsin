import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 20px"
    }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#334155", marginBottom: "12px" }}>Product or Page Not Found</h2>
      <p style={{ color: "#64748b", maxWidth: "480px", marginBottom: "24px" }}>
        The requested page or biomedical product does not exist or has been moved.
      </p>
      <Link
        href="/items"
        style={{
          backgroundColor: "#0284c7",
          color: "#ffffff",
          padding: "10px 24px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600"
        }}
      >
        View All Products
      </Link>
    </div>
  );
}
