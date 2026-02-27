"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button} from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar1Icon, Car, Clock, ImagePlus, LineSquiggle, MapIcon, MapPin, PlaneLanding } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { addNewSchema } from "@/lib/schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import ItinerariesBuilder from "@/components/ItinerariesBuilder";
import PricingBuilder from "@/components/PricingBuilder";
import { uploadJourney } from "@/lib/api";
// import { uploadJourney } from "@/lib/api";

const countries = [
  { title: "Kenya", value: "kenya" },
  { title: "Tanzania", value: "tanzania" },
  { title: "Uganda", value: "uganda" },
];

const TAG_OPTIONS = [
  "safari",
  "beach",
  "hiking",
  "cultural",
  "wildlife",
  "adventure",
  "honeymoon",
  "mountain",
  "luxury",
  "budget",
];

export type FormValues = z.infer<typeof addNewSchema>;

const AddNew = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(addNewSchema),
    defaultValues: {
      name: "",
      slug: "",
      imgUrl: "",
      location: "",
      description: "",
      transportation: "",
      rating: 1,
      numberOfDays: 1,
      activities: [],
      bestTimeToVisit: "",
      country: "",
      itineraries: [],
      tags: [],
      pricing:[]
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await uploadJourney(values);
      console.log(values);
      router.push("/journeys");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto font-sans">
      <h1 className="dark-3 font-semibold text-lg">Add new journey</h1>
      <p className="text-[15px] dark-5">
        Fill in the required fields to create a new itinerary
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-7">
        {/* Name */}
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Journey title</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <PlaneLanding size={16} className="dark-4" />
                <Input
                  {...field}
                  placeholder="2 day trip to Mombasa"
                  className="focus-visible:ring-0 border-0 shadow-none"
                />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Slug */}
        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Journey slug</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <LineSquiggle size={16} className="dark-4" />
                <Input
                  {...field}
                  placeholder="2-day-trip-to-mombasa"
                  className="focus-visible:ring-0 border-0 shadow-none"
                />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Country */}
        <Controller
          control={form.control}
          name="country"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Country</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <MapIcon size={16} className="dark-4" />
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full shadow-none border-none">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="rounded-3xl p-1">
                    <SelectGroup>
                      {countries.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Description</FieldLabel>
              <div className="flex items-center gap-3 px-5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <Textarea
                  {...field}
                  placeholder="Give a brief overview or description about the journey"
                  className="h-40 resize-none shadow-none focus-visible:ring-0 border-none"
                />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Tags */}
        <Controller
          control={form.control}
          name="tags"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Journey tags</FieldLabel>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                {TAG_OPTIONS.map((tag) => {
                  const selected = field.value.includes(tag);

                  return (
                    <Button
                      key={tag}
                      type="button"
                      onClick={() =>
                        selected
                          ? field.onChange(
                              field.value.filter((t) => t !== tag)
                            )
                          : field.onChange([...field.value, tag])
                      }
                      className={`px-4 py-1.5 rounded-full text-sm cursor-pointer font-medium text-white hover:text-black ${
                        selected
                          ? "bg-black text-white"
                          : "bg-blue-500 hover:bg-white"
                      }`}
                    >
                      {tag}
                    </Button>
                  );
                })}
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Image URL */}
        <Controller
          control={form.control}
          name="imgUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Image URL</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <ImagePlus size={16} className="dark-4" />
                <Input
                  {...field}
                  className="focus-visible:ring-0 border-0 shadow-none"
                  placeholder="https://images.unsplash.com/photo-14256373"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Go to{" "}
                <Link className="font-bold" href={"https://unsplash.com/"}>
                  Unsplash.com
                </Link>{" "}
                for fast loading photos and paste image link here
              </p>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Location */}
        <Controller
          control={form.control}
          name="location"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Location</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <MapPin size={16} className="dark-4" />
                <Input
                  {...field}
                  className="focus-visible:ring-0 border-0 shadow-none"
                  placeholder="Tudor, Mombasa"
                />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Transportation */}
        <Controller
          control={form.control}
          name="transportation"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Transportation</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <Car size={16} className="dark-4" />
                <Input
                  {...field}
                  className="focus-visible:ring-0 border-0 shadow-none"
                  placeholder="4x4 Land cruiser"
                />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Number of days */}
        <Controller
          control={form.control}
          name="numberOfDays"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Number of days</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <Calendar1Icon size={16} className="dark-4" />
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(+e.target.value)}
                  className="focus-visible:ring-0 border-0 shadow-none"
                />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Activities */}
        <Controller
          control={form.control}
          name="activities"
          render={({ field, fieldState }) => {
            const addActivity = () => {
              const value = input.trim();
              if (!value) return;

              if (field.value.includes(value)) {
                setInput("");
                return;
              }

              field.onChange([...field.value, value]);
              setInput("");
            };

            const removeActivity = (index: number) => {
              field.onChange(
                field.value.filter((_: string, i: number) => i !== index)
              );
            };

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="dark-4">Activities</FieldLabel>
                <div className="flex flex-wrap gap-2 p-3 rounded-3xl bg-gray-200/30">
                  {field.value.map((activity: string, index: number) => (
                    <span
                      key={activity}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-black text-white rounded-full"
                    >
                      {activity}
                      <button
                        type="button"
                        onClick={() => removeActivity(index)}
                        className="text-white/70 hover:text-white focus:outline-none"
                        aria-label={`Remove ${activity}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addActivity();
                      }
                    }}
                    placeholder="Type activity and press Enter"
                    className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        {/* Best time to visit */}
        <Controller
          control={form.control}
          name="bestTimeToVisit"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="dark-4">Best time to visit</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <Clock size={16} className="dark-4" />
                <Input
                  {...field}
                  className="focus-visible:ring-0 border-0 shadow-none"
                  placeholder="eg. from August to december"
                />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Dynamic itineraries */}
        <ItinerariesBuilder form={form} />
        <PricingBuilder form={form} />

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-3xl bg-emerald-700 font-semibold text-white"
        >
          {loading ? "Creating..." : "Create Journey"}
        </Button>
      </form>
    </section>
  );
};

export default AddNew;