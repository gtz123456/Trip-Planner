import {
  AnthropicModelProvider,
  createZypherContext,
  ZypherAgent,
} from "@corespeed/zypher";
import { eachValueFrom } from "rxjs-for-await";

Deno.env.set("HOME", Deno.cwd());

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface TripPlanRequest {
  userInput: string;
  apiKeys: {
    anthropic: string;
    firecrawl: string;
  };
}

// System prompt for trip planning
const TRIP_PLANNING_PROMPT = `You are an expert travel planner AI. Your task is to create detailed, personalized trip itineraries based on user requests.

When planning a trip, you must:
1. Analyze the user's preferences (location, duration, budget, interests)
2. Select appropriate destinations that match their criteria
3. Provide realistic addresses and coordinates for each destination
4. Estimate costs for activities/attractions
5. Include relevant details like operating hours, ratings, and descriptions

Return your response as a valid JSON object with this exact structure:
{
  "summary": "A brief 2-3 sentence overview of the trip",
  "duration": {
    "days": number,
    "startDate": "optional YYYY-MM-DD",
    "endDate": "optional YYYY-MM-DD"
  },
  "totalBudget": {
    "amount": number,
    "currency": "USD"
  },
  "destinations": [
    {
      "id": "unique-id",
      "name": "Destination name",
      "description": "Detailed description (2-3 sentences)",
      "address": "Full address",
      "coordinates": {
        "lat": number,
        "lng": number
      },
      "price": {
        "amount": number,
        "currency": "USD",
        "description": "What this covers"
      },
      "rating": number (1-5),
      "reviewCount": number,
      "category": "Museum|Restaurant|Park|Attraction|etc",
      "duration": "Suggested time to spend here"
    }
  ],
  "route": {
    "distance": "Total distance (e.g., '45 km')",
    "duration": "Total travel time (e.g., '2 hours')"
  }
}

Important:
- Provide REAL coordinates for actual locations
- Be specific with addresses and place names
- Ensure all JSON is valid and properly formatted
- Include 3-8 destinations depending on trip duration
- Make prices realistic for the location
- CRITICAL: Return ONLY the JSON object with NO additional text. The response must start with { and end with }`;

async function planTrip(request: TripPlanRequest): Promise<any> {
  try {
    // Initialize the agent execution context
    const zypherContext = await createZypherContext(Deno.cwd());

    // Create the agent with Anthropic model provider
    const agent = new ZypherAgent(
      zypherContext,
      new AnthropicModelProvider({
        apiKey: request.apiKeys.anthropic,
      })
    );

    // Register Firecrawl MCP server for web scraping capabilities
    await agent.mcp.registerServer({
      id: "firecrawl",
      type: "command",
      command: {
        command: "npx",
        args: ["-y", "firecrawl-mcp"],
        env: {
          FIRECRAWL_API_KEY: request.apiKeys.firecrawl,
        },
      },
    });

    // Construct the task prompt
    const taskPrompt = `${TRIP_PLANNING_PROMPT}

User Request: ${request.userInput}

Please create a detailed trip plan based on this request.`;

    // Run the task with Zypher agent
    const event$ = agent.runTask(taskPrompt, "claude-3-5-haiku-20241022");

    let finalResult = "";
    let hasError = false;

    // Stream the results and collect the final output
    for await (const event of eachValueFrom(event$)) {
      console.log("Zypher event:", event);

      // Extract content from message events
      if (event.type === "message" && event.message?.stop_reason === "end_turn") {
        // Get the text content from the message
        if (event.message.content && event.message.content[0]?.type === "text") {
          finalResult = event.message.content[0].text;
        }
      } else if (event.type === "error") {
        hasError = true;
        throw new Error(event.message || "Agent encountered an error");
      }
    }

    if (!finalResult) {
      throw new Error("No result from agent");
    }

    // Parse the JSON response
    const cleanedResponse = finalResult
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const tripPlan = JSON.parse(cleanedResponse);

    // Add unique IDs if missing
    tripPlan.id = tripPlan.id || `trip-${Date.now()}`;
    tripPlan.destinations = tripPlan.destinations.map(
      (dest: any, index: number) => ({
        ...dest,
        id: dest.id || `dest-${Date.now()}-${index}`,
      })
    );

    return {
      success: true,
      data: tripPlan,
    };
  } catch (error: any) {
    console.error("Error in trip planning:", error);
    return {
      success: false,
      error: error.message || "An error occurred while planning your trip",
    };
  }
}

// Start HTTP server
const port = 8000;

Deno.serve({ port }, async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle trip planning POST request
  if (req.method === "POST" && new URL(req.url).pathname === "/api/plan-trip") {
    try {
      const body = await req.json() as TripPlanRequest;

      if (!body.userInput || !body.apiKeys) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const result = await planTrip(body);

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || "Internal server error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  // Health check endpoint
  if (req.method === "GET" && new URL(req.url).pathname === "/health") {
    return new Response(
      JSON.stringify({ status: "ok", message: "Zypher server is running" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  return new Response("Not Found", { status: 404, headers: corsHeaders });
});

console.log(`🚀 Zypher server running on http://localhost:${port}`);
console.log(`📍 Trip planning API: http://localhost:${port}/api/plan-trip`);
console.log(`💚 Health check: http://localhost:${port}/health`);
