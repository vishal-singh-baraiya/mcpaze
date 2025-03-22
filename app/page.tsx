"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ServerCard } from "@/components/server-card"
import { FeaturedCarousel } from "@/components/featured-carousel"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { servers } from "@/lib/data"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredServers, setFilteredServers] = useState(servers)

  // Filter servers based on search query and active category
  useEffect(() => {
    let result = servers

    if (searchQuery) {
      result = result.filter(
        (server) =>
          server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          server.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (activeCategory !== "all") {
      result = result.filter((server) => server.category.toLowerCase() === activeCategory.toLowerCase())
    }

    setFilteredServers(result)
  }, [searchQuery, activeCategory])

  // Get unique categories from servers
  const categories = ["all", ...new Set(servers.map((server) => server.category.toLowerCase()))]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">MCP Store</span>
          </Link>
          <div className="flex-1 mx-4 md:mx-8 max-w-md">
            <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search MCP servers..."
                className="w-full pl-8 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="container overflow-x-auto pb-2">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="h-9 w-full justify-start">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-6">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Featured Servers</h2>
            <FeaturedCarousel />
          </div>
        </section>

        <section className="w-full py-6">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Top Servers</h2>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {filteredServers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredServers.map((server) => (
                  <ServerCard key={server.id} server={server} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No servers found matching your search criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("all")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="w-full py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    What is Model Context Protocol?
                  </h2>
                  <p className="text-muted-foreground md:text-lg">
                    The Model Context Protocol (MCP) standardizes communication between LLMs and external tools. It
                    defines a client-server architecture, enabling AI applications to connect to specialized servers
                    that provide context and tools for interacting with external systems. [^1]
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/learn-more">
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Key Benefits</h3>
                  <ul className="grid gap-3">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>Natural language interaction with external systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>Standardized protocol for AI tool integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>Enhanced capabilities for AI assistants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>Simplified development of AI-powered applications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-10 md:flex-row md:py-8 md:items-center">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 MCP Server Store. All rights reserved.
          </p>
          <nav className="md:ml-auto flex gap-4 sm:gap-6 justify-center md:justify-end">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

