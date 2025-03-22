'use client'

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Star, Calendar, User, Tag, Info, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { servers } from "@/lib/data"
import { ServerCodeDisplay } from "@/components/server-code-display"
import { useEffect, useState } from "react"

interface ServerPageProps {
  params: {
    id: string
  }
}

export default function ServerPage({ params }: ServerPageProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      
      checkIfMobile()
      
      if (window.innerWidth < 768) {
        setActiveTab("overview")
      } else {
        setActiveTab("code")
      }
      
      window.addEventListener("resize", checkIfMobile)
      return () => window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const server = servers.find((s) => s.id === params.id) || {
    id: params.id,
    name: `${params.id} Server`,
    description: "Server description would go here.",
    longDescription: "Detailed server description would go here.",
    category: "Category",
    downloads: 1000,
    rating: 4.0,
    reviews: 50,
    author: "Author",
    version: "1.0.0",
    lastUpdated: "2025-01-01",
    requirements: ["Requirement 1", "Requirement 2"],
    features: ["Feature 1", "Feature 2", "Feature 3"],
    image: `/placeholder.svg?height=400&width=800&text=${params.id}`,
    serverCode: {
      main: "",
      package: "",
      client: "",
      types: ""
    },
  }

  // Find similar servers in the same category
  const similarServers = servers.filter((s) => s.category === server.category && s.id !== server.id).slice(0, 4)

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to servers
      </Link>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Badge variant="secondary" className="text-xs px-2.5 py-0.5 font-medium">
                  {server.category}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="font-medium">{server.rating}</span>
                  <span className="text-xs">({server.reviews} reviews)</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{server.name}</h1>
              <p className="text-base text-muted-foreground leading-relaxed">{server.description}</p>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/20">
              <Image
                src={server.image || `/placeholder.svg?height=400&width=800&text=${server.name}`}
                alt={server.name}
                className="object-cover"
                fill
                priority
              />
            </div>

            <div className="flex flex-wrap items-center justify-between py-3 border-y gap-y-2">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{server.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">v{server.version}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{server.lastUpdated}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm bg-muted/30 px-3 py-1 rounded-full">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{server.downloads.toLocaleString()}</span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 h-11 bg-muted/50 p-1 rounded-lg">
                {!isMobile && (
                  <TabsTrigger 
                    value="code" 
                    className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow rounded-md h-full"
                  >
                    Server Code
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="overview" 
                  className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow rounded-md h-full"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow rounded-md h-full"
                >
                  Features
                </TabsTrigger>
              </TabsList>

              {!isMobile && (
                <TabsContent value="code" className="space-y-6 pt-6 mt-2">
                  {server.serverCode && (server.serverCode.main || server.serverCode.package || server.serverCode.client) ? (
                    <ServerCodeDisplay serverCode={server.serverCode} />
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="rounded-full bg-muted/50 p-3 mb-4">
                          <Info className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-center mb-2">Server code is not available for this MCP server.</p>
                        <p className="text-sm text-muted-foreground/70 text-center max-w-md">
                          The creator has not provided any code examples or configuration files for this server.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              )}

              <TabsContent value="overview" className="space-y-8 pt-6 mt-2">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <div className="prose prose-gray dark:prose-invert prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{server.longDescription}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {server.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/15 p-1 mt-1">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-muted-foreground">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {isMobile && (
                  <Card className="bg-muted/10 border-muted/40 mt-6">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm mb-1">Desktop View Required</h4>
                        <p className="text-sm text-muted-foreground">
                          Server code is only available when viewing on a desktop device.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="features" className="space-y-8 pt-6 mt-2">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                  <ul className="grid gap-4">
                    {server.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/15 p-1 mt-1">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="overflow-hidden border-muted/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Server Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <dl className="space-y-4">
                <div className="flex justify-between items-center py-1.5 border-b border-muted/30 last:border-0">
                  <dt className="text-sm text-muted-foreground">Author</dt>
                  <dd className="font-medium text-sm">{server.author}</dd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-muted/30 last:border-0">
                  <dt className="text-sm text-muted-foreground">Version</dt>
                  <dd className="font-medium text-sm">{server.version}</dd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-muted/30 last:border-0">
                  <dt className="text-sm text-muted-foreground">Last Updated</dt>
                  <dd className="font-medium text-sm">{server.lastUpdated}</dd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-muted/30 last:border-0">
                  <dt className="text-sm text-muted-foreground">Downloads</dt>
                  <dd className="font-medium text-sm flex items-center gap-1.5">
                    <Download className="h-4 w-4" />
                    {server.downloads.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <dt className="text-sm text-muted-foreground">Rating</dt>
                  <dd className="font-medium text-sm flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {server.rating}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-muted/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3">
                {server.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/15 p-1 mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full gap-2 h-11">
            <Download className="h-4 w-4" />
            Download Server
          </Button>

          {similarServers.length > 0 && (
            <Card className="overflow-hidden border-muted/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Similar Servers</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {similarServers.map((similar) => (
                    <Link key={similar.id} href={`/servers/${similar.id}`} className="block">
                      <Card className="overflow-hidden hover:bg-muted/20 transition-colors border-muted/40">
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0 border">
                            <Image
                              src={similar.image || `/placeholder.svg?height=100&width=100&text=${similar.name}`}
                              alt={similar.name}
                              className="object-cover"
                              fill
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{similar.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                <span>{similar.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                <span>{similar.downloads.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <h3 className="font-medium text-sm mb-1">Need Help?</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Check out our documentation or join our community for support.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-8">
                <ExternalLink className="h-3 w-3" />
                Visit Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
