// type Provider = "openai" | "groq" | "gemini";

// type HelloOutput = {
//   ok: true;
//   provider: Provider;
//   model: string;
//   message: string;
// };

// /* -------------------- utils -------------------- */

// const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// /* -------------------- GEMINI -------------------- */

// type GeminiGenerateContent = {
//   candidates?: Array<{
//     content?: {
//       parts?: Array<{ text?: string }>;
//     };
//   }>;
// };

// // Free-tier safe: 1 request every ~4 seconds
// const GEMINI_MIN_DELAY = 4000;
// let lastGeminiCall = 0;

// async function helloGemini(retries = 3): Promise<HelloOutput> {
//   const apiKey = process.env.GOOGLE_API_KEY;
//   if (!apiKey) throw new Error("GOOGLE_API_KEY missing");

//   // ✅ ONLY model guaranteed on free tier
//   const model = "	gemini-3-flash-preview";

//   const url =
//     `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

 
//   const now = Date.now();
//   const wait = GEMINI_MIN_DELAY - (now - lastGeminiCall);
//   if (wait > 0) await delay(wait);
//   lastGeminiCall = Date.now();

//   const response = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [{ parts: [{ text: "Say a short hello" }] }],
//     }),
//   });

//   if (response.status === 429 && retries > 0) {
//     await delay(4000);
//     return helloGemini(retries - 1);
//   }

//   if (!response.ok) {
//     throw new Error(`Gemini ${response.status}: ${await response.text()}`);
//   }

//   const json = (await response.json()) as GeminiGenerateContent;
//   const text =
//     json.candidates?.[0]?.content?.parts?.[0]?.text ?? "Hello";

//   return {
//     ok: true,
//     provider: "gemini",
//     model,
//     message: text.trim(),
//   };
// }

// // GROQ 

// type OpenAIStyleResponse = {
//   choices?: Array<{ message?: { content?: string } }>;
// };

// async function helloGroq(): Promise<HelloOutput> {
//   const apiKey = process.env.GROQ_API_KEY;
//   if (!apiKey) throw new Error("GROQ_API_KEY missing");

//   const model = "llama-3.3-70b-versatile";
//   const url = "https://api.groq.com/openai/v1/chat/completions";

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify({
//       model,
//       messages: [{ role: "user", content: "Say a short hello rajnish" }],
//       temperature: 0,
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`Groq ${response.status}: ${await response.text()}`);
//   }

//   const json = (await response.json()) as OpenAIStyleResponse;
//   const text = json.choices?.[0]?.message?.content ?? "Hello";

//   return {
//     ok: true,
//     provider: "groq",
//     model,
//     message: text.trim(),
//   };
// }

// // OPENAI 

// async function helloOpenAI(retries = 2): Promise<HelloOutput> {
//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) throw new Error("OPENAI_API_KEY missing");

//   const model = "gpt-4o-mini";
//   const url = "https://api.openai.com/v1/chat/completions";

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify({
//       model,
//       messages: [{ role: "user", content: "Say a short hello" }],
//       temperature: 0,
//     }),
//   });

//   if (response.status === 429 && retries > 0) {
//     await delay(1500);
//     return helloOpenAI(retries - 1);
//   }

//   if (!response.ok) {
//     throw new Error(`OpenAI ${response.status}: ${await response.text()}`);
//   }

//   const json = (await response.json()) as OpenAIStyleResponse;
//   const text = json.choices?.[0]?.message?.content ?? "Hello";

//   return {
//     ok: true,
//     provider: "openai",
//     model,
//     message: text.trim(),
//   };
// }

// // PROVIDER ROUTER 

// export async function selectAndHello(): Promise<HelloOutput> {
//   const forced = (process.env.PROVIDER || "").toLowerCase();

//   if (forced === "groq") return helloGroq();
//   if (forced === "openai") return helloOpenAI();
//   if (forced === "gemini") return helloGemini();

//   if (forced) {
//     throw new Error(`Unsupported PROVIDER=${forced}`);
//   }

 
//   if (process.env.GROQ_API_KEY) {
//     try {
//       return await helloGroq();
//     } catch (e) {
//       console.error("Groq failed", e);
//     }
//   }

//   if (process.env.OPENAI_API_KEY) {
//     try {
//       return await helloOpenAI();
//     } catch (e) {
//       console.error("OpenAI failed", e);
//     }
//   }

//   if (process.env.GOOGLE_API_KEY) {
//     try {
//       return await helloGemini();
//     } catch (e) {
//       console.error("Gemini failed", e);
//     }
//   }

//   throw new Error("No provider available or all providers failed");
// }
