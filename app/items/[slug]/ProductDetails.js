
"use client";

import "./productSlug.css";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import toast from "react-hot-toast";
import {
    FaShareAlt,
    FaPlay,
} from "react-icons/fa";
export default function ProductDetails() {

    const { slug } = useParams();

    const [product, setProduct] = useState(null);
    const [errors, setErrors] = useState({});
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");
const [selectedMedia, setSelectedMedia] = useState("image");
const shareRef = useRef();

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "humanbiomedicalsin",
                        "pages",
                        "products"
                    )
                );

                if (snap.exists()) {

                    const products =
                        snap.data().products || [];

                    const found = products.find(
    item => item.slug === slug
);

setProduct(found);

if (found) {
    setSelectedImage(
        found.images?.[0] || found.image
    );

    setSelectedMedia("image");
}
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

    }, [slug]);

    const validateForm = () => {

        const newErrors = {};

        if (name.trim().length < 3) {
            newErrors.name =
                "Minimum 3 characters required";
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            newErrors.phone =
                "Enter valid 10 digit mobile number";
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            newErrors.email =
                "Enter valid email";
        }

        if (
            message.trim().length < 10
        ) {
            newErrors.message =
                "Minimum 10 characters required";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    const submitEnquiry = async (e) => {

        e.preventDefault();

        if (!validateForm()) {

            toast.error(
                "Please fill all fields correctly"
            );

            return;
        }

        try {

            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "humanbiomedicalsin",
                    "productQueries"
                ),
                {
                    productName: product.title,
                    productSlug: product.slug,
                    productImage: product.image || "",
                    brand: product.brand || "",
                    model: product.model || "",
                    name,
                    phone,
                    email,
                    message,
                    createdAt: new Date()
                }
            );

            toast.success(
                "Enquiry Submitted Successfully"
            );

            setName("");
            setPhone("");
            setEmail("");
            setMessage("");

        } catch (err) {

            toast.error(
                "Submission Failed"
            );

        }
    };


    const handleShare = async () => {
    try {
        if (navigator.share) {
            await navigator.share({
                title: product.title,
                text: product.desc,
                url: window.location.href,
            });
        } else {
            await navigator.clipboard.writeText(
                window.location.href
            );
            toast.success("Link Copied");
        }
    } catch (err) {
        console.log(err);
    }
};

    if (loading) {
        return (
            <div className="product-details-page">
                <div className="product-details-container">
                    <div className="skeleton image-loader"></div>
                    <div>
                        <div className="skeleton title-loader"></div>
                        <div className="skeleton text-loader"></div>
                        <div className="skeleton text-loader"></div>
                        <div className="skeleton text-loader short"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <h2
                style={{
                    textAlign: "center",
                    marginTop: "150px"
                }}
            >
                Product Not Found
            </h2>
        );
    }

    return (
        <div className="product-details-page">

            <div className="product-details-container">

                <div className="product-image-box">
                  <>
{selectedMedia==="video" && product.video ? (

<video
controls
className="product-detail-image"
>

<source
src={product.video}
type="video/mp4"
/>

</video>

) : (

<img
src={
selectedImage ||
product.image ||
"https://via.placeholder.com/700x500"
}
alt={product.title}
className="product-detail-image"
/>

)}

<div
style={{
display:"flex",
gap:"10px",
marginTop:"20px",
overflowX:"auto"
}}
>

{(product.images?.length
?product.images
:[product.image]
).map((img,index)=>(

<img
key={index}
src={img}
onClick={()=>{

setSelectedImage(img);

setSelectedMedia("image");

}}
style={{
width:80,
height:80,
objectFit:"cover",
borderRadius:10,
cursor:"pointer",
border:selectedImage===img
?"2px solid #2563eb"
:"1px solid #ddd",
flexShrink:0
}}
/>

))}

{product.video&&(

<div
onClick={()=>setSelectedMedia("video")}
style={{
width:80,
height:80,
borderRadius:10,
overflow:"hidden",
cursor:"pointer",
position:"relative",
flexShrink:0
}}
>

<video
src={product.video}
muted
style={{
width:"100%",
height:"100%",
objectFit:"cover",
pointerEvents:"none"
}}
/>

<div
style={{
position:"absolute",
inset:0,
background:"rgba(0,0,0,.35)",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#fff",
fontSize:24
}}
>

<FaPlay/>

</div>

</div>

)}

{product.pdf&&(

<a
href={product.pdf}
target="_blank"
style={{
width:80,
height:80,
background:"#8B1E1E",
color:"#fff",
display:"flex",
justifyContent:"center",
alignItems:"center",
borderRadius:10,
textDecoration:"none",
fontWeight:700,
flexShrink:0
}}
>

PDF

</a>

)}

</div>

</>
                </div>

                <div className="product-info">

                    <div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
}}
>

<h1>

{product.title}

</h1>

<button
className="submit-btn"
style={{
width:52,
height:52,
padding:0,
borderRadius:"50%"
}}
onClick={handleShare}
>

<span style={{fontSize:"20px"}}>🔗</span>

</button>

</div>

                    <p className="product-description">
                        {product.desc}
                    </p>

                    <div className="product-meta">

                        <div className="meta-card">
                            <strong>Brand</strong>
                            <span>{product.brand || "N/A"}</span>
                        </div>

                        <div className="meta-card">
                            <strong>Model</strong>
                            <span>{product.model || "N/A"}</span>
                        </div>

                        <div className="meta-card">
                            <strong>Availability</strong>
                            <span>{product.availability || "Available"}</span>
                        </div>

                        <div className="meta-card">
                            <strong>Automation</strong>
                            <span>{product.automation || "N/A"}</span>
                        </div>

                        <div className="meta-card">
                            <strong>Usage</strong>
                            <span>{product.usage || "N/A"}</span>
                        </div>

                        <div className="meta-card">
                            <strong>Product</strong>
                            <span>{product.title}</span>
                        </div>

                    </div>

                </div>

            </div>

            <div className="enquiry-section">

                <div className="enquiry-card">

                    <h2>Product Enquiry Form</h2>

                    <form
                        onSubmit={submitEnquiry}
                        className="enquiry-form"
                    >

                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                        {errors.name && (
                            <span className="error-text">
                                {errors.name}
                            </span>
                        )}

                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={phone}
                            maxLength={10}
                            onChange={(e) =>
                                setPhone(
                                    e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    )
                                )
                            }
                        />

                        {errors.phone && (
                            <span className="error-text">
                                {errors.phone}
                            </span>
                        )}

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        {errors.email && (
                            <span className="error-text">
                                {errors.email}
                            </span>
                        )}

                        <textarea
                            rows="6"
                            placeholder="Write your enquiry..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                        />

                        {errors.message && (
                            <span className="error-text">
                                {errors.message}
                            </span>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            Send Enquiry
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

