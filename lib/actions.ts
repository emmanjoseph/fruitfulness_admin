"use server";

import { cookies } from "next/headers";
import { AdminValues } from "./api";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function addNewAdminAction(data: AdminValues
) {
  const token = (await cookies()).get("admin-token")?.value;

  if (!token) throw new Error("No admin token");

  const res = await fetch(`${API_URL}/api/admin/create-admin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create admin");
  }

  return res.json();
}

export async function deleteJourneyAction(id: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin-token")?.value

    if (!token) {
      return { success: false, error: "No admin token" }
    }

    const res = await fetch(`${API_URL}/api/journeys/delete-journey/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { success: false, error: `Failed to delete journey: ${res.status}` }
    }

    // Revalidate the journeys page to reflect changes
    revalidatePath("/journeys")
    revalidatePath("/")
    
    return { success: true, data: await res.json() }
  } catch (error) {
    console.error("Error deleting journey:", error)
    return { success: false, error: "Failed to delete journey" }
  }
}

export const deleteBookingAction = async (id: string) => {
  try {
     const cookieStore = await cookies()
     const token = cookieStore.get("admin-token")?.value

    if (!token) {
      return { success: false, error: "No admin token" }
    }

    const res = await fetch(`${API_URL}/api/booking/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

     if (!res.ok) {
      return { success: false, error: `Failed to delete booking: ${res.status}` }
    }

    // Revalidate the journeys page to reflect changes
    revalidatePath("/bookings")
    revalidatePath("/")
    
    return { success: true, data: await res.json()}


  } catch (error) {
    console.error("Error deleting booking:", error)
    return { success: false, error: "Failed to delete booking" }
  }
}


export const updateAdminEmail = async (data: { email: string }) => {
   const cookieStore = await cookies()
     const token = cookieStore.get("admin-token")?.value

    if (!token) {
      return { success: false, error: "No admin token" }
    }

  const res = await fetch(`${API_URL}/api/admin/update-profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update email");
  }

  return res.json();
};

export const changeAdminPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {

   const cookieStore = await cookies()
     const token = cookieStore.get("admin-token")?.value

    if (!token) {
      return { success: false, error: "No admin token" }
    }
    
  const res = await fetch(`${API_URL}/api/admin/update-profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to change password");
  }

  return res.json();
};


export type PricingTier = "BUDGET" | "MIDRANGE" | "LUXURY";

export interface UpdateInclusionsExclusionsPayload {
  inclusions?: string[];
  exclusions?: string[];
}

export const updatePricingInclusionsExclusions = async (
  journeyId: string,
  tier: PricingTier,
  data: UpdateInclusionsExclusionsPayload
) => {
  try {
    const res = await fetch(
      `${API_URL}/api/journeys/${journeyId}/pricing/${tier.toLowerCase()}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update inclusions/exclusions");
    }

    return await res.json();
  } catch (error) {
    console.error("Update inclusions/exclusions failed:", error);
    throw error;
  }
};


