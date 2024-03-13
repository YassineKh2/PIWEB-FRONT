/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/2S1YYvjT32k
 */
import { CardHeader, Card } from "@/components/ui/card"

export function TeamCard() {
  return (
    (<Card key="1" className="w-full max-w-xs">
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <img
            alt="Team logo"
            className="rounded-full"
            height="40"
            src="/placeholder.svg"
            style={{
              aspectRatio: "40/40",
              objectFit: "cover",
            }}
            width="40" />
          <div className="text-sm font-medium leading-none">Team Name</div>
        </div>
        <div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400" />
        </div>
      </CardHeader>
    </Card>)
  );
}
