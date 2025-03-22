"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { servers } from "@/lib/data"

export function FeaturedCarousel() {
  const featuredServers = servers.filter((server) => server.featured)
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = useCallback(() => {
    setCurrent((current) => (current + 1) % featuredServers.length)
  }, [featuredServers.length])

  const prev = useCallback(() => {
    setCurrent((current) => (current - 1 + featuredServers.length) % featuredServers.length)
  }, [featuredServers.length])

  // Autoplay
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [autoplay, next])

  // Pause autoplay on hover
  const pauseAutoplay = () => setAutoplay(false)
  const resumeAutoplay = () => setAutoplay(true)

  if (featuredServers.length === 0) return null

  const server = featuredServers[current]

  return (
    <div className="relative rounded-xl overflow-hidden" onMouseEnter={pauseAutoplay} onMouseLeave={resumeAutoplay}>
      <Card className="border-0 overflow-hidden">
        <div className="md:grid md:grid-cols-5 md:h-[400px]">
          <div className="relative aspect-video md:aspect-auto md:col-span-3">
            <Image
              src={server.image || `/placeholder.svg?height=400&width=600`}
              alt={server.name}
              className="object-cover"
              fill
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/30 md:to-transparent flex items-end">
              <div className="p-6 text-white md:hidden">
                <Badge className="mb-2 bg-primary/80 hover:bg-primary/70 text-white border-0">{server.category}</Badge>
                <h2 className="text-2xl font-bold mb-1">{server.name}</h2>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{server.rating}</span>
                    <span className="text-xs">({server.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{server.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-6 md:col-span-2 flex flex-col">
            <div className="hidden md:block">
              <Badge className="mb-2">{server.category}</Badge>
              <h2 className="text-2xl font-bold mb-2">{server.name}</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{server.rating}</span>
                  <span className="text-xs">({server.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{server.downloads.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground flex-1">{server.description}</p>

            <div className="flex gap-3 mt-6">
              <Link href={`/servers/${server.id}`} className="flex-1">
                <Button className="w-full">View Code</Button>
              </Link>
              <Link href={`/servers/${server.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Navigation arrows */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 text-foreground"
          onClick={prev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 text-foreground"
          onClick={next}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {featuredServers.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === current ? "w-6 bg-primary" : "w-1.5 bg-primary/50"
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  )
}

