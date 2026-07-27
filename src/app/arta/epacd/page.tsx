import type { Metadata } from "next";
import EPACDForm from "@/components/arta/epacd/EPACDForm";

export const metadata: Metadata = {
  title: "E-PACD | San Pablo City",
  description:
    "Electronic Public Assistance and Complaints Desk — submit a concern or complaint to the City Government of San Pablo.",
};

export default function EpacdPage() {
  return (
    <main className="min-h-screen bg-gray-50/60 px-4 py-8 sm:py-12">
      <h1 className="mx-auto mb-4 w-full max-w-2xl text-[15px] font-semibold tracking-wide text-gray-500 sm:text-[16px]">
        E-PACD
      </h1>
      <EPACDForm />
    </main>
  );
}