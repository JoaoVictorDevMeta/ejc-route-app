import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <Skeleton className="h-[600px]" />
        <Skeleton className="h-[600px] lg:col-span-3" />
      </div>
    </div>
  );
}