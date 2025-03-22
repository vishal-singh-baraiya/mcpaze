import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Star, Calendar, User, Tag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { servers } from "@/lib/data"
import { ServerCodeDisplay } from "@/components/server-code-display"

interface ServerPageProps {
  params: {
    id: string
  }
}

export default function ServerPage({ params }: ServerPageProps) {
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
  }

  // Find similar servers in the same category
  const similarServers = servers.filter((s) => s.category === server.category && s.id !== server.id).slice(0, 4)

  return (
    <div className="container py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to servers
      </Link>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{server.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span>{server.rating}</span>
                    <span className="text-xs">({server.reviews})</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold">{server.name}</h1>
                <p className="text-muted-foreground">{server.description}</p>
              </div>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={server.image || `/placeholder.svg?height=400&width=800&text=${server.name}`}
                alt={server.name}
                className="object-cover"
                fill
              />
            </div>

            <div className="flex items-center justify-between py-2 border-y">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{server.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>v{server.version}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{server.lastUpdated}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span>{server.downloads.toLocaleString()}</span>
              </div>
            </div>

            <Tabs defaultValue="code">
              <TabsList className="w-full">
                <TabsTrigger value="code" className="flex-1">
                  Server Code
                </TabsTrigger>
                <TabsTrigger value="overview" className="flex-1">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="features" className="flex-1">
                  Features
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="space-y-4 pt-4">
                {server.serverCode ? (
                  <ServerCodeDisplay serverCode={server.serverCode} />
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <p className="text-muted-foreground">Server code is not available for this MCP server.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">Description</h2>
                  <p>{server.longDescription}</p>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-2">Requirements</h2>
                  <ul className="grid gap-2">
                    {server.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/20 p-1 mt-1">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 pt-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">Key Features</h2>
                  <ul className="grid gap-3">
                    {server.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/20 p-1 mt-1">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-bold mb-4">Server Information</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Author</dt>
                <dd className="font-medium">{server.author}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-medium">{server.version}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last Updated</dt>
                <dd className="font-medium">{server.lastUpdated}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Downloads</dt>
                <dd className="font-medium flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {server.downloads.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Rating</dt>
                <dd className="font-medium flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {server.rating}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-bold mb-4">Requirements</h2>
            <ul className="space-y-2">
              {server.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {similarServers.length > 0 && (
            <div className="rounded-lg border p-4">
              <h2 className="text-lg font-bold mb-4">Similar Servers</h2>
              <div className="space-y-3">
                {similarServers.map((similar) => (
                  <Link key={similar.id} href={`/servers/${similar.id}`}>
                    <Card className="overflow-hidden hover:bg-muted/50 transition-colors">
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={similar.image || `/placeholder.svg?height=100&width=100&text=${similar.name}`}
                            alt={similar.name}
                            className="object-cover"
                            fill
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{similar.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

