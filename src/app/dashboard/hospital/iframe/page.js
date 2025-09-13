// "use client";
// import { useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/store/hooks";
// import { showToast } from "@/lib/toast";

// export default function IframeGeneratorPage() {
//   const { user } = useAuth();
//   const router = useRouter();

//   // Redirect if no hospital user
//   useEffect(() => {
//     if (user?.role !== "hospital") {
//       router.push("/dashboard");
//     }
//   }, [user?.role, router]);

//   const hospitalId = user?.role_entity_id;
//   const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

//   // Customisation options
//   const [width, setWidth] = useState(340);
//   const [height, setHeight] = useState(460);
//   const [position, setPosition] = useState("bottom-right"); // bottom-right | bottom-left | top-right | top-left
//   const [primaryColor, setPrimaryColor] = useState("#2563eb");
//   const [secondaryColor, setSecondaryColor] = useState("#4f46e5");
//   const [greeting, setGreeting] = useState("How can I help you today?");

//   // Build snippet
//   const snippet = useMemo(() => {
//     if (!hospitalId) return "// Waiting for hospital ID";

//     const pos = {
//       "bottom-right": { vert: "bottom", horiz: "right" },
//       "bottom-left": { vert: "bottom", horiz: "left" },
//       "top-right": { vert: "top", horiz: "right" },
//       "top-left": { vert: "top", horiz: "left" },
//     }[position];

//     return `\n(function(){\n  if (window.__NoycoVoiceWidgetLoaded) return;\n  window.__NoycoVoiceWidgetLoaded = true;\n  var iframe = document.createElement('iframe');\n  iframe.src = '${apiBase}/voice-widget/iframe/${hospitalId}';\n  iframe.style.border = 'none';\n  iframe.style.position = 'fixed';\n  iframe.style.${pos.vert} = '20px';\n  iframe.style.${pos.horiz} = '20px';\n  iframe.style.width = '${width}px';\n  iframe.style.height = '${height}px';\n  iframe.style.zIndex = '2147483647';\n  iframe.allow = 'microphone *; autoplay *';\n  document.body.appendChild(iframe);\n})();`;
//   }, [hospitalId, apiBase, position, width, height]);

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(`<script>${snippet}</script>`);
//       showToast("Embed code copied to clipboard", "success");
//     } catch (err) {
//       showToast("Failed to copy", "error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-10">
//       <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-8">
//         <h1 className="text-3xl font-bold mb-2 text-center">Voice Widget Embed Generator</h1>
//         <p className="text-gray-600 mb-6 text-center">
//           Generate a lightweight <code>&lt;script&gt;</code> snippet to embed the Noyco Voice
//           Assistant on your website. Patients can click the microphone icon to start a secure voice
//           conversation powered by LiveKit and Gemini AI.
//         </p>

//         {/* Customisation options */}
//         <div className="grid md:grid-cols-2 gap-6 mb-8">
//           <div>
//             <label className="block text-sm font-medium mb-1">Width (px)</label>
//             <input type="number" value={width} onChange={e => setWidth(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Height (px)</label>
//             <input type="number" value={height} onChange={e => setHeight(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Position</label>
//             <select value={position} onChange={e => setPosition(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2">
//               <option value="bottom-right">Bottom Right</option>
//               <option value="bottom-left">Bottom Left</option>
//               <option value="top-right">Top Right</option>
//               <option value="top-left">Top Left</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Greeting Message</label>
//             <input type="text" value={greeting} onChange={e => setGreeting(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Primary Color</label>
//             <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
//               className="w-12 h-12 p-0 border-0" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Secondary Color</label>
//             <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
//               className="w-12 h-12 p-0 border-0" />
//           </div>
//         </div>

//         <h2 className="text-xl font-semibold mb-2">Embed Code</h2>
//         <div className="relative bg-gray-100 rounded-lg p-4 overflow-auto text-sm">
//           <pre className="whitespace-pre-wrap break-all">{`<script>${snippet}</script>`}</pre>
//           <button
//             onClick={copyToClipboard}
//             className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
//           >
//             Copy
//           </button>
//         </div>

//         <div className="mt-8 text-gray-600 text-sm space-y-2">
//           <p><strong>How it works:</strong> The script dynamically injects a secure iframe hosted by Noyco that streams audio to our voice assistant. No patient data is stored on your site.</p>
//           <p><strong>Customization:</strong> Adjust size, placement and colors. Advanced customisations (greeting, theme) will be applied soon via our API – include your preferences now for forward-compatibility.</p>
//           <p><strong>Requirements:</strong> Your plan (Lite / Pro) includes 10,000 voice minutes per month. Usage beyond this limit will be billed separately.</p>
//         </div>
//       </div>
//     </div>
//   );
// } 


























"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/hooks";
import { showToast } from "@/lib/toast";
import { getApiUrl } from "@/lib/api";

export default function IframeGeneratorPage() {
  const { user } = useAuth();
  const router = useRouter();

  // -------------------------------------------------------------------
  //  Access control → Only hospitals with an active paid plan (lite/pro)
  // -------------------------------------------------------------------
  useEffect(() => {
    // Must be hospital role
    if (user?.role !== "hospital") {
      router.push("/dashboard");
      return;
    }

    // Validate subscription plan (lite/pro)
    const verifyPlan = async () => {
      try {
        const res = await fetch(getApiUrl("/billing/plan/current"), {
          credentials: "include",
        });
        if (!res.ok) throw new Error("failed");
        const data = await res.json();

        // For hospital plans the object contains plan_type
        const planType = data?.plan_type ?? data?.current_plan;
        if (!planType || !(planType === "lite" || planType === "pro")) {
          router.push("/dashboard");
        }
      } catch {
        // Any error indicates no valid plan
        router.push("/dashboard");
      }
    };

    verifyPlan();
  }, [user?.role, router]);

  const hospitalId = user?.role_entity_id;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Customisation options
  const [width, setWidth] = useState(340);
  const [height, setHeight] = useState(460);
  const [position, setPosition] = useState("bottom-right");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [secondaryColor, setSecondaryColor] = useState("#4f46e5");
  const [greeting, setGreeting] = useState("How can I help you today?");

  // Build snippet
  const snippet = useMemo(() => {
    if (!hospitalId) return "// Waiting for hospital ID";

    const pos = {
      "bottom-right": { vert: "bottom", horiz: "right" },
      "bottom-left": { vert: "bottom", horiz: "left" },
      "top-right": { vert: "top", horiz: "right" },
      "top-left": { vert: "top", horiz: "left" },
    }[position];

    const id='Noyco-voice-widget-iframe';
    return `\n(function(){\n  var existing=document.getElementById('${id}');\n  if(existing) return;\n  var iframe=document.createElement('iframe');\n  iframe.id='${id}';\n  iframe.src = '${apiBase}/voice-widget/iframe/${hospitalId}';\n  iframe.style.border = 'none';\n  iframe.style.position = 'fixed';\n  iframe.style.${pos.vert} = '20px';\n  iframe.style.${pos.horiz} = '20px';\n  iframe.style.width = '${width}px';\n  iframe.style.height = '${height}px';\n  iframe.style.zIndex = '2147483647';\n  iframe.allow = 'microphone *; autoplay *';\n  document.body.appendChild(iframe);\n})();`;
  }, [hospitalId, apiBase, position, width, height]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`<script>${snippet}</script>`);
      showToast("Embed code copied to clipboard", "success");
    } catch (err) {
      showToast("Failed to copy", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
      {/* Header */}
      <header className="border-b border-stone-200/80 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-600/20">
                <svg className="w-6 h-6 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Voice Widget</h1>
                <p className="text-stone-600 font-medium">Embed Generator</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-emerald-50 rounded-full px-4 py-2 border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-stone-700 text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-amber-100/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-amber-200/60">
            <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="text-amber-700 text-sm font-semibold">AI-Powered Technology</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-stone-800 mb-6 leading-tight tracking-tight">
            Voice Widget
            <span className="block text-amber-700">Embed Generator</span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Generate a lightweight <code className="bg-stone-200 px-2 py-1 rounded-md text-stone-800 font-mono text-lg">&lt;script&gt;</code> snippet to embed the Noyco Voice
            Assistant on your website. Patients can click the microphone icon to start a secure voice
            conversation powered by LiveKit and Gemini AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/80 p-8 shadow-xl shadow-stone-200/40">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-10 h-10 bg-stone-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-stone-800">Configuration</h3>
              </div>

              {/* Customisation options */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">
                      Widget Width (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={e => setWidth(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">
                      Widget Height (px)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">
                      Position
                    </label>
                    <select
                      value={position}
                      onChange={e => setPosition(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 font-medium appearance-none cursor-pointer"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">
                      Greeting Message
                    </label>
                    <input
                      type="text"
                      value={greeting}
                      onChange={e => setGreeting(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 font-medium"
                    />
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-3">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="w-full h-12 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-3">
                        Secondary Color
                      </label>
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={e => setSecondaryColor(e.target.value)}
                        className="w-full h-12 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer"
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/80 p-6 shadow-xl shadow-stone-200/40 sticky top-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-800">Live Preview</h3>
              </div>
              
              <div className="bg-stone-100 rounded-xl p-4 relative overflow-hidden border border-stone-200" style={{ height: '280px' }}>
                {/* Mock browser chrome */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1 bg-white/80 rounded-md h-5 ml-4 border border-stone-200"></div>
                </div>
                
                {/* Mock website content */}
                <div className="space-y-3 mb-4">
                  <div className="h-3 bg-stone-300 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-300 rounded w-1/2"></div>
                  <div className="h-3 bg-stone-300 rounded w-2/3"></div>
                </div>
                
                {/* Widget preview */}
                <div 
                  className="absolute shadow-lg rounded-xl flex items-center justify-center transition-all duration-300 border border-white/20"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    width: `${Math.min(width * 0.12, 48)}px`,
                    height: `${Math.min(height * 0.12, 56)}px`,
                    [position.includes('bottom') ? 'bottom' : 'top']: '16px',
                    [position.includes('right') ? 'right' : 'left']: '16px'
                  }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500 font-medium">Dimensions</span>
                  <span className="text-stone-700 font-semibold">{width} × {height}px</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500 font-medium">Position</span>
                  <span className="text-stone-700 font-semibold capitalize">{position.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code Section */}
        <div className="mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/80 p-8 shadow-xl shadow-stone-200/40">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-stone-700 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-stone-800">Embed Code</h2>
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </button>
            </div>
            
            <div className="bg-stone-800 rounded-xl p-6 border border-stone-700 overflow-x-auto">
              <pre className="whitespace-pre-wrap break-all text-stone-200 leading-relaxed font-mono text-sm">
                {`<script>${snippet}</script>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/80 p-6 shadow-lg shadow-stone-200/30">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-stone-800 mb-3">How it works</h4>
            <p className="text-stone-600 leading-relaxed">
              <strong className="text-stone-700">How it works:</strong> The script dynamically injects a secure iframe hosted by Noyco that streams audio to our voice assistant. No patient data is stored on your site.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/80 p-6 shadow-lg shadow-stone-200/30">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-stone-800 mb-3">Customization</h4>
            <p className="text-stone-600 leading-relaxed">
              <strong className="text-stone-700">Customization:</strong> Adjust size, placement and colors. Advanced customisations (greeting, theme) will be applied soon via our API – include your preferences now for forward-compatibility.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/80 p-6 shadow-lg shadow-stone-200/30">
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-stone-800 mb-3">Requirements</h4>
            <p className="text-stone-600 leading-relaxed">
              <strong className="text-stone-700">Requirements:</strong> Your plan (Lite / Pro) includes 10,000 voice minutes per month. Usage beyond this limit will be billed separately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}