import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
    title: "Human Biomedical",
    description: "Laboratory & Hospital Equipment Supplier",
};

export default function RootLayout({ children }) {
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