// src/lib/districts.ts

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function isValidDistrict(
  district: string
) {

  try {

    const slug =
      district
        ?.toLowerCase()
        .trim();

    const snap =
      await getDoc(
        doc(
          db,
          "websites",
          "humanbiomedicalsin",
          "districts",
          slug
        )
      );

    return snap.exists();

  } catch (error) {

    console.log(error);

    return false;

  }

}

export function formatDistrictName(
  district: string
) {

  return district
    ?.replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (char: string) =>
        char.toUpperCase()
    );

}