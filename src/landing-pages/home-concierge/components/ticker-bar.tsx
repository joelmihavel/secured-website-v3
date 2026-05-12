export function TickerBar() {
  const items = [
    "Fully Furnished",
    "24/7 Resident Support",
    "Minimal Deposits",
    "Private rooms from \u20B925,000/month",
    "Kitchenware included",
    "Move in with just your clothes",
    "No brokerage. No deposit drama",
    "Homes in HSR, Indiranagar, Koramangala & more",
  ]

  const tickerContent = items.map((item, i) => (
    <span key={i} className="flex items-center gap-6 whitespace-nowrap">
      <span className="font-sans text-sm font-medium tracking-wide">
        {item}
      </span>
      <span className="text-flent-yellow/60" aria-hidden="true">
        {"·"}
      </span>
    </span>
  ))

  return (
    <div
      className="w-full overflow-x-hidden bg-flent-green py-2.5"
      role="region"
      aria-label="Key features of Flent homes"
    >
      <div className="animate-ticker flex w-max gap-6 text-flent-yellow">
        <div className="flex gap-6">{tickerContent}</div>
        <div className="flex gap-6" aria-hidden="true">
          {tickerContent}
        </div>
      </div>
    </div>
  )
}
