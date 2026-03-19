/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const TIERS = ["BUDGET", "MIDRANGE", "LUXURY"] as const;
const CURRENCIES = ["KES", "USD"] as const;


// Reusable tag input for inclusions/exclusions
function TagListInput({
  label,
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  label: string;
  items: string[];
  onAdd: (val: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <p className="text-[15px] font-medium">{label}</p>

      {/* Input row */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder ?? `Add ${label.toLowerCase()}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="rounded-2xl h-10 text-sm flex-1"
        />
        <Button
          type="button"
          size={"icon-sm"}
          onClick={handleAdd}
          className="rounded-full"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Tags */}
      {items.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-2 bg-muted px-3 py-2 rounded-xl text-sm"
            >
              <span className="flex-1 leading-snug">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-muted-foreground hover:text-destructive mt-0.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PricingBuilder({ form }: any) {
  
  return (
    <Controller
      control={form.control}
      name="pricing"
      render={({ field }) => {
        const addTier = (tier: string) => {
          if (field.value.find((p: any) => p.tier === tier)) return;

          field.onChange([
            ...field.value,
            {
              tier,
              citizenPrice: 0,
              nonResidentPrice: 0,
              currency: "KES",
              accommodation: "",
              transportType: "",
              transportDescription: "",
            },
          ]);
        };

        const updateTier = (index: number, key: string, value: any) => {
          const updated = [...field.value];
          updated[index][key] = value;
          field.onChange(updated);
        };

        const removeTier = (index: number) => {
          field.onChange(field.value.filter((_: any, i: number) => i !== index));
        };


        const addListItem = (index: number, key: "inclusions" | "exclusions", value: string) => {
          const updated = [...field.value];
          updated[index][key] = [...(updated[index][key] ?? []), value];
          field.onChange(updated);
        };

        const removeListItem = (index: number, key: "inclusions" | "exclusions", itemIndex: number) => {
          const updated = [...field.value];
          updated[index][key] = updated[index][key].filter((_: string, i: number) => i !== itemIndex);
          field.onChange(updated);
        };

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
            <h3 className="font-medium">Add pricing tiers</h3>

            </div>

            {/* Add Tier Buttons */}
            <div className="flex gap-2">
              {TIERS.map((tier) => (
                <Button size={'sm'} key={tier} type="button" onClick={() => addTier(tier)} className="text-sm rounded-full">
                  <span className="font-medium">Add {tier}</span>
                </Button>
              ))}
            </div>

            {/* Pricing Forms */}
            {field.value.map((p: any, index: number) => (
              <Card key={p.tier} className="border p-6 rounded-4xl space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold">{p.tier}</h4>
                  <Button type="button" variant="destructive" onClick={() => removeTier(index)}>
                    Remove
                  </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-3">
                   {/* Citizen Price */}
               <div className="flex flex-col gap-1.5">
                <p className="text-[15px]">Citizen price</p>
                <Input
                  type="number"
                  placeholder="Citizen Price"
                  value={p.citizenPrice}
                  onChange={(e) => updateTier(index, "citizenPrice", Number(e.target.value))}
                  className="rounded-2xl h-10 text-sm lg:text-[15px]"
                />
               </div>
                
                

                {/* Non Resident Price */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[15px]">Non resident price</p>
                  <Input
                  type="number"
                  placeholder="Non Resident Price"
                  value={p.nonResidentPrice}
                  onChange={(e) => updateTier(index, "nonResidentPrice", Number(e.target.value))}
                  className="rounded-2xl h-10"

                />
                </div>
                </div>
               
                
                <div className="">
                  <span className="text-[15px]">Currency</span>
                                  {/* Currency Dropdown */}
               <Select
  value={p.currency}
  onValueChange={(value) => updateTier(index, "currency", value)}
>
  <SelectTrigger className="w-full shadow-none border rounded-2xl h-12 mt-1">
    <SelectValue placeholder="Select currency" />
  </SelectTrigger>

  <SelectContent className="rounded-3xl p-1">
    {CURRENCIES.map((c) => (
      <SelectItem key={c} value={c}>
        {c}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                </div>



                {/* Accommodation */}
                <Input
                  placeholder="Accommodation"
                  value={p.accommodation}
                  onChange={(e) => updateTier(index, "accommodation", e.target.value)}
                  className="rounded-2xl h-10"

                />

                <div className="grid lg:grid-cols-2 gap-3">
                    <div>
                  <span className="text-[15px]">Transport Type</span>
                   {/* Transport Type */}
                <Input
                  placeholder="Transport Type"
                  value={p.transportType}
                  onChange={(e) => updateTier(index, "transportType", e.target.value)}
                  className="rounded-2xl h-10 mt-1 text-sm lg:text-[15px]"

                />
                </div>
               


                <div>
                  <span className="text-[15px]">Transport description</span>
                  {/* Transport Description */}
                <Input
                  placeholder="Transport Description"
                  value={p.transportDescription}
                  onChange={(e) => updateTier(index, "transportDescription", e.target.value)}
                  className="rounded-2xl h-10 mt-1 text-sm lg:text-[15px]"

                />
                </div>
                </div>

               
                {/* Inclusions */}
                <TagListInput
                  label="Inclusions"
                  items={p.inclusions ?? []}
                  onAdd={(val) => addListItem(index, "inclusions", val)}
                  onRemove={(i) => removeListItem(index, "inclusions", i)}
                  placeholder="e.g. Park fees, Accommodation, Meals..."
                />

                {/* Exclusions */}
                <TagListInput
                  label="Exclusions"
                  items={p.exclusions ?? []}
                  onAdd={(val) => addListItem(index, "exclusions", val)}
                  onRemove={(i) => removeListItem(index, "exclusions", i)}
                  placeholder="e.g. Flights, Travel insurance..."
                />
              
                
              </Card>
            ))}
          </div>
        );
      }}
    />
  );
}
