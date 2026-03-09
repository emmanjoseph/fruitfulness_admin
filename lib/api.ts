
import { FormValues } from "@/app/(root)/journeys/add-new/page";
import { useAuthStore } from "@/store/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getAnalytics = async () => {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = cookies();
    const token = (await cookieStore).get("admin-token")?.value;

    if (!token) throw new Error("No admin token");

    const res = await fetch(`${API_URL}/api/admin/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { message: "Failed to fetch analytics", status: res.status };
    }

    return res.json();
  } catch (err) {
    console.error("Analytics fetch error:", err);
    throw err;
  }
};

export const uploadJourney = async (data: FormValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journeys/add-journey`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create journey");
    }

    return await res.json();
  } catch (error) {
    console.error("Error adding new journey:", error);
    throw error;
  }
};

export const updateJourney = async (
  id: string,
  data: Partial<FormValues>
) => {
  try {
    const res = await fetch(
      `${API_URL}/api/journeys/update-journey/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update journey");
    }

    return await res.json();
  } catch (error) {
    console.error("Update journey failed:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      credentials: "include", // ✅ IMPORTANT
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: "Failed to sign in",
        status: response.status,
      };
    }

     if (data.token) {
      useAuthStore.getState().setToken(data.token);

       // 👇 Also store in cookie for server components
    document.cookie = `admin-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
    }

    return data;
  } catch (error) {
    console.error("Auth failed:", error);
  }
};

export const getAdminProfile = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/api/admin/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { message: "Failed to fetch profile", status: res.status };
    }

    const data = await res.json();
   // ✅ Store token in cookie on client side
  if (data.token) {
    document.cookie = `admin-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }

  return data;
  } catch (err) {
    console.error("Profile fetch error:", err);
    throw err;
  }
};

export type AdminValues= {
  email:string,
  password:string
}

export const addNewAdmin = async (data: AdminValues) => {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();

  const token = (await cookieStore).get("admin-token")?.value;

  if (!token) throw new Error("No admin token");

  const res = await fetch(`${API_URL}/api/admin/create-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error adding admin");
  }

  return res.json();
};


export const getAllBookings = async (page: number = 1, limit: number =10) => {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = cookies();
    const token = (await cookieStore).get("admin-token")?.value;

    if (!token) throw new Error("No admin token");

    const response = await fetch(`${API_URL}/api/booking?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return {
        message: "Failed to fetch trips",
        status: response.status,
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

export type TripsQuery = {
  page?: number;
  limit?: number;
  tags?: string;
  country?: string;
  search?: string;
  minRating?: number;
};

export async function getAllTrips(query: TripsQuery) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null) params.append(k, String(v));
  });

  const res = await fetch(
    `${API_URL}/api/journeys?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch journeys");

  return res.json();
}

export const fetchJourneyById = async (id:string)=>{
    try {
        const res = await fetch(`${API_URL}/api/journeys/${id}`);
         if (!res.ok) {
      throw new Error(`Failed to fetch details: ${res.status}`);
      
    }
    const data = await res.json();
    return data;
  } catch (error) {
        console.error("Error fetching journey details:", error);
    }
}

async function bookingAction(endpoint: string) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important: Include cookies for authentication
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export const approveBooking = (id: string) =>
  bookingAction(`/api/booking/${id}/approve`);

export const cancelBooking = (id: string) =>
  bookingAction(`/api/booking/${id}/cancel`);

export const completeBooking = (id: string) =>
  bookingAction(`/api/booking/${id}/complete`);


export const getCurrentAdmin = async () => {
  const { cookies } = await import("next/headers");

  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (!token) throw new Error("No admin token");

  const res = await fetch(`${API_URL}/api/admin/me`, {
    headers: {
       Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch admin: ${res.status}`);
  }

  return res.json();
};

export const logout = () => {
  // Clear token from Zustand
  useAuthStore.getState().clearToken();
  
  // Redirect
  window.location.href = "/sign-in";
};

