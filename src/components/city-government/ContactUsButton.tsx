"use client";

export default function ContactUsButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-chat"))}
      className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors duration-300 shadow-md hover:shadow-lg w-[200px] rounded-sm"
    >
      Contact Us
    </button>
  );
}