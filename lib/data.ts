import type { ServerType } from "./types"

export const servers: ServerType[] = [
  {
    id: "weather-mcp",
    name: "Weather Service",
    description: "Get real-time weather data and forecasts for any location with natural language queries.",
    longDescription:
      "The Weather MCP Server provides access to real-time weather data and forecasts through natural language. Ask about current conditions, forecasts, or historical weather data for any location worldwide. The server connects to multiple weather APIs to provide comprehensive and accurate information.",
    category: "Utilities",
    downloads: 12487,
    rating: 4.7,
    reviews: 342,
    author: "Climate Data Inc.",
    version: "2.1.0",
    lastUpdated: "2025-03-10",
    requirements: ["API Key (free tier available)", "Node.js >= v18.0.0"],
    features: [
      "Current weather conditions for any location",
      "7-day weather forecasts",
      "Historical weather data",
      "Natural language query processing",
      "Support for multiple weather data providers",
    ],
    image: "/placeholder.svg?height=400&width=600&text=Weather+MCP",
    featured: true,
    serverCode: {
      main: `
import { createServer } from 'http';
import { experimental_createMCPServer } from 'ai/mcp-server';
import { z } from 'zod';
import fetch from 'node-fetch';

// Define the MCP server
const server = experimental_createMCPServer({
  id: 'weather-mcp',
  name: 'Weather MCP Server',
  version: '2.1.0',
  description: 'MCP server for weather data and forecasts',
  
  // Define the tools this MCP server provides
  tools: {
    // Get current weather conditions
    getCurrentWeather: {
      description: 'Get current weather conditions for a location',
      parameters: z.object({
        location: z.string().describe('The location to get weather for (city, address, etc.)'),
        units: z.enum(['metric', 'imperial']).default('metric').describe('Units for temperature and wind speed'),
      }),
      execute: async ({ location, units }) => {
        console.log(\`Getting current weather for \${location} in \${units} units\`);
        
        // In a real implementation, this would call a weather API
        // For example, using OpenWeatherMap, WeatherAPI, etc.
        try {
          const apiKey = process.env.WEATHER_API_KEY;
          if (!apiKey) {
            throw new Error('WEATHER_API_KEY environment variable is not set');
          }
          
          const response = await fetch(
            \`https://api.weatherapi.com/v1/current.json?key=\${apiKey}&q=\${encodeURIComponent(location)}\`
          );
          
          if (!response.ok) {
            throw new Error(\`Weather API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          // Convert units if needed
          const temp = units === 'imperial' 
            ? data.current.temp_f 
            : data.current.temp_c;
          
          const windSpeed = units === 'imperial'
            ? data.current.wind_mph
            : data.current.wind_kph;
          
          const windSpeedUnit = units === 'imperial' ? 'mph' : 'kph';
          const tempUnit = units === 'imperial' ? '°F' : '°C';
          
          return {
            location: data.location.name,
            region: data.location.region,
            country: data.location.country,
            temperature: \`\${temp}\${tempUnit}\`,
            condition: data.current.condition.text,
            humidity: \`\${data.current.humidity}%\`,
            windSpeed: \`\${windSpeed} \${windSpeedUnit}\`,
            windDirection: data.current.wind_dir,
            precipitation: \`\${data.current.precip_mm} mm\`,
            cloudCover: \`\${data.current.cloud}%\`,
            isDay: data.current.is_day === 1,
            lastUpdated: data.current.last_updated,
          };
        } catch (error) {
          console.error('Error fetching weather data:', error);
          
          // Return mock data for demonstration
          return {
            location: location,
            region: 'Demo Region',
            country: 'Demo Country',
            temperature: units === 'imperial' ? '72°F' : '22°C',
            condition: 'Partly cloudy',
            humidity: '65%',
            windSpeed: units === 'imperial' ? '5 mph' : '8 kph',
            windDirection: 'NW',
            precipitation: '0 mm',
            cloudCover: '30%',
            isDay: true,
            lastUpdated: new Date().toISOString(),
          };
        }
      },
    },
    
    // Get weather forecast
    getForecast: {
      description: 'Get weather forecast for a location',
      parameters: z.object({
        location: z.string().describe('The location to get forecast for'),
        days: z.number().min(1).max(10).default(5).describe('Number of days to forecast'),
        units: z.enum(['metric', 'imperial']).default('metric').describe('Units for temperature and wind speed'),
      }),
      execute: async ({ location, days, units }) => {
        console.log(\`Getting \${days}-day forecast for \${location} in \${units} units\`);
        
        // In a real implementation, this would call a weather API
        try {
          const apiKey = process.env.WEATHER_API_KEY;
          if (!apiKey) {
            throw new Error('WEATHER_API_KEY environment variable is not set');
          }
          
          const response = await fetch(
            \`https://api.weatherapi.com/v1/forecast.json?key=\${apiKey}&q=\${encodeURIComponent(location)}&days=\${days}\`
          );
          
          if (!response.ok) {
            throw new Error(\`Weather API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          // Process forecast data
          const forecast = data.forecast.forecastday.map(day => {
            const maxTemp = units === 'imperial' ? day.day.maxtemp_f : day.day.maxtemp_c;
            const minTemp = units === 'imperial' ? day.day.mintemp_f : day.day.mintemp_c;
            const tempUnit = units === 'imperial' ? '°F' : '°C';
            
            return {
              date: day.date,
              maxTemp: \`\${maxTemp}\${tempUnit}\`,
              minTemp: \`\${minTemp}\${tempUnit}\`,
              condition: day.day.condition.text,
              chanceOfRain: \`\${day.day.daily_chance_of_rain}%\`,
              sunrise: day.astro.sunrise,
              sunset: day.astro.sunset,
            };
          });
          
          return {
            location: data.location.name,
            region: data.location.region,
            country: data.location.country,
            forecast: forecast,
          };
        } catch (error) {
          console.error('Error fetching forecast data:', error);
          
          // Return mock data for demonstration
          const forecast = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            return {
              date: date.toISOString().split('T')[0],
              maxTemp: units === 'imperial' ? '75°F' : '24°C',
              minTemp: units === 'imperial' ? '60°F' : '15°C',
              condition: i % 2 === 0 ? 'Sunny' : 'Partly cloudy',
              chanceOfRain: \`\${i * 10}%\`,
              sunrise: '06:30 AM',
              sunset: '08:15 PM',
            };
          });
          
          return {
            location: location,
            region: 'Demo Region',
            country: 'Demo Country',
            forecast: forecast,
          };
        }
      },
    },
    
    // Get historical weather data
    getHistoricalWeather: {
      description: 'Get historical weather data for a location',
      parameters: z.object({
        location: z.string().describe('The location to get historical weather for'),
        date: z.string().describe('The date in YYYY-MM-DD format'),
        units: z.enum(['metric', 'imperial']).default('metric').describe('Units for temperature and wind speed'),
      }),
      execute: async ({ location, date, units }) => {
        console.log(\`Getting historical weather for \${location} on \${date} in \${units} units\`);
        
        // In a real implementation, this would call a weather API
        try {
          const apiKey = process.env.WEATHER_API_KEY;
          if (!apiKey) {
            throw new Error('WEATHER_API_KEY environment variable is not set');
          }
          
          const response = await fetch(
            \`https://api.weatherapi.com/v1/history.json?key=\${apiKey}&q=\${encodeURIComponent(location)}&dt=\${date}\`
          );
          
          if (!response.ok) {
            throw new Error(\`Weather API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          // Process historical data
          const day = data.forecast.forecastday[0].day;
          const maxTemp = units === 'imperial' ? day.maxtemp_f : day.maxtemp_c;
          const minTemp = units === 'imperial' ? day.mintemp_f : day.mintemp_c;
          const avgTemp = units === 'imperial' ? day.avgtemp_f : day.avgtemp_c;
          const tempUnit = units === 'imperial' ? '°F' : '°C';

          return {
            location: data.location.name,
            region: data.location.region,
            country: data.location.country,
            date: date,
            maxTemp: \`\${maxTemp}\${tempUnit}\`,
            minTemp: \`\${minTemp}\${tempUnit}\`,
            avgTemp: \`\${avgTemp}\${tempUnit}\`,
            condition: day.condition.text,
            totalPrecipitation: \`\${day.totalpreccip_mm} mm\`,
            avgHumidity: \`\${day.avghumidity}%\`,
            maxWind: \`\${units === 'imperial' ? day.maxwind_mph + ' mph' : day.maxwind_kph + ' kph'}\`,
          };
        } catch (error) {
          console.error('Error fetching historical weather data:', error);

          // Return mock data for demonstration
          return {
            location: location,
            region: 'Demo Region',
            country: 'Demo Country',
            date: date,
            maxTemp: units === 'imperial' ? '78°F' : '26°C',
            minTemp: units === 'imperial' ? '62°F' : '17°C',
            avgTemp: units === 'imperial' ? '70°F' : '21°C',
            condition: 'Sunny',
            totalPrecipitation: '0 mm',
            avgHumidity: '60%',
            maxWind: units === 'imperial' ? '12 mph' : '19 kph',
          };
        }
      },
    },
  },
});

// Create an HTTP server to host the MCP server
const httpServer = createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Weather MCP Server is running');
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
  console.log(\`Weather MCP Server running on port\`);
});
      `,
      package: `{
  "name": "weather-mcp-server",
  "version": "2.1.0",
  "description": "MCP server for weather data and forecasts",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "ai": "^2.2.12",
    "node-fetch": "^3.3.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`,
      client: `
import { experimental_createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport } from 'ai/mcp-stdio';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

async function main() {
  try {
    // Create an MCP client that connects to our server
    const mcpClient = await experimental_createMCPClient({
      transport: new Experimental_StdioMCPTransport({
        command: 'node',
        args: ['index.js'],
      }),
    });
    
    // Get the tools from the MCP server
    const tools = await mcpClient.tools();
    
    // Use the tools with an LLM
    const response = await generateText({
      model: openai('gpt-4o'),
      tools,
      messages: [
        { role: 'user', content: 'What\'s the weather like in New York today?' }
      ],
    });
    
    console.log('Response:', response.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
      `,
    },
  },
  {
    id: "neon-mcp",
    name: "Neon Database",
    description: "Manage your Neon Postgres databases using natural language commands with the Neon MCP Server.",
    longDescription:
      "The Neon MCP Server is an open-source tool that lets you interact with your Neon Postgres databases in natural language. Create databases, manage projects, run queries, and perform migrations with simple conversational commands.",
    category: "Database",
    downloads: 5432,
    rating: 4.9,
    reviews: 187,
    author: "Neon",
    version: "1.2.0",
    lastUpdated: "2025-03-15",
    requirements: ["Neon API Key", "Node.js >= v18.0.0"],
    features: [
      "Natural language interaction with Neon databases",
      "Project management through conversational commands",
      "Branch management for database versioning",
      "SQL query execution via natural language",
      "Database migration support",
    ],
    image: "/placeholder.svg?height=400&width=600&text=Neon+MCP",
    featured: true,
    serverCode: {
      main: `
import { createServer } from 'http';
import { experimental_createMCPServer } from 'ai/mcp-server';
import { z } from 'zod';
import fetch from 'node-fetch';

// Define the MCP server
const server = experimental_createMCPServer({
  id: 'neon-mcp',
  name: 'Neon Database MCP Server',
  version: '1.2.0',
  description: 'MCP server for Neon Postgres databases',
  
  // Define the tools this MCP server provides
  tools: {
    // List Neon projects
    listProjects: {
      description: 'List all Neon projects',
      parameters: z.object({}),
      execute: async () => {
        console.log('Listing Neon projects');
        
        try {
          const apiKey = process.env.NEON_API_KEY;
          if (!apiKey) {
            throw new Error('NEON_API_KEY environment variable is not set');
          }
          
          const response = await fetch('https://console.neon.tech/api/v2/projects', {
            headers: {
              'Accept': 'application/json',
              'Authorization': \`Bearer \${apiKey}\`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(\`Neon API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          return {
            projects: data.projects.map(project => ({
              id: project.id,
              name: project.name,
              regionId: project.region_id,
              createdAt: project.created_at,
              updatedAt: project.updated_at,
              branchCount: project.branch_count,
              databaseCount: project.database_count,
              computeTime: project.compute_time,
              activeTime: project.active_time,
              storageSize: project.storage_size,
            }))
          };
        } catch (error) {
          console.error('Error fetching Neon projects:', error);
          
          // Return mock data for demonstration
          return {
            projects: [
              {
                id: 'project1',
                name: 'Demo Project 1',
                regionId: 'aws-us-east-2',
                createdAt: '2025-01-15T12:00:00Z',
                updatedAt: '2025-03-10T09:30:00Z',
                branchCount: 3,
                databaseCount: 2,
                computeTime: 120,
                activeTime: 80,
                storageSize: 25600,
              },
              {
                id: 'project2',
                name: 'Demo Project 2',
                regionId: 'aws-eu-west-1',
                createdAt: '2025-02-20T15:45:00Z',
                updatedAt: '2025-03-12T14:20:00Z',
                branchCount: 1,
                databaseCount: 1,
                computeTime: 45,
                activeTime: 30,
                storageSize: 10240,
              }
            ]
          };
        }
      },
    },
    
    // Create a new Neon project
    createProject: {
      description: 'Create a new Neon project',
      parameters: z.object({
        name: z.string().describe('Name of the project'),
        regionId: z.string().default('aws-us-east-2').describe('Region ID for the project'),
      }),
      execute: async ({ name, regionId }) => {
        console.log(\`Creating Neon project: \${name} in region \${regionId}\`);
        
        try {
          const apiKey = process.env.NEON_API_KEY;
          if (!apiKey) {
            throw new Error('NEON_API_KEY environment variable is not set');
          }
          
          const response = await fetch('https://console.neon.tech/api/v2/projects', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': \`Bearer \${apiKey}\`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              project: {
                name,
                region_id: regionId,
              }
            })
          });
          
          if (!response.ok) {
            throw new Error(\`Neon API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          return {
            project: {
              id: data.project.id,
              name: data.project.name,
              regionId: data.project.region_id,
              createdAt: data.project.created_at,
              defaultBranchId: data.project.default_branch_id,
              connectionString: data.connection_uris[0].connection_uri,
            }
          };
        } catch (error) {
          console.error('Error creating Neon project:', error);
          
          // Return mock data for demonstration
          return {
            project: {
              id: \`project_\${Date.now()}\`,
              name,
              regionId,
              createdAt: new Date().toISOString(),
              defaultBranchId: 'br-default',
              connectionString: 'postgresql://user:password@demo.neon.tech/neondb',
            }
          };
        }
      },
    },
    
    // List branches in a project
    listBranches: {
      description: 'List all branches in a Neon project',
      parameters: z.object({
        projectId: z.string().describe('ID of the project'),
      }),
      execute: async ({ projectId }) => {
        console.log(\`Listing branches for project: \${projectId}\`);
        
        try {
          const apiKey = process.env.NEON_API_KEY;
          if (!apiKey) {
            throw new Error('NEON_API_KEY environment variable is not set');
          }
          
          const response = await fetch(\`https://console.neon.tech/api/v2/projects/\${projectId}/branches\`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': \`Bearer \${apiKey}\`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(\`Neon API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          return {
            branches: data.branches.map(branch => ({
              id: branch.id,
              name: branch.name,
              projectId: branch.project_id,
              parentId: branch.parent_id,
              createdAt: branch.created_at,
              updatedAt: branch.updated_at,
              active: branch.active,
              primary: branch.primary,
            }))
          };
        } catch (error) {
          console.error('Error fetching Neon branches:', error);
          
          // Return mock data for demonstration
          return {
            branches: [
              {
                id: 'br-main',
                name: 'main',
                projectId,
                parentId: null,
                createdAt: '2025-01-15T12:00:00Z',
                updatedAt: '2025-03-10T09:30:00Z',
                active: true,
                primary: true,
              },
              {
                id: 'br-dev',
                name: 'development',
                projectId,
                parentId: 'br-main',
                createdAt: '2025-02-05T14:30:00Z',
                updatedAt: '2025-03-12T11:45:00Z',
                active: true,
                primary: false,
              }
            ]
          };
        }
      },
    },
    
    // Create a new branch
    createBranch: {
      description: 'Create a new branch in a Neon project',
      parameters: z.object({
        projectId: z.string().describe('ID of the project'),
        name: z.string().describe('Name of the branch'),
        parentId: z.string().optional().describe('ID of the parent branch (optional)'),
      }),
      execute: async ({ projectId, name, parentId }) => {
        console.log(\`Creating branch: \${name} in project \${projectId}\`);
        
        try {
          const apiKey = process.env.NEON_API_KEY;
          if (!apiKey) {
            throw new Error('NEON_API_KEY environment variable is not set');
          }
          
          const body: any = {
            branch: {
              name,
            }
          };
          
          if (parentId) {
            body.branch.parent_id = parentId;
          }
          
          const response = await fetch(\`https://console.neon.tech/api/v2/projects/\${projectId}/branches\`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': \`Bearer \${apiKey}\`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
          
          if (!response.ok) {
            throw new Error(\`Neon API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          return {
            branch: {
              id: data.branch.id,
              name: data.branch.name,
              projectId: data.branch.project_id,
              parentId: data.branch.parent_id,
              createdAt: data.branch.created_at,
              connectionString: data.connection_uri,
            }
          };
        } catch (error) {
          console.error('Error creating Neon branch:', error);
          
          // Return mock data for demonstration
          return {
            branch: {
              id: \`br-\${Date.now()}\`,
              name,
              projectId,
              parentId: parentId || 'br-main',
              createdAt: new Date().toISOString(),
              connectionString: 'postgresql://user:password@demo.neon.tech/neondb',
            }
          };
        }
      },
    },
    
    // Execute SQL query
    executeQuery: {
      description: 'Execute a SQL query on a Neon database',
      parameters: z.object({
        projectId: z.string().describe('ID of the project'),
        branchId: z.string().describe('ID of the branch'),
        query: z.string().describe('SQL query to execute'),
      }),
      execute: async ({ projectId, branchId, query }) => {
        console.log(\`Executing query on project \${projectId}, branch \${branchId}: \${query}\`);
        
        try {
          const apiKey = process.env.NEON_API_KEY;
          if (!apiKey) {
            throw new Error('NEON_API_KEY environment variable is not set');
          }
          
          // In a real implementation, this would connect to the Neon database
          // and execute the query using a PostgreSQL client
          
          // For demonstration, we'll return mock results
          if (query.toLowerCase().includes('select')) {
            return {
              success: true,
              rowCount: 3,
              rows: [
                { id: 1, name: 'Item 1', created_at: '2025-01-15T12:00:00Z' },
                { id: 2, name: 'Item 2', created_at: '2025-02-20T15:45:00Z' },
                { id: 3, name: 'Item 3', created_at: '2025-03-10T09:30:00Z' },
              ],
              fields: ['id', 'name', 'created_at'],
              executionTime: '0.123s',
            };
          } else if (query.toLowerCase().includes('insert')) {
            return {
              success: true,
              rowCount: 1,
              command: 'INSERT',
              executionTime: '0.045s',
            };
          } else if (query.toLowerCase().includes('update')) {
            return {
              success: true,
              rowCount: 1,
              command: 'UPDATE',
              executionTime: '0.038s',
            };
          } else if (query.toLowerCase().includes('delete')) {
            return {
              success: true,
              rowCount: 1,
              command: 'DELETE',
              executionTime: '0.042s',
            };
          } else if (query.toLowerCase().includes('create table')) {
            return {
              success: true,
              command: 'CREATE TABLE',
              executionTime: '0.067s',
            };
          } else {
            return {
              success: true,
              command: 'UNKNOWN',
              executionTime: '0.050s',
            };
          }
        } catch (error) {
          console.error('Error executing query:', error);
          
          return {
            success: false,
            error: error.message,
          };
        }
      },
    },
  },
});

// Create an HTTP server to host the MCP server
const httpServer = createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Neon Database MCP Server is running');
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
  console.log(\`Neon Database MCP Server running on port\`);
});
      `,
      package: `{
  "name": "neon-mcp-server",
  "version": "1.2.0",
  "description": "MCP server for Neon Postgres databases",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "ai": "^2.2.12",
    "node-fetch": "^3.3.2",
    "pg": "^8.11.3",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`,
      client: `
import { experimental_createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport } from 'ai/mcp-stdio';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

async function main() {
  try {
    // Create an MCP client that connects to our server
    const mcpClient = await experimental_createMCPClient({
      transport: new Experimental_StdioMCPTransport({
        command: 'node',
        args: ['index.js'],
      }),
    });
    
    // Get the tools from the MCP server
    const tools = await mcpClient.tools();
    
    // Use the tools with an LLM
    const response = await generateText({
      model: openai('gpt-4o'),
      tools,
      messages: [
        { role: 'user', content: 'List all my Neon projects' }
      ],
    });
    
    console.log('Response:', response.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
      `,
    },
  },
  {
    id: "github-mcp",
    name: "GitHub Assistant",
    description: "Access GitHub repositories, issues, and PRs through natural language queries and commands.",
    longDescription:
      "The GitHub MCP Server provides a natural language interface to GitHub. Browse repositories, manage issues, review pull requests, and more using conversational commands. Perfect for developers who want to streamline their GitHub workflow.",
    category: "Development",
    downloads: 8765,
    rating: 4.8,
    reviews: 231,
    author: "DevTools Inc.",
    version: "3.0.1",
    lastUpdated: "2025-02-28",
    requirements: ["GitHub Personal Access Token", "Node.js >= v18.0.0"],
    features: [
      "Repository browsing and management",
      "Issue tracking and creation",
      "Pull request reviews and management",
      "Code search capabilities",
      "GitHub Actions monitoring",
    ],
    image: "/placeholder.svg?height=400&width=600&text=GitHub+MCP",
    featured: true,
    serverCode: {
      main: `
import { createServer } from 'http';
import { experimental_createMCPServer } from 'ai/mcp-server';
import { z } from 'zod';
import fetch from 'node-fetch';

// Define the MCP server
const server = experimental_createMCPServer({
  id: 'github-mcp',
  name: 'GitHub Assistant MCP Server',
  version: '3.0.1',
  description: 'MCP server for GitHub interactions',
  
  // Define the tools this MCP server provides
  tools: {
    // List repositories
    listRepositories: {
      description: 'List repositories for the authenticated user',
      parameters: z.object({
        visibility: z.enum(['all', 'public', 'private']).default('all').describe('Filter repositories by visibility'),
        sort: z.enum(['created', 'updated', 'pushed', 'full_name']).default('updated').describe('Sort repositories by'),
        direction: z.enum(['asc', 'desc']).default('desc').describe('Sort direction'),
        perPage: z.number().min(1).max(100).default(30).describe('Number of repositories per page'),
        page: z.number().min(1).default(1).describe('Page number'),
      }),
      execute: async ({ visibility, sort, direction, perPage, page }) => {
        console.log(\`Listing \${visibility} repositories, sorted by \${sort} in \${direction} order\`);
        
        try {
          const token = process.env.GITHUB_TOKEN;
          if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is not set');
          }
          
          const response = await fetch(
            \`https://api.github.com/user/repos?visibility=\${visibility}&sort=\${sort}&direction=\${direction}&per_page=\${perPage}&page=\${page}\`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': \`token \${token}\`,
                'User-Agent': 'GitHub-MCP-Server/3.0.1'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error(\`GitHub API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          return {
            repositories: data.map(repo => ({
              id: repo.id,
              name: repo.name,
              fullName: repo.full_name,
              private: repo.private,
              description: repo.description,
              url: repo.html_url,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              createdAt: repo.created_at,
              updatedAt: repo.updated_at,
              pushedAt: repo.pushed_at,
            }))
          };
        } catch (error) {
          console.error('Error fetching GitHub repositories:', error);
          
          // Return mock data for demonstration
          return {
            repositories: [
              {
                id: 123456789,
                name: 'project-one',
                fullName: 'username/project-one',
                private: false,
                description: 'A sample project repository',
                url: 'https://github.com/username/project-one',
                stars: 42,
                forks: 12,
                language: 'TypeScript',
                createdAt: '2024-01-15T12:00:00Z',
                updatedAt: '2025-03-10T09:30:00Z',
                pushedAt: '2025-03-10T09:30:00Z',
              },
              {
                id: 987654321,
                name: 'awesome-lib',
                fullName: 'username/awesome-lib',
                private: false,
                description: 'An awesome library for doing cool things',
                url: 'https://github.com/username/awesome-lib',
                stars: 128,
                forks: 34,
                language: 'JavaScript',
                createdAt: '2023-08-20T15:45:00Z',
                updatedAt: '2025-02-28T14:20:00Z',
                pushedAt: '2025-02-28T14:20:00Z',
              }
            ]
          };
        }
      },
    },
    
    // Get repository details
    getRepository: {
      description: 'Get details for a specific repository',
      parameters: z.object({
        owner: z.string().describe('Repository owner (username or organization)'),
        repo: z.string().describe('Repository name'),
      }),
      execute: async ({ owner, repo }) => {
        console.log(\`Getting details for repository: \${owner}/\${repo}\`);
        
        try {
          const token = process.env.GITHUB_TOKEN;
          if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is not set');
          }
          
          const response = await fetch(
            \`https://api.github.com/repos/\${owner}/\${repo}\`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': \`token \${token}\`,
                'User-Agent': 'GitHub-MCP-Server/3.0.1'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error(\`GitHub API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          return {
            id: data.id,
            name: data.name,
            fullName: data.full_name,
            private: data.private,
            description: data.description,
            url: data.html_url,
            stars: data.stargazers_count,
            forks: data.forks_count,
            watchers: data.watchers_count,
            issues: data.open_issues_count,
            defaultBranch: data.default_branch,
            language: data.language,
            topics: data.topics,
            license: data.license?.name,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            pushedAt: data.pushed_at,
          };
        } catch (error) {
          console.error('Error fetching GitHub repository details:', error);
          
          // Return mock data for demonstration
          return {
            id: 123456789,
            name: repo,
            fullName: \`\${owner}/\${repo}\`,
            private: false,
            description: 'A sample repository',
            url: \`https://github.com/\${owner}/\${repo}\`,
            stars: 42,
            forks: 12,
            watchers: 15,
            issues: 5,
            defaultBranch: 'main',
            language: 'TypeScript',
            topics: ['web', 'api', 'typescript'],
            license: 'MIT License',
            createdAt: '2024-01-15T12:00:00Z',
            updatedAt: '2025-03-10T09:30:00Z',
            pushedAt: '2025-03-10T09:30:00Z',
          };
        }
      },
    },
    
    // List issues
    listIssues: {
      description: 'List issues for a repository',
      parameters: z.object({
        owner: z.string().describe('Repository owner (username or organization)'),
        repo: z.string().describe('Repository name'),
        state: z.enum(['open', 'closed', 'all']).default('open').describe('Filter issues by state'),
        sort: z.enum(['created', 'updated', 'comments']).default('created').describe('Sort issues by'),
        direction: z.enum(['asc', 'desc']).default('desc').describe('Sort direction'),
        perPage: z.number().min(1).max(100).default(30).describe('Number of issues per page'),
        page: z.number().min(1).default(1).describe('Page number'),
      }),
      execute: async ({ owner, repo, state, sort, direction, perPage, page }) => {
        console.log(\`Listing \${state} issues for \${owner}/\${repo}, sorted by \${sort} in \${direction} order\`);
        
        try {
          const token = process.env.GITHUB_TOKEN;
          if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is not set');
          }
          
          const response = await fetch(
            \`https://api.github.com/repos/\${owner}/\${repo}/issues?state=\${state}&sort=\${sort}&direction=\${direction}&per_page=\${perPage}&page=\${page}\`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': \`token \${token}\`,
                'User-Agent': 'GitHub-MCP-Server/3.0.1'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error(\`GitHub API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          return {
            issues: data
              .filter(item => !item.pull_request) // Filter out PRs
              .map(issue => ({
                id: issue.id,
                number: issue.number,
                title: issue.title,
                state: issue.state,
                user: {
                  login: issue.user.login,
                  avatarUrl: issue.user.avatar_url,
                },
                body: issue.body,
                labels: issue.labels.map(label => ({
                  name: label.name,
                  color: label.color,
                })),
                assignees: issue.assignees?.map(assignee => assignee.login) || [],
                comments: issue.comments,
                createdAt: issue.created_at,
                updatedAt: issue.updated_at,
                closedAt: issue.closed_at,
                url: issue.html_url,
              }))
          };
        } catch (error) {
          console.error('Error fetching GitHub issues:', error);
          
          // Return mock data for demonstration
          return {
            issues: [
              {
                id: 1234567890,
                number: 42,
                title: 'Fix bug in authentication flow',
                state: 'open',
                user: {
                  login: 'username',
                  avatarUrl: 'https://github.com/username.png',
                },
                body: 'There is a bug in the authentication flow that needs to be fixed.',
                labels: [
                  { name: 'bug', color: 'd73a4a' },
                  { name: 'priority: high', color: 'b60205' },
                ],
                assignees: ['username'],
                comments: 3,
                createdAt: '2025-03-01T10:00:00Z',
                updatedAt: '2025-03-10T15:30:00Z',
                closedAt: null,
                url: \`https://github.com/\${owner}/\${repo}/issues/42\`,
              },
              {
                id: 1234567891,
                number: 43,
                title: 'Add new feature for user profiles',
                state: 'open',
                user: {
                  login: 'contributor',
                  avatarUrl: 'https://github.com/contributor.png',
                },
                body: 'We should add a new feature to enhance user profiles.',
                labels: [
                  { name: 'enhancement', color: 'a2eeef' },
                  { name: 'good first issue', color: '7057ff' },
                ],
                assignees: [],
                comments: 1,
                createdAt: '2025-03-05T14:20:00Z',
                updatedAt: '2025-03-08T09:15:00Z',
                closedAt: null,
                url: \`https://github.com/\${owner}/\${repo}/issues/43\`,
              }
            ]
          };
        }
      },
    },
    
    // Create an issue
    createIssue: {
      description: 'Create a new issue in a repository',
      parameters: z.object({
        owner: z.string().describe('Repository owner (username or organization)'),
        repo: z.string().describe('Repository name'),
        title: z.string().describe('Issue title'),
        body: z.string().describe('Issue body/description'),
        labels: z.array(z.string()).optional().describe('Labels to apply to the issue'),
        assignees: z.array(z.string()).optional().describe('Users to assign to the issue'),
      }),
      execute: async ({ owner, repo, title, body, labels, assignees }) => {
        console.log(\`Creating issue in \${owner}/\${repo}: \${title}\`);
        
        try {
          const token = process.env.GITHUB_TOKEN;
          if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is not set');
          }
          
          const response = await fetch(
            \`https://api.github.com/repos/\${owner}/\${repo}/issues\`,
            {
              method: 'POST',
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': \`token \${token}\`,
                'User-Agent': 'GitHub-MCP-Server/3.0.1',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title,
                body,
                labels,
                assignees,
              })
            }
          );
          
          if (!response.ok) {
            throw new Error(\`GitHub API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          return {
            id: data.id,
            number: data.number,
            title: data.title,
            url: data.html_url,
            createdAt: data.created_at,
          };
        } catch (error) {
          console.error('Error creating GitHub issue:', error);
          
          // Return mock data for demonstration
          return {
            id: 1234567892,
            number: 44,
            title,
            url: \`https://github.com/\${owner}/\${repo}/issues/44\`,
            createdAt: new Date().toISOString(),
          };
        }
      },
    },
    
    // List pull requests
    listPullRequests: {
      description: 'List pull requests for a repository',
      parameters: z.object({
        owner: z.string().describe('Repository owner (username or organization)'),
        repo: z.string().describe('Repository name'),
        state: z.enum(['open', 'closed', 'all']).default('open').describe('Filter pull requests by state'),
        sort: z.enum(['created', 'updated', 'popularity', 'long-running']).default('created').describe('Sort pull requests by'),
        direction: z.enum(['asc', 'desc']).default('desc').describe('Sort direction'),
        perPage: z.number().min(1).max(100).default(30).describe('Number of pull requests per page'),
        page: z.number().min(1).default(1).describe('Page number'),
      }),
      execute: async ({ owner, repo, state, sort, direction, perPage, page }) => {
        console.log(\`Listing \${state} pull requests for \${owner}/\${repo}, sorted by \${sort} in \${direction} order\`);
        
        try {
          const token = process.env.GITHUB_TOKEN;
          if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is not set');
          }
          
          const response = await fetch(
            \`https://api.github.com/repos/\${owner}/\${repo}/pulls?state=\${state}&sort=\${sort}&direction=\${direction}&per_page=\${perPage}&page=\${page}\`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': \`token \${token}\`,
                'User-Agent': 'GitHub-MCP-Server/3.0.1'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error(\`GitHub API returned \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          
          return {
            pullRequests: data.map(pr => ({
              id: pr.id,
              number: pr.number,
              title: pr.title,
              state: pr.state,
              user: {
                login: pr.user.login,
                avatarUrl: pr.user.avatar_url,
              },
              body: pr.body,
              labels: pr.labels.map(label => ({
                name: label.name,
                color: label.color,
              })),
              assignees: pr.assignees?.map(assignee => assignee.login) || [],
              requestedReviewers: pr.requested_reviewers?.map(reviewer => reviewer.login) || [],
              draft: pr.draft,
              mergeable: pr.mergeable,
              merged: pr.merged,
              createdAt: pr.created_at,
              updatedAt: pr.updated_at,
              closedAt: pr.closed_at,
              mergedAt: pr.merged_at,
              url: pr.html_url,
            }))
          };
        } catch (error) {
          console.error('Error fetching GitHub pull requests:', error);
          
          // Return mock data for demonstration
          return {
            pullRequests: [
              {
                id: 9876543210,
                number: 15,
                title: 'Add new authentication provider',
                state: 'open',
                user: {
                  login: 'contributor',
                  avatarUrl: 'https://github.com/contributor.png',
                },
                body: 'This PR adds support for a new authentication provider.',
                labels: [
                  { name: 'enhancement', color: 'a2eeef' },
                ],
                assignees: ['username'],
                requestedReviewers: ['reviewer1', 'reviewer2'],
                draft: false,
                mergeable: true,
                merged: false,
                createdAt: '2025-03-05T14:20:00Z',
                updatedAt: '2025-03-08T09:15:00Z',
                closedAt: null,
                mergedAt: null,
                url: \`https://github.com/\${owner}/\${repo}/pull/15\`,
              },
              {
                id: 9876543211,
                number: 16,
                title: 'Fix styling issues in mobile view',
                state: 'open',
                user: {
                  login: 'username',
                  avatarUrl: 'https://github.com/username.png',
                },
                body: 'This PR fixes various styling issues in the mobile view.',
                labels: [
                  { name: 'bug', color: 'd73a4a' },
                  { name: 'ui', color: '0075ca' },
                ],
                assignees: ['username'],
                requestedReviewers: ['reviewer1'],
                draft: true,
                mergeable: null,
                merged: false,
                createdAt: '2025-03-08T10:30:00Z',
                updatedAt: '2025-03-10T11:45:00Z',
                closedAt: null,
                mergedAt: null,
                url: \`https://github.com/\${owner}/\${repo}/pull/16\`,
              }
            ]
          };
        }
      },
    },
  },
});

// Create an HTTP server to host the MCP server
const httpServer = createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('GitHub Assistant MCP Server is running');
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
  console.log(\`GitHub Assistant MCP Server running on port PORT\`);
});
      `,
      package: `{
  "name": "github-mcp-server",
  "version": "3.0.1",
  "description": "MCP server for GitHub interactions",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "ai": "^2.2.12",
    "node-fetch": "^3.3.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`,
      client: `
import { experimental_createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport } from 'ai/mcp-stdio';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

async function main() {
  try {
    // Create an MCP client that connects to our server
    const mcpClient = await experimental_createMCPClient({
      transport: new Experimental_StdioMCPTransport({
        command: 'node',
        args: ['index.js'],
      }),
    });
    
    // Get the tools from the MCP server
    const tools = await mcpClient.tools();
    
    // Use the tools with an LLM
    const response = await generateText({
      model: openai('gpt-4o'),
      tools,
      messages: [
        { role: 'user', content: 'Show me open issues in the vercel/ai repository' }
      ],
    });
    
    console.log('Response:', response.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
      `,
    },
  },
  {
    id: "calendar-mcp",
    name: "Calendar Manager",
    description: "Create, view, and manage calendar events with natural language commands across multiple platforms.",
    category: "Productivity",
    downloads: 4321,
    rating: 4.6,
    reviews: 156,
    author: "ProductivityTools",
    version: "2.3.0",
    lastUpdated: "2025-03-05",
    requirements: ["Google Calendar/Microsoft 365 API access", "Node.js >= v18.0.0"],
    features: [
      "Event creation and management",
      "Schedule viewing and planning",
      "Meeting scheduling assistance",
      "Multi-calendar support",
      "Timezone handling",
    ],
    image: "/placeholder.svg?height=400&width=600&text=Calendar+MCP",
  },
  {
    id: "docs-mcp",
    name: "Documentation Browser",
    description: "Search and browse documentation for popular frameworks and libraries using natural language.",
    category: "Development",
    downloads: 3567,
    rating: 4.9,
    reviews: 98,
    author: "DevDocs",
    version: "1.5.0",
    lastUpdated: "2025-03-12",
    requirements: ["Node.js >= v18.0.0"],
    features: [
      "Documentation search across multiple sources",
      "Code examples and snippets",
      "API reference browsing",
      "Framework-specific guides",
      "Offline documentation access",
    ],
    image: "/placeholder.svg?height=400&width=600&text=Docs+MCP",
  },
  {
    id: "analytics-mcp",
    name: "Analytics Viewer",
    description: "Access and visualize analytics data from various platforms using conversational queries.",
    category: "Business",
    downloads: 2876,
    rating: 4.4,
    reviews: 76,
    author: "DataViz Inc.",
    version: "2.0.0",
    lastUpdated: "2025-02-20",
    requirements: ["Google Analytics/Adobe Analytics API access", "Node.js >= v18.0.0"],
    features: [
      "Traffic and conversion metrics",
      "Custom report generation",
      "Data comparison across time periods",
      "Audience insights",
      "Campaign performance analysis",
    ],
    image: "/placeholder.svg?height=400&width=600&text=Analytics+MCP",
  },
  {
    id: "translate-mcp",
    name: "Translation Service",
    description: "Translate text between languages using natural language commands with advanced capabilities.",
    category: "Utilities",
    downloads: 6543,
    rating: 4.7,
    reviews: 189,
    author: "LingTech",
    version: "3.1.0",
    lastUpdated: "2025-03-18",
    requirements: ["Translation API key", "Node.js >= v18.0.0"],
    features: [
      "Support for 100+ languages",
      "Context-aware translations",
      "Document translation",
      "Idiom and slang handling",
      "Technical terminology support",
    ],
    image: "/placeholder.svg?height=400&width=600&text=Translate+MCP",
  },
  {
    id: "file-mcp",
    name: "File Manager",
    description: "Manage files across cloud storage platforms with natural language commands and queries.",
    category: "Productivity",
    downloads: 3987,
    rating: 4.5,
    reviews: 112,
    author: "CloudFiles Inc.",
    version: "1.8.0",
    lastUpdated: "2025-03-02",
    requirements: ["Cloud storage API access (Google Drive, Dropbox, etc.)", "Node.js >= v18.0.0"],
    features: [
      "File search and retrieval",
      "Cross-platform file operations",
      "File sharing and permissions",
      "Document preview",
      "File organization assistance",
    ],
    image: "/placeholder.svg?height=400&width=600&text=File+MCP",
  },
]

