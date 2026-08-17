//src/components/city-government/DepartmentsSection.tsx

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Heart, Wallet, Building2, Leaf, Landmark, Scale } from "lucide-react";
import SectorPill from "@/components/city-government/SectorPill";
import { useGetOffices } from "@/hooks/useOffices";
import { SectorGroup, SectorId, DepartmentOffice } from "@/components/city-government/types";

const SECTOR_META: Record<SectorId, { label: string; icon: React.ElementType }> = {
  social: { label: "Social Development", icon: Heart },
  economic: { label: "Economic Development", icon: Wallet },
  infrastructure: { label: "Infrastructure Development", icon: Building2 },
  environment: { label: "Environment Development", icon: Leaf },
  institutional: { label: "Institutional Development", icon: Landmark },
  legislative: { label: "Legislative Services", icon: Scale },
};

const SECTOR_ORDER: SectorId[] = [
  "social",
  "economic",
  "infrastructure",
  "environment",
  "institutional",
  "legislative",
];

export default function DepartmentsSection() {
  const [openSector, setOpenSector] = useState<string | null>(null);
  const { data, loading, error, execute } = useGetOffices();

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectorGroups: SectorGroup[] = useMemo(() => {
    if (!data) return [];

    return SECTOR_ORDER.filter((id) => data.some((o) => o.sector === id)).map((id) => {
      const meta = SECTOR_META[id];
      const offices: DepartmentOffice[] = data
        .filter((o) => o.sector === id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(({ name, head, contact_info, address }) => ({
          name,
          head,
          email: contact_info?.email ?? "",
          contactNo: contact_info?.contact_no ?? null,
          address,
        }));

      return { id, label: meta.label, icon: meta.icon, offices };
    });
  }, [data]);

  const toggleSector = (id: string) => {
    setOpenSector((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-gray-500 py-8">
        Unable to load department directory. Please try again later.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-5xl mx-auto">
      {sectorGroups.map((sector) => (
        <SectorPill
          key={sector.id}
          sector={sector}
          isOpen={openSector === sector.id}
          onToggle={() => toggleSector(sector.id)}
        />
      ))}
    </div>
  );
}