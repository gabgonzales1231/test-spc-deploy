import { officeList, type OfficeEntry } from "@/data/citizens-charter";

export function searchOffices(query: string): OfficeEntry[] {
  if (!query.trim()) return officeList;

  const lower = query.toLowerCase();
  return officeList.filter(
    (entry) =>
      entry.name.toLowerCase().includes(lower) ||
      entry.office.toLowerCase().includes(lower)
  );
}