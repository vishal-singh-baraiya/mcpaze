import Link from "next/link"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InstallInstructions } from "@/components/install-instructions"
import { servers } from "@/lib/data"
import { McpServerCode } from "@/components/mcp-server-code"

interface InstallPageProps {
  params: {
    id: string
  }
  searchParams: {
    status?: string
  }
}

export default function InstallPage({ params, searchParams }: InstallPageProps) {
  const server = servers.find((s) => s.id === params.id) || {
    id: params.id,
    name: `${params.id} Server`,
    category: "Unknown",
    description: "",
    downloads: 0,
    rating: 0,
    reviews: 0,
    author: "Unknown",
    version: "1.0.0",
    lastUpdated: "",
    requirements: [],
    features: [],
  }

  const isInstalling = searchParams.status === "installing"

  return (
    <div className="container py-10">
      <Link
        href={`/servers/${params.id}`}
        className="inline-flex items-center gap-1 mb-6 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to server details
      </Link>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Install {server.name}</CardTitle>
            <CardDescription>Follow the instructions below to install and set up the MCP server</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isInstalling ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  {Math.random() > 0.5 ? (
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  ) : (
                    <Check className="h-8 w-8 text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-medium text-center">
                  {Math.random() > 0.5 ? "Installing..." : "Installation Complete!"}
                </h3>
                <p className="text-center text-muted-foreground max-w-md">
                  {Math.random() > 0.5
                    ? "Please wait while we install the MCP server. This may take a few moments."
                    : "The MCP server has been successfully installed. You can now use it with your AI assistant."}
                </p>
                {Math.random() > 0.5 ? (
                  <div className="w-full max-w-xs bg-muted rounded-full h-2.5 mt-4">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                    ></div>
                  </div>
                ) : (
                  <Link href={`/servers/${params.id}`}>
                    <Button>View Server Details</Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                <InstallInstructions serverId={params.id} />

                <div className="rounded-md border p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">MCP Server Code</h3>
                  <p className="mb-4">
                    Below is the actual code for the {server.name} MCP server. You can use this as a reference or modify
                    it to suit your needs.
                  </p>
                  <McpServerCode serverId={params.id} />
                </div>

                <div className="rounded-md border p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">After Installation</h3>
                  <p>
                    Once installed, you can use the MCP server with compatible AI assistants like Claude Desktop,
                    Cursor, or other MCP clients. The server will be automatically discovered by these applications.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Link href={`/servers/${params.id}`}>
                    <Button variant="outline">Back to Details</Button>
                  </Link>
                  <Link href="/">
                    <Button>Browse More Servers</Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

