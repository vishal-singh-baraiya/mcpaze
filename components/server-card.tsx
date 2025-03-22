import Link from "next/link"
import Image from "next/image"
import { Download, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ServerType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ServerCardProps {
  server: ServerType
  className?: string
  featured?: boolean
}

export function ServerCard({ server, className, featured = false }: ServerCardProps) {
  return (
    <Card className={cn("overflow-hidden h-full flex flex-col", className)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={server.image || `/placeholder.svg?height=300&width=400`}
          alt={server.name}
          className="object-cover transition-transform hover:scale-105"
          fill
        />
        {server.featured && !featured && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            Featured
          </Badge>
        )}
      </div>
      <CardContent className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/servers/${server.id}`} className="hover:underline">
            <h3 className="font-semibold line-clamp-1">{server.name}</h3>
          </Link>
          <Badge variant="outline" className="text-xs">
            {server.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{server.description}</p>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>{server.rating}</span>
            <span className="text-xs">({server.reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>{server.downloads.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/servers/${server.id}`} className="w-full">
          <Button className="w-full" size="sm">
            View Code
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

