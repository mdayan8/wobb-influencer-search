import { Check } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500"
      aria-label="Verified account"
    >
      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
    </span>
  );
}
