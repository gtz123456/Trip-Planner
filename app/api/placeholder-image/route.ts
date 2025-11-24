import { NextRequest, NextResponse } from "next/server";

// Generate a beautiful SVG placeholder based on destination category
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get("category") || "Attraction";
  const name = searchParams.get("name") || "Destination";

  // Color schemes based on category
  const colorSchemes: Record<string, { gradient: [string, string]; icon: string }> = {
    Museum: { gradient: ["#667eea", "#764ba2"], icon: "🏛️" },
    Restaurant: { gradient: ["#f093fb", "#f5576c"], icon: "🍽️" },
    Park: { gradient: ["#4facfe", "#00f2fe"], icon: "🌳" },
    Attraction: { gradient: ["#43e97b", "#38f9d7"], icon: "🎭" },
    Hotel: { gradient: ["#fa709a", "#fee140"], icon: "🏨" },
    Beach: { gradient: ["#30cfd0", "#330867"], icon: "🏖️" },
    Mountain: { gradient: ["#a8edea", "#fed6e3"], icon: "⛰️" },
    Temple: { gradient: ["#ff9a9e", "#fecfef"], icon: "⛩️" },
    Church: { gradient: ["#ffecd2", "#fcb69f"], icon: "⛪" },
  };

  const scheme = colorSchemes[category] || colorSchemes.Attraction;
  const [color1, color2] = scheme.gradient;
  const emoji = scheme.icon;

  // Generate SVG
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background gradient -->
      <rect width="800" height="600" fill="url(#grad)"/>
      
      <!-- Decorative circles -->
      <circle cx="150" cy="100" r="80" fill="white" opacity="0.1"/>
      <circle cx="700" cy="500" r="120" fill="white" opacity="0.1"/>
      <circle cx="650" cy="150" r="60" fill="white" opacity="0.15"/>
      
      <!-- Icon circle background -->
      <circle cx="400" cy="250" r="100" fill="white" opacity="0.2" filter="url(#shadow)"/>
      
      <!-- Icon (emoji) -->
      <text x="400" y="290" font-size="80" text-anchor="middle" opacity="0.9">${emoji}</text>
      
      <!-- Category label -->
      <text x="400" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600" fill="white" text-anchor="middle" opacity="0.95">${category}</text>
      
      <!-- Destination name -->
      <text x="400" y="420" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.8">${name.length > 40 ? name.substring(0, 40) + '...' : name}</text>
      
      <!-- Subtle pattern overlay -->
      <rect width="800" height="600" fill="url(#pattern)" opacity="0.05"/>
      <defs>
        <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill="white"/>
          <circle cx="30" cy="30" r="2" fill="white"/>
        </pattern>
      </defs>
    </svg>
  `;

  return new Response(svg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
