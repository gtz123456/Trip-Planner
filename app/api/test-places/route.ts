import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const apiKey = searchParams.get("key");
  const placeName = searchParams.get("place") || "Eiffel Tower";

  if (!apiKey) {
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Google Places API</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #333; }
            input, button {
              padding: 12px;
              font-size: 16px;
              margin: 10px 5px;
              border-radius: 5px;
              border: 1px solid #ddd;
            }
            button {
              background: #4285f4;
              color: white;
              border: none;
              cursor: pointer;
            }
            button:hover {
              background: #357ae8;
            }
            .info {
              background: #e3f2fd;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            code {
              background: #f5f5f5;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Test Google Places API</h1>
            <div class="info">
              <p><strong>Instructions:</strong></p>
              <ol>
                <li>Enter your Google Maps API Key below</li>
                <li>Optionally change the place name</li>
                <li>Click "Test API" to check if it works</li>
              </ol>
            </div>
            
            <form id="testForm">
              <div>
                <input 
                  type="text" 
                  id="apiKey" 
                  placeholder="Enter your Google Maps API Key" 
                  style="width: 100%; max-width: 500px;"
                  required
                />
              </div>
              <div>
                <input 
                  type="text" 
                  id="placeName" 
                  value="Eiffel Tower" 
                  placeholder="Place name to search"
                  style="width: 100%; max-width: 500px;"
                />
              </div>
              <button type="submit">Test API</button>
            </form>

            <div id="results" style="margin-top: 30px;"></div>
          </div>

          <script>
            document.getElementById('testForm').addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const apiKey = document.getElementById('apiKey').value;
              const placeName = document.getElementById('placeName').value;
              const resultsDiv = document.getElementById('results');
              
              resultsDiv.innerHTML = '<p>🔄 Testing API...</p>';
              
              try {
                // Call our backend endpoint instead of Google API directly
                const response = await fetch('/api/test-places', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ apiKey, placeName })
                });
                
                const result = await response.json();
                
                let html = '<div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">';
                html += \`<h3>API Response Status: \${result.status}</h3>\`;
                
                if (result.status === 'REQUEST_DENIED') {
                  html += '<p style="color: red;">❌ <strong>Places API is not enabled!</strong></p>';
                  html += '<p>Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a> and enable the Places API.</p>';
                } else if (result.status === 'OK' && result.place) {
                  html += '<p style="color: green;">✅ <strong>API is working!</strong></p>';
                  html += \`<p>Found: <strong>\${result.place.name}</strong></p>\`;
                  html += \`<p>Photos available: <strong>\${result.photoCount}</strong></p>\`;
                  
                  if (result.photoUrl) {
                    html += '<h4>Sample Photo:</h4>';
                    html += \`<img src="\${result.photoUrl}" style="max-width: 100%; border-radius: 5px;" />\`;
                  }
                } else {
                  html += \`<p style="color: orange;">⚠️ Status: \${result.status}</p>\`;
                  html += \`<p>Message: \${result.message || 'No results found'}</p>\`;
                }
                
                html += \`<details style="margin-top: 20px;"><summary>Full Response</summary><pre>\${JSON.stringify(result.fullData, null, 2)}</pre></details>\`;
                html += '</div>';
                
                resultsDiv.innerHTML = html;
              } catch (error) {
                resultsDiv.innerHTML = \`<p style="color: red;">Error: \${error.message}</p>\`;
              }
            });
          </script>
        </body>
      </html>
      `,
      {
        headers: {
          "content-type": "text/html",
        },
      }
    );
  }

  return NextResponse.json({ message: "Use the form to test" });
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, placeName } = await req.json();

    if (!apiKey || !placeName) {
      return NextResponse.json(
        { status: "ERROR", message: "Missing API key or place name" },
        { status: 400 }
      );
    }

    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      placeName
    )}&inputtype=textquery&fields=place_id,name,photos&key=${apiKey}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    let result: any = {
      status: data.status,
      fullData: data,
    };

    if (data.status === "OK" && data.candidates && data.candidates.length > 0) {
      const place = data.candidates[0];
      result.place = {
        name: place.name,
        placeId: place.place_id,
      };
      result.photoCount = place.photos ? place.photos.length : 0;

      if (place.photos && place.photos.length > 0) {
        result.photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`;
      }
    } else if (data.error_message) {
      result.message = data.error_message;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { status: "ERROR", message: error.message },
      { status: 500 }
    );
  }
}
