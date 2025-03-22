"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { servers } from "@/lib/data"
import { toast } from "@/hooks/use-toast"

interface InstallInstructionsProps {
  serverId: string
}

export function InstallInstructions({ serverId }: InstallInstructionsProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const server = servers.find((s) => s.id === serverId)
  const serverName = server?.name || serverId

  // Generate commands based on server ID
  const smitheryCommand = `npx -y @smithery/cli install ${serverId} --client claude`
  const npmCommand = `npx @mcp/${serverId}-server init $MCP_${serverId.toUpperCase()}_API_KEY`

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(id)
        toast({
          title: "Copied to clipboard",
          description: "Command has been copied to your clipboard",
        })
        setTimeout(() => setCopied(null), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard",
          variant: "destructive",
        })
      })
  }

  return (
    <Tabs defaultValue="smithery">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="smithery" className="flex-1">
          Via Smithery
        </TabsTrigger>
        <TabsTrigger value="npm" className="flex-1">
          Via npm
        </TabsTrigger>
        <TabsTrigger value="docker" className="flex-1">
          Via Docker
        </TabsTrigger>
      </TabsList>

      <TabsContent value="smithery" className="space-y-4">
        <p>Smithery provides a streamlined method for installing MCP servers. [^1]</p>

        <ol className="space-y-4">
          <li className="space-y-2">
            <p>1. Open your terminal.</p>
          </li>
          <li className="space-y-2">
            <p>2. Run the Smithery installation command:</p>
            <div className="relative">
              <pre className="rounded-md bg-muted p-4 overflow-x-auto">
                <code>{smitheryCommand}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => copyToClipboard(smitheryCommand, "smithery")}
              >
                {copied === "smithery" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy command</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Replace <code>claude</code> with the name of your MCP client application if different.
            </p>
          </li>
          <li>
            <p>3. You will be prompted to enter the required API key.</p>
          </li>
          <li>
            <p>4. Restart your MCP Client application.</p>
          </li>
        </ol>
      </TabsContent>

      <TabsContent value="npm" className="space-y-4">
        <p>You can also install the MCP server directly using npm.</p>

        <ol className="space-y-4">
          <li className="space-y-2">
            <p>1. Open your terminal.</p>
          </li>
          <li className="space-y-2">
            <p>2. Run the initialization command:</p>
            <div className="relative">
              <pre className="rounded-md bg-muted p-4 overflow-x-auto">
                <code>{npmCommand}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => copyToClipboard(npmCommand, "npm")}
              >
                {copied === "npm" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy command</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Replace <code>$MCP_{serverId.toUpperCase()}_API_KEY</code> with your actual API key.
            </p>
          </li>
          <li>
            <p>3. Restart your MCP Client application.</p>
          </li>
        </ol>
      </TabsContent>

      <TabsContent value="docker" className="space-y-4">
        <p>For containerized deployments, you can use Docker to run the MCP server.</p>

        <ol className="space-y-4">
          <li className="space-y-2">
            <p>1. Create a Docker Compose file:</p>
            <div className="relative">
              <pre className="rounded-md bg-muted p-4 overflow-x-auto">
                <code>{`version: '3'
services:
  ${serverId}-mcp:
    image: mcp/${serverId}-server:latest
    environment:
      - MCP_${serverId.toUpperCase()}_API_KEY=your_api_key_here
    ports:
      - "3000:3000"
    restart: unless-stopped`}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() =>
                  copyToClipboard(
                    `version: '3'
services:
  ${serverId}-mcp:
    image: mcp/${serverId}-server:latest
    environment:
      - MCP_${serverId.toUpperCase()}_API_KEY=your_api_key_here
    ports:
      - "3000:3000"
    restart: unless-stopped`,
                    "docker",
                  )
                }
              >
                {copied === "docker" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy command</span>
              </Button>
            </div>
          </li>
          <li className="space-y-2">
            <p>2. Run the container:</p>
            <div className="relative">
              <pre className="rounded-md bg-muted p-4 overflow-x-auto">
                <code>docker-compose up -d</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => copyToClipboard("docker-compose up -d", "docker-run")}
              >
                {copied === "docker-run" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy command</span>
              </Button>
            </div>
          </li>
          <li>
            <p>
              3. Configure your MCP client to connect to the server at <code>http://localhost:3000</code>.
            </p>
          </li>
        </ol>
      </TabsContent>
    </Tabs>
  )
}

