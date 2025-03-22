"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Search, Filter, Star, Download, Sparkles, Clock, ChevronRight, Github, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ServerCard } from "@/components/server-card"
import { FeaturedCarousel } from "@/components/featured-carousel"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { servers } from "@/lib/data"

// Define server type
interface Server {
  id: string;
  name: string;
  description: string;
  category: string;
  downloads: number;
  rating: number;
  reviews: number;
  author: string;
  version: string;
  lastUpdated: string;
  image?: string;
}

// Custom mobile-optimized ServerCard component
const MobileOptimizedServerCard = ({ server }: { server: Server }) => {
  return (
    <Link href={`/servers/${server.id}`} className="block">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:border-primary/50 transition-colors">
        <div className="relative aspect-video w-full bg-muted">
          <img
            src={server.image || `/placeholder.svg?height=200&width=400&text=${server.name}`}
            alt={server.name}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm truncate">{server.name}</h3>
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>{server.rating}</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{server.description}</p>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{server.category}</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="h-3 w-3" />
              <span>{server.downloads.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredServers, setFilteredServers] = useState<Server[]>(servers)
  const [sortOption, setSortOption] = useState("popular")
  const browseAllRef = useRef<HTMLDivElement>(null)
  
  // Prepare different server categories
  const newestServers = [...servers]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 4)
    
  const topRatedServers = [...servers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
    
  const trendingServers = [...servers]
    .sort((a, b) => (b.downloads / b.reviews) - (a.downloads / a.reviews))
    .slice(0, 4)

  // Filter and sort servers
  useEffect(() => {
    let result = [...servers]

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

    // Apply sorting
    switch (sortOption) {
      case "popular":
        result.sort((a, b) => b.downloads - a.downloads)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredServers(result)
  }, [searchQuery, activeCategory, sortOption])

  // Get unique categories from servers
  const categories = ["all", ...new Set(servers.map((server) => server.category.toLowerCase()))]

  // Handle view all actions
  const handleViewAll = (sortType: string) => {
    setSortOption(sortType)
    setActiveCategory("all")
    // Scroll to the browse all section
    if (browseAllRef.current) {
      browseAllRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold hidden sm:inline">MCPaze</span>
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
              <Button variant="outline" size="sm" className="h-8 px-3 sm:h-9 sm:px-4">
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

        <section className="w-full py-6 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Newest Servers</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center"
                onClick={() => handleViewAll("newest")}
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newestServers.map((server) => (
                <MobileOptimizedServerCard key={server.id} server={server} />
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-6">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <h2 className="text-2xl font-bold tracking-tight">Top Rated</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center"
                onClick={() => handleViewAll("rating")}
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topRatedServers.map((server) => (
                <MobileOptimizedServerCard key={server.id} server={server} />
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-6 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center"
                onClick={() => handleViewAll("popular")}
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trendingServers.map((server) => (
                <MobileOptimizedServerCard key={server.id} server={server} />
              ))}
            </div>
          </div>
        </section>

        <section ref={browseAllRef} className="w-full py-6 scroll-mt-20">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Browse All Servers</h2>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Filter className="h-4 w-4" />
                    <span className="hidden xs:inline">Sort:</span> {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuCheckboxItem
                    checked={sortOption === "popular"}
                    onCheckedChange={() => setSortOption("popular")}
                  >
                    Most Popular
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOption === "rating"}
                    onCheckedChange={() => setSortOption("rating")}
                  >
                    Top Rated
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOption === "newest"}
                    onCheckedChange={() => setSortOption("newest")}
                  >
                    Newest
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOption === "name"}
                    onCheckedChange={() => setSortOption("name")}
                  >
                    Name (A-Z)
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {filteredServers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredServers.map((server) => (
                  <MobileOptimizedServerCard key={server.id} server={server} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground mb-2">No servers found matching your search criteria.</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("all")
                    setSortOption("popular")
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
                    that provide context and tools for interacting with external systems.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="https://github.com/llm-mcp/mcp" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <Github className="h-4 w-4" />
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Key Benefits</h3>
                  <ul className="grid gap-3">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1 mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>Natural language interaction with external systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1 mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>Standardized protocol for AI tool integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1 mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>Enhanced capabilities for AI assistants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1 mt-1">
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
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm leading-loose text-muted-foreground">
              © 2025 MCPaze: MCP Server Store. All rights reserved.
            </p>
          </div>
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
