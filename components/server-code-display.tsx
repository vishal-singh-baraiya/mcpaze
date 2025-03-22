"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

interface ServerCodeDisplayProps {
  serverCode: {
    main: string
    package: string
    client: string
    types?: string
  }
}

export function ServerCodeDisplay({ serverCode }: ServerCodeDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(id)
        toast({
          title: "Copied to clipboard",
          description: "Code has been copied to your clipboard",
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
    <Tabs defaultValue="main">
      <TabsList className="mb-2">
        <TabsTrigger value="main">index.js</TabsTrigger>
        <TabsTrigger value="package">package.json</TabsTrigger>
        <TabsTrigger value="client">client.js</TabsTrigger>
        {serverCode.types && <TabsTrigger value="types">types.ts</TabsTrigger>}
      </TabsList>

      <TabsContent value="main">
        <div className="relative">
          <pre className="rounded-md bg-muted p-4 overflow-x-auto max-h-[600px]">
            <code className="text-xs">{serverCode.main}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => copyToClipboard(serverCode.main, "main")}
          >
            {copied === "main" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This is the main MCP server implementation. Save this as <code>index.js</code> and run it with Node.js.
        </p>
      </TabsContent>

      <TabsContent value="package">
        <div className="relative">
          <pre className="rounded-md bg-muted p-4 overflow-x-auto max-h-[600px]">
            <code className="text-xs">{serverCode.package}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => copyToClipboard(serverCode.package, "package")}
          >
            {copied === "package" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This is the package.json file for the MCP server. It defines the dependencies and scripts needed to run the
          server.
        </p>
      </TabsContent>

      <TabsContent value="client">
        <div className="relative">
          <pre className="rounded-md bg-muted p-4 overflow-x-auto max-h-[600px]">
            <code className="text-xs">{serverCode.client}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => copyToClipboard(serverCode.client, "client")}
          >
            {copied === "client" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This is a client example that shows how to connect to the MCP server and use it with an LLM. Save this as{" "}
          <code>client.js</code>.
        </p>
      </TabsContent>

      {serverCode.types && (
        <TabsContent value="types">
          <div className="relative">
            <pre className="rounded-md bg-muted p-4 overflow-x-auto max-h-[600px]">
              <code className="text-xs">{serverCode.types}</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => copyToClipboard(serverCode.types, "types")}
            >
              {copied === "types" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy code</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            TypeScript type definitions for the MCP server. Save this as <code>types.ts</code> if you're using
            TypeScript.
          </p>
        </TabsContent>
      )}

      <div className="mt-6 p-4 bg-muted/50 rounded-md border">
        <h3 className="font-medium mb-2">Installation Instructions</h3>
        <ol className="space-y-2 text-sm">
          <li>1. Create a new directory for your MCP server</li>
          <li>2. Save the code above into the appropriate files</li>
          <li>
            3. Run <code>npm install</code> to install dependencies
          </li>
          <li>4. Set up any required environment variables (e.g., API keys)</li>
          <li>
            5. Start the server with <code>npm start</code>
          </li>
        </ol>
      </div>
    </Tabs>
  )
}

