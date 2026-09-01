const BOT_NAME = "Juana";

interface PreOpenBubbleProps {
  onDismiss: () => void;
}

export function PreOpenBubble({ onDismiss }: PreOpenBubbleProps) {
  return (
    <div className="fixed bottom-[92px] right-6 bg-white border border-border rounded-xl py-3 pl-3.5 pr-8 z-[9997] shadow-[0_4px_16px_rgba(0,0,0,0.10)] max-w-[220px]">
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute top-1.5 right-2 bg-transparent border-none text-base cursor-pointer text-gray-400 leading-none hover:text-gray-600 transition-colors"
      >
        ×
      </button>
      <p className="m-0 text-[14px] font-medium text-gray-900">Magandang araw! 👋</p>
      <p className="m-0 mt-0.5 text-[12px] text-gray-700">
        Ako si {BOT_NAME}.<br />
        <span className="text-gray-500 text-xs">Maaaring ipahayag dito ang iyong katanungnan.</span>
      </p>
    </div>
  );
}
