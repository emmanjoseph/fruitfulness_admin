"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFieldArray, UseFormReturn, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { addNewSchema } from "@/lib/schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Card } from "./ui/card";

type FormValues = z.infer<typeof addNewSchema>;

const ItinerariesBuilder = ({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itineraries",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[15px]">Add daily Itineraries</h3>

        <Button
          type="button"
          variant="outline"
          size={'sm'}
          onClick={() =>
            append({
              day: fields.length + 1,
              title: "",
              details: "",
            })
          }
          className="rounded-3xl dark-4 cursor-pointer"
        >
          <Plus size={16} className="mr-1" />
          Add Day
        </Button>
      </div>

      {/* Days */}
      {fields.map((field, index) => (
        <Card
          key={field.id}
          className="rounded-3xl p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium dark-4">
              Day {index + 1}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="cursor-pointer"
            >
              <Trash2 size={16} className="text-red-500" />
            </Button>
          </div>

          {/* Hidden day index */}
          <Controller
            control={form.control}
            name={`itineraries.${index}.day`}
            render={({ field }) => (
              <input type="hidden" {...field} value={index + 1} />
            )}
          />

          {/* Title */}
          <Controller
            control={form.control}
            name={`itineraries.${index}.title`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm">Title</FieldLabel>
                <div className="flex items-center gap-3 rounded-3xl">
                  <Input
                    {...field}
                    placeholder="Arrival & activities"
                    className="border-none  bg-transparent text-sm md:text-[15px] focus-visible:ring-0"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Details */}
          <Controller
            control={form.control}
            name={`itineraries.${index}.details`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm">Details</FieldLabel>
                <div className="flex items-center gap-3  rounded-3xl">
                  <Textarea
                    {...field}
                    placeholder="Describe the day's plan"
                    className="h-28 resize-none border-none bg-transparent rounded-3xl focus-visible:ring-0 shadow text-sm md:text-[15px] "
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </Card>
      ))}
    </div>
  );
};

export default ItinerariesBuilder;