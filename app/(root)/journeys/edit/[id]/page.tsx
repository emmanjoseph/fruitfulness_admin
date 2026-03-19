/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlaneLanding,
  LineSquiggle,
  MapIcon,
  MapPin,
  ImagePlus,
  Car,
  Calendar1Icon,
  Clock,
} from "lucide-react";

import { fetchJourneyById, updateJourney} from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import { addNewSchema } from "@/lib/schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import ItinerariesBuilder from "@/components/ItinerariesBuilder";
import PricingBuilder from "@/components/PricingBuilder";
import { IconX } from "@tabler/icons-react";
import { TAG_OPTIONS } from "../../add-new/page";
import { PricingInclusionsEditor } from "@/components/pricingInclusionsEditor";

export type FormValues = z.infer<typeof addNewSchema>;

const countries = [
  { title: "Kenya", value: "kenya" },
  { title: "Tanzania", value: "tanzania" },
  { title: "Uganda", value: "uganda" },
];



export default function UpdateJourney() {
  const { id } = useParams();
  const [input, setInput] = useState("")
  const router = useRouter();
  const journeyId = Array.isArray(id) ? id[0] : id;

  const [loading, setLoading] = useState(false);

    const [btv, setBtv] = useState("");


  const form = useForm<FormValues>({
    resolver: zodResolver(addNewSchema),
    defaultValues: {
      name: "",
      slug: "",
      imgUrl: "",
      location: "",
      description: "",
      transportation: "",
      rating: undefined,
      numberOfDays: 1,
      activities: [],
      bestTimeToVisit: [],
      country: "",
      itineraries: [],
      tags: [],
      pricing:[]
    },
  });

  useEffect(() => {
    if (!journeyId) return;

    const loadJourney = async () => {
      setLoading(true);
      try {
        const res = await fetchJourneyById(journeyId);
        const data = res?.data ?? res;

        form.reset({
          name: data.name ?? "",
          slug: data.slug ?? "",
          imgUrl: data.imgUrl ?? "",
          location: data.location ?? "",
          description: data.description ?? "",
          transportation: data.transportation ?? "",
          rating: data.rating ?? 1,
          numberOfDays: data.numberOfDays ?? 1,
          bestTimeToVisit: data.bestTimeToVisit ?? "",
          country: data.country ?? "",

          activities: Array.isArray(data.activities)
            ? data.activities.map((a: any) =>
                typeof a === "string" ? a : a.name
              )
            : [],

          tags: Array.isArray(data.tags)
            ? data.tags.map((t: any) =>
                typeof t === "string" ? t : t.name
              )
            : [],

          itineraries: data.itineraries ?? [],
          pricing: data.pricing ?? [],
        });
      } catch (err) {
        console.error("Failed to load journey", err);
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [journeyId, form]);

  async function onSubmit(values: FormValues) {
    if (!journeyId) return;
    setLoading(true);
    await toast.promise(
      updateJourney(journeyId, values),
      {
        loading: "Saving changes...",
        success: `Selected journey updated successfully`,
        error: (err) =>
          err?.message || "Failed to update journey",
      }
    );

    router.push("/journeys");
    // alert("Journey update is disabled temporarily")
  }

  return (
    <section className="max-w-xl mx-auto pb-20">
      <h1 className="text-lg font-semibold">Edit journey</h1>
      <p className="text-sm text-muted-foreground">
        Update journey details below
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        {/* NAME */}
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Journey title</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10  rounded-3xl">
                <PlaneLanding size={16} />
                <Input {...field} className="focus-visible:ring-0 border-0 shadow-none bg-none text-sm" />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* SLUG */}
        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Slug</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <LineSquiggle size={16} />
                <Input {...field} className="focus-visible:ring-0 border-0 shadow-none bg-none text-sm" />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* COUNTRY */}
        <Controller
          control={form.control}
          name="country"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Country</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <MapIcon size={16} />
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full shadow-none border-none">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
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

        {/* DESCRIPTION */}
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>
              <div className="flex items-center gap-3 px-5 py-2 bg-gray-200/30 dark:bg-gray-100/10 rounded-3xl">
                <Textarea {...field} rows={5} className="h-40 resize-none shadow-none focus-visible:ring-0 border-none text-sm lg:text-[15px]" />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* TAGS */}
        <Controller
          control={form.control}
          name="tags"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Tags</FieldLabel>
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

        {/* IMAGE URL */}
        <Controller
          control={form.control}
          name="imgUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Image URL</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/20 rounded-3xl">
                <ImagePlus size={16} />
                <Input {...field} className="focus-visible:ring-0 border-0 shadow-none bg-none text-sm" placeholder="https://images.unsplash.com/photo-14256373" />
              </div>
              <p className="text-sm text-muted-foreground">Go to <Link className="font-bold" href={"https://unsplash.com/"}>Unsplash.com</Link> for fast loading photos and paste image link here</p>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* LOCATION */}
        <Controller
          control={form.control}
          name="location"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Location</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/20 rounded-3xl">
                <MapPin size={16} />
                <Input {...field} className="focus-visible:ring-0 border-0 shadow-none bg-none text-sm" placeholder="Tudor, Mombasa" />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* TRANSPORTATION */}
        <Controller
          control={form.control}
          name="transportation"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Transportation</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/20 rounded-3xl">
                <Car size={16} />
                <Input {...field} className="focus-visible:ring-0 border-0 shadow-none bg-none text-sm" placeholder="4x4 Land cruiser" />
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* NUMBER OF DAYS */}
        <Controller
          control={form.control}
          name="numberOfDays"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Number of days</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/20 rounded-3xl">
                <Calendar1Icon size={16} />
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

        {/* RATING */}
        <Controller
          control={form.control}
          name="rating"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Rating</FieldLabel>
              <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-200/30 dark:bg-gray-100/20 rounded-3xl">
                <Calendar1Icon size={16} />
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

        {/* ACTIVITIES */}
        <Controller
          control={form.control}
          name="activities"
          render={({ field, fieldState }) => {
            const addActivity = () => {
              const value = input.trim()
              if (!value) return

              if (field.value.includes(value)) {
                setInput("")
                return
              }

              field.onChange([...field.value, value])
              setInput("")
            }

            const removeActivity = (index: number) => {
              field.onChange(field.value.filter((_: string, i: number) => i !== index))
            }

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Activities</FieldLabel>
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
                        <IconX size={15}/>
                      </button>
                    </span>
                  ))}

                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addActivity()
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
            )
          }}
        />
         {/* Best time to visit */}
               {/* Best time to visit */}
<Controller
  control={form.control}
  name="bestTimeToVisit"
  render={({ field, fieldState }) => {

    return (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel>Best time to visit</FieldLabel>
        <div className="flex flex-wrap gap-2 p-3 rounded-3xl bg-gray-200/30 dark:bg-gray-100/10">
          {(field.value ?? []).map((item: string, i: number) => (
            <span
              key={i}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-black text-white rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() =>
  field.onChange((field.value ?? []).filter((_: string, idx: number) => idx !== i))
}
                className="text-white/70 hover:text-white"
              >
                <IconX size={15} />
              </button>
            </span>
          ))}
          <Input
            value={btv}
            onChange={(e) => setBtv(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const trimmed = btv.trim();
                if (!trimmed) return;
                field.onChange([...(field.value ?? []), trimmed]);
                setBtv("");
              }
            }}
            placeholder='e.g. "June to October" then press Enter'
            className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm"
          />
        </div>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    );
  }}
/>

        {/* ITINERARIES */}
        <ItinerariesBuilder form={form} />
        <PricingBuilder form={form}/>

        {journeyId && <PricingInclusionsEditor journeyId={journeyId} />}

        <Button type="submit" disabled={loading} className="w-full rounded-full h-12 bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer">
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </section>
  );
}