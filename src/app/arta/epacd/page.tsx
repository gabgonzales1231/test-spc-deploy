import type { Metadata } from "next";
import EPACDForm from "@/components/arta/epacd/EPACDForm";

export const metadata: Metadata = {
  title: "Electronic Public Assistance and Complaints Desk | City Government of San Pablo",
  description:
    "Submit your concern or complaint to the City Government of San Pablo through the Electronic Public Assistance and Complaints Desk (EPACD).",
};

export default function EPACDPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:py-16">
      <EPACDForm />
    </main>
  );
}