import { Users, Star, Shield, Clock } from "lucide-react"

const badges = [
  {
    icon: Users,
    value: "500+",
    label: "Happy Tenants",
  },
  {
    icon: Star,
    value: "4.8★",
    label: "Google Rating",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Verified Homes",
  },
  {
    icon: Clock,
    value: "12hr",
    label: "Callback Guarantee",
  },
]

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
      {badges.map((badge) => {
        const Icon = badge.icon
        return (
          <div key={badge.label} className="flex items-center gap-2">
            <Icon className="h-5 w-5 shrink-0 text-flent-green" />
            <div>
              <p className="text-sm font-bold text-flent-dark">{badge.value}</p>
              <p className="text-xs text-muted-foreground">{badge.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
