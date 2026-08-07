import type { Metadata } from "next";
import CSMForm from "@/components/arta/client-feedback/CSMForm";

export const metadata: Metadata = {
  title: "Client Feedback | San Pablo City",
  description:
    "Client Satisfaction Measurement (CSM) — share feedback on your recently concluded transaction with the City Government of San Pablo.",
};

export default async function ClientFeedbackOfficePage({
  params,
}: {
  params: Promise<{ officeSlug: string }>;
}) {
  const { officeSlug } = await params;

  return (
    <main className="min-h-screen bg-gray-50/60 px-4 py-8 sm:py-12">
      <h1 className="mx-auto mb-4 w-full max-w-2xl text-[15px] font-semibold tracking-wide text-gray-500 sm:text-[16px]">
        CLIENT FEEDBACK
      </h1>
      <CSMForm officeSlug={officeSlug} />
    </main>
  );
}