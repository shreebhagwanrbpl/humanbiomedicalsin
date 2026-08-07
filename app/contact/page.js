import "./Contact.css";
import ContactClient from "./ContactClient";
import { getContactData, getDistrictData } from "../../lib/db-server";

export const revalidate = 3600;

export default async function ContactPage({ district = "" }) {
    const contactInfo = await getContactData();
    const districtData = await getDistrictData(district);

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())
        : "";

    return (
        <ContactClient
            contactInfo={contactInfo}
            districtData={districtData}
            city={city}
            district={district}
        />
    );
}