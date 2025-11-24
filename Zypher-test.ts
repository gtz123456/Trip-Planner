import {
  AnthropicModelProvider,
  createZypherContext,
  ZypherAgent,
} from "@corespeed/zypher";
import { eachValueFrom } from "rxjs-for-await";

Deno.env.set("HOME", Deno.cwd());

// Helper function to safely get environment variables
function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

// Initialize the agent execution context
const zypherContext = await createZypherContext(Deno.cwd());

// Create the agent with your preferred LLM provider
const agent = new ZypherAgent(
  zypherContext,
  new AnthropicModelProvider({
    apiKey: getRequiredEnv("ANTHROPIC_API_KEY"),
  }),
);

// Register and connect to an MCP server to give the agent web crawling capabilities
await agent.mcp.registerServer({
  id: "firecrawl",
  type: "command",
  command: {
    command: "npx",
    args: ["-y", "firecrawl-mcp"],
    env: {
      FIRECRAWL_API_KEY: getRequiredEnv("FIRECRAWL_API_KEY"),
    },
  },
});

// Run a task - the agent will use web crawling to find current AI news
const event$ = agent.runTask(
  `Find latest AI news`,
  "claude-3-5-haiku-20241022", // claude-3.5-haiku-20241022 or claude-sonnet-4-20250514
);

// Stream the results in real-time
for await (const event of eachValueFrom(event$)) {
  console.log(event);
}