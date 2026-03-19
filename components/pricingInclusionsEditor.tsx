/* eslint-disable @typescript-eslint/no-explicit-any */
"use cleint"

import { PricingTier,updatePricingInclusionsExclusions } from "@/lib/actions";
// Add this import
import {fetchJourneyById } from "@/lib/api";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export function PricingInclusionsEditor({ journeyId }: { journeyId: string }) {
  const [pricingData, setPricingData] = useState<
    { tier: PricingTier; inclusions: string[]; exclusions: string[] }[]
  >([]);
  const [saving, setSaving] = useState<PricingTier | null>(null);
  const [inputMap, setInputMap] = useState<
    Record<string, { inclusion: string; exclusion: string }>
  >({});

  useEffect(() => {
    const load = async () => {
      const res = await fetchJourneyById(journeyId);
      const data = res?.data ?? res;
      const tiers = (data.pricing ?? []).map((p: any) => ({
        tier: p.tier as PricingTier,
        inclusions: p.inclusions ?? [],
        exclusions: p.exclusions ?? [],
      }));
      setPricingData(tiers);
      setInputMap(
        Object.fromEntries(
          tiers.map((p: any) => [p.tier, { inclusion: "", exclusion: "" }])
        )
      );
    };
    load();
  }, [journeyId]);

  const addItem = (tier: PricingTier, key: "inclusions" | "exclusions", value: string) => {
    if (!value.trim()) return;
    setPricingData((prev) =>
      prev.map((p) =>
        p.tier === tier ? { ...p, [key]: [...p[key], value.trim()] } : p
      )
    );
    setInputMap((prev) => ({
      ...prev,
      [tier]: { ...prev[tier], [key === "inclusions" ? "inclusion" : "exclusion"]: "" },
    }));
  };

  const removeItem = (tier: PricingTier, key: "inclusions" | "exclusions", index: number) => {
    setPricingData((prev) =>
      prev.map((p) =>
        p.tier === tier
          ? { ...p, [key]: p[key].filter((_, i) => i !== index) }
          : p
      )
    );
  };

  const save = async (tier: PricingTier) => {
    const tierData = pricingData.find((p) => p.tier === tier);
    if (!tierData) return;
    setSaving(tier);
    try {
      await updatePricingInclusionsExclusions(journeyId, tier, {
        inclusions: tierData.inclusions,
        exclusions: tierData.exclusions,
      });
      toast.success(`${tier} inclusions/exclusions updated`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update");
    } finally {
      setSaving(null);
    }
  };

  if (!pricingData.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Pricing Inclusions & Exclusions Editor</h3>
      {pricingData.map(({ tier, inclusions, exclusions }) => (
        <div key={tier} className="border rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm">{tier}</h4>
            <Button
              type="button"
              size="sm"
              disabled={saving === tier}
              onClick={() => save(tier)}
              className="rounded-full text-xs h-8 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {saving === tier ? "Saving..." : "Save changes"}
            </Button>
          </div>

          {/* Inclusions */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Inclusions</p>
            <div className="flex gap-2">
              <Input
                value={inputMap[tier]?.inclusion ?? ""}
                onChange={(e) =>
                  setInputMap((prev) => ({
                    ...prev,
                    [tier]: { ...prev[tier], inclusion: e.target.value },
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem(tier, "inclusions", inputMap[tier]?.inclusion ?? "");
                  }
                }}
                placeholder="Add inclusion and press Enter"
                className="rounded-2xl h-9 text-sm flex-1"
              />
              <Button
                type="button"
                size="sm"
                className="rounded-2xl h-9"
                onClick={() => addItem(tier, "inclusions", inputMap[tier]?.inclusion ?? "")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <ul className="space-y-1.5">
              {inclusions.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-2 bg-muted px-3 py-2 rounded-xl text-sm">
                  <span className="flex-1 leading-snug">{item}</span>
                  <button type="button" onClick={() => removeItem(tier, "inclusions", i)} className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Exclusions</p>
            <div className="flex gap-2">
              <Input
                value={inputMap[tier]?.exclusion ?? ""}
                onChange={(e) =>
                  setInputMap((prev) => ({
                    ...prev,
                    [tier]: { ...prev[tier], exclusion: e.target.value },
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem(tier, "exclusions", inputMap[tier]?.exclusion ?? "");
                  }
                }}
                placeholder="Add exclusion and press Enter"
                className="rounded-2xl h-9 text-sm flex-1"
              />
              <Button
                type="button"
                size="sm"
                className="rounded-2xl h-9"
                onClick={() => addItem(tier, "exclusions", inputMap[tier]?.exclusion ?? "")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <ul className="space-y-1.5">
              {exclusions.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-2 bg-muted px-3 py-2 rounded-xl text-sm">
                  <span className="flex-1 leading-snug">{item}</span>
                  <button type="button" onClick={() => removeItem(tier, "exclusions", i)} className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}