"use client"

import { useState } from "react"
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "@/hooks/use-toast"

interface McpServerCodeProps {
  serverId: string
}

export function McpServerCode({ serverId }: McpServerCodeProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Generate server code based on server ID
  const serverCode = `
import { createServer } from 'http';
import { experimental_createMCPServer as createMCPServer } from 'ai/mcp-server';
import { z } from 'zod';

// Define the MCP server
const server = createMCPServer({
  id: '${serverId}',
  name: '${serverId.charAt(0).toUpperCase() + serverId.slice(1)} MCP Server',
  version: '1.0.0',
  description: 'MCP server for ${serverId}',
  
  // Define the tools this MCP server provides
  tools: {
    // Example tool definition
    query${serverId.charAt(0).toUpperCase() + serverId.slice(1)}: {
      description: 'Query ${serverId} data',
      parameters: z.object({
        query: z.string().describe('The query to run'),
      }),
      execute: async ({ query }) => {
        // In a real implementation, this would connect to the actual service
        console.log(\`Executing query: \${query}\`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          result: \`Results for query: \${query}\`,
          timestamp: new Date().toISOString(),
        };
      },
    },
    
    // Another example tool
    create${serverId.charAt(0).toUpperCase() + serverId.slice(1)}Resource: {
      description: 'Create a new resource',
      parameters: z.object({
        name: z.string().describe('Name of the resource'),
        properties: z.record(z.any()).describe('Properties of the resource'),
      }),
      execute: async ({ name, properties }) => {
        console.log(\`Creating resource: \${name}\`);
        console.log('Properties:', properties);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return {
          id: \`resource_\${Date.now()}\`,
          name,
          created: true,
          timestamp: new Date().toISOString(),
        };
      },
    },
  },
});

// Create an HTTP server to host the MCP server
const httpServer = createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(\`${serverId.charAt(0).toUpperCase() + serverId.slice(1)} MCP Server is running\`);
    return;
  }
  
  // Handle MCP requests
  server.handleRequest(req, res).catch(err => {
    console.error('Error handling MCP request:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(\`${serverId.charAt(0).toUpperCase() + serverId.slice(1)} MCP Server running on port \${PORT}\`);
});
`

  const clientCode = `
import { experimental_createMCPClient as createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from 'ai/mcp-stdio';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

async function main() {
  try {
    // Create an MCP client that connects to our server
    const mcpClient = await createMCPClient({
      transport: new StdioMCPTransport({
        command: 'node',
        args: ['${serverId}-server.js'],
      }),
    });
    
    // Get the tools from the MCP server
    const tools = await mcpClient.tools();
    
    // Use the tools with an LLM
    const response = await generateText({
      model: openai('gpt-4o'),
      tools,
      messages: [
        { role: 'user', content: 'I need to query ${serverId} data for recent activity' }
      ],
    });
    
    console.log('Response:', response.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
`

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="flex items-center justify-between w-full mb-2">
          <span>View MCP Server Code</span>
          {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Tabs defaultValue="server">
          <TabsList className="mb-2">
            <TabsTrigger value="server">Server Code</TabsTrigger>
            <TabsTrigger value="client">Client Example</TabsTrigger>
          </TabsList>

          <TabsContent value="server">
            <div className="relative">
              <pre className="rounded-md bg-muted p-4 overflow-x-auto max-h-96">
                <code className="text-xs">{serverCode}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => copyToClipboard(serverCode, "server")}
              >
                {copied === "server" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy code</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This is a basic MCP server implementation using the AI SDK. [^1] Save this as{" "}
              <code>{serverId}-server.js</code> and run it with Node.js.
            </p>
          </TabsContent>

          <TabsContent value="client">
            <div className="relative">
              <pre className="rounded-md bg-muted p-4 overflow-x-auto max-h-96">
                <code className="text-xs">{clientCode}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => copyToClipboard(clientCode, "client")}
              >
                {copied === "client" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy code</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This example shows how to connect to the MCP server using the AI SDK and use its tools with an LLM. [^2]
            </p>
          </TabsContent>
        </Tabs>
      </CollapsibleContent>
    </Collapsible>
  )
}

