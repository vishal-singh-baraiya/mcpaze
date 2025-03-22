import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Download, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function FeaturedServer() {
  return (
    <Card className="overflow-hidden">
      <div className="md:grid md:grid-cols-2">
        <div className="relative aspect-video md:aspect-auto">
          <Image src="/placeholder.svg?height=400&width=600" alt="Neon MCP Server" className="object-cover" fill />
        </div>
        <div className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Neon MCP Server</CardTitle>
                <CardDescription>Manage your Neon Postgres databases using natural language commands</CardDescription>
              </div>
              <Badge variant="outline">Database</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground">
              The Neon MCP Server is an open-source tool that lets you interact with your Neon Postgres databases in
              natural language. Create databases, manage projects, run queries, and perform migrations with simple
              conversational commands. [^2]
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>5,432</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>4.9</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex w-full gap-2">
              <Link href="/servers/neon-mcp" className="flex-1">
                <Button variant="outline" className="w-full">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/servers/neon-mcp/install" className="flex-1">
                <Button className="w-full">Install</Button>
              </Link>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

