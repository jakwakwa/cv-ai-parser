# Appendix A – Performance Strategy Details for CV AI Parser

This appendix expands on **Section 4.2 – Performance Considerations** of the main architecture document, providing concrete tactics and code-level guidance for implementing each optimisation inside a Next.js 13/14 application.

---

## 1. Parallel Calls

| Aspect | Details |
|--------|---------|
| **Why** | Resume parsing and Job-Spec extraction are independent LLM calls. Issuing them serially doubles latency and cost of idle compute. |
| **How** | Use native `Promise.all()` (or `p-map` for concurrency control) so the two `generateObject()` invocations reach Gemini concurrently. |
| **Implementation Sketch** |
| | ```ts
| | // app/api/parse-resume-enhanced/route.ts (Edge or Node)
| | const [resumeJson, jobSpecJson] = await Promise.all([
| |   parseResumeWithAI(resumeContent),
| |   jobSpecExtractor(jobSpecContent),
| | ]);
| | ``` |
| **Concurrency Limits** | Gemini quotas may cap concurrent requests (e.g. 10 QPS). Wrap calls with `p-limit` so bursts stay within threshold:  |
| | ```ts
| | import pLimit from "p-limit";
| | const limit = pLimit(5); // configurable
| | const resumePromise = limit(() => parseResumeWithAI(resumeContent));
| | ``` |
| **Edge vs. Node Runtimes** | If deployed to **Edge** (V8 isolates), parallel awaits are fine. For **Node** functions you also avoid blocking the event-loop because the SDK is network-bound. |

---

## 2. Streaming Responses

| Aspect | Details |
|--------|---------|
| **Why** | Tailoring can take several seconds. Streaming lets users see progress sooner and keeps the UI responsive. |
| **LLM Streaming** | `@ai-sdk/google` supports token streaming. Pass `{ stream: true }` (or equivalent) and consume an async iterator of tokens/JSON chunks. |
| **Server Implementation** | Leverage **Next.js**’s native streaming: return a `Response` constructed from a `TransformStream` or `ReadableStream`.
| | ```ts
| | const { readable, writable } = new TransformStream();
| | streamToW(LLMStream, writable); // helper that pumps tokens
| | return new Response(readable, { headers: { "Content-Type": "text/event-stream" } });
| | ``` |
| **Client Side** | Use `fetch()` with `EventSource`/SSE or `ReadableStream` readers in React. Update UI incrementally (e.g. append bullet points as they arrive). |
| **Back-pressure & Abort** | Honour the `AbortSignal` from `request.signal` in Next.js route to cancel upstream LLM call if client disconnects. |

---

## 3. Caching & Deduplication

| Aspect | Details |
|--------|---------|
| **Why** | Users may upload identical resumes or job specs across multiple tailoring attempts, or hit *Back → Forward* flows. Caching saves cost and lowers latency. |
| **Cache Key** | `sha256(resumeContent) + sha256(jobSpecContent) + tone + extraPrompt` ensures functional uniqueness. |
| **Where to Cache** | • **Short-term (seconds–minutes):** In-memory LRU (`quick-lru`) inside each Node pod/Edge isolate.  
• **Long-term:** Redis/Memcached (vercel KV, upstash) keyed by hashed input.  
• **Persistent historical:** Supabase `resume_versions` (already present) can act as cold cache. |
| **Cache Strategy** | ```ts
| | const cached = await kv.get(cacheKey);
| | if (cached) return cached;
| | const tailored = await tailorResume(...);
| | kv.set(cacheKey, tailored, { ex: 3600 });
| | ``` |
| **LLM Cost Guardrail** | Wrap calls behind a `cacheFirst()` utility so missed keys are the only ones billed. Use queue metrics to monitor hit-ratio. |
| **Hash Generation** | Use streaming digests for large PDFs to avoid memory spikes. |
| **Invalidation** | Version the cache key (`v2::`) when prompt templates or schemas evolve. |

---

## 4. Additional Notes

1. **Observability** – Instrument spans with OpenTelemetry; tag each LLM call with cache-status and latency.  
2. **Graceful Degradation** – If streaming isn’t supported by a browser, fall back to polling `/status/:id`.  
3. **Autoscaling** – Maintain stateless API routes; rely on platform autoscaling (Vercel/Render) to handle concurrency surges caused by parallel calls.

---

### Summary
These strategies collectively keep perceived latency low, cloud spend predictable, and user experience smooth. The techniques align with Next.js best-practices—Edge compatibility, streaming primitives, and stateless functions—ensuring our CV AI Parser scales efficiently.