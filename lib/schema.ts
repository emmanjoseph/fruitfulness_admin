import { z } from "zod";

export const itinerarySchema = z.object({
  day: z.number().int().min(1, "Day must be at least 1"),
  title: z.string().min(3, "Itinerary title is required"),
  details: z.string().min(5, "Itinerary details are required"),
});


export const pricingSchema = z.object({
  tier: z.enum(["BUDGET", "MIDRANGE", "LUXURY"]),
  citizenPrice: z.number().min(0),
  nonResidentPrice: z.number().min(0),
  currency: z.enum(["USD","KES"]),
  accommodation: z.string().optional(),
  transportType: z.string().optional(),
  transportDescription: z.string().optional()
});


export const addNewSchema = z.object({
  id: z.string().uuid().optional(), // optional if generated server-side

  name: z
    .string()
    .min(4, "Please enter the itinerary name or title"),

  slug: z
    .string()
    .min(2, "Give the itinerary a slug")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and hyphenated"),

  imgUrl: z
    .string()
    .url("Provide a valid image URL"),

  location: z
    .string()
    .min(2, "Location is required"),

  description: z
    .string()
    .min(10, "Give a brief description or overview for the journey"),

  transportation: z
    .string()
    .min(2, "Transportation method is required"),

  rating: z
    .number()
    .min(0)
    .max(5)
    .optional(),

  numberOfDays: z
    .number()
    .int()
    .min(1, "Journey must be at least 1 day"),

  activities: z
    .array(z.string().min(2))
    .min(1, "At least one activity is required"),

  bestTimeToVisit: z
    .string()
    .optional(),

  country: z
    .string()
    .min(2, "Country is required"),

  itineraries: z.array(itinerarySchema).optional(),

  tags: z
    .array(z.string().min(2, "Add atleast one journey tag"))
    .min(1, "At least one tag is required"), 

    pricing: z.array(pricingSchema).min(1, "Atleast one pricing tier is required")
});

export const addNewAdminSchema = z.object({
  email:z.string().min(4,"Please enter email address"),
  password:z.string().min(8,"A password should have a minimum of 8 characters").max(16,"A password should not be exceeding maximum 16 characters"),
  role:z.enum(["Admin","Super Admin"])
});

// Schema for updating email only
export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Schema for updating password only
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

