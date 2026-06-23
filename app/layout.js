import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
    metadataBase: new URL(
        "https://humanbiomedicals.in"
    ),

    title:
        "Biomedical Equipment Supplier in India | Human Biomedicals",

    description:
        "Human Biomedicals supplies CBC Machines, Hematology Analyzers, Biochemistry Analyzers, ELISA Readers, Diagnostic Equipment and Laboratory Instruments across India.",

    keywords: [
        "Biomedical Equipment Supplier",
        "Laboratory Equipment Supplier",
        "CBC Machine Supplier",
        "Hematology Analyzer Supplier",
        "Biochemistry Analyzer Supplier",
        "ELISA Reader Supplier",
        "Diagnostic Equipment Supplier",
        "Medical Equipment Supplier India",
        "Human Biomedicals",
    ],

    alternates: {
        canonical:
            "https://humanbiomedicals.in",
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}) {
    return (
        <html lang="en">
            <body>
                <Navbar />

                {children}

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                    }}
                    containerStyle={{
                        top: 90,
                        zIndex: 999999,
                    }}
                />

                <Footer />
            </body>
        </html>
    );
}