"use node";

type ImageProvider = "runware";
type TextProvider = "openrouter";

export const AI_PROVIDERS: { image: ImageProvider; text: TextProvider } = {
  image: "runware",
  text: "openrouter",
};

export const IMAGE_MODELS = {
  fluxDev: "runware:400@1",
  fluxPro: "bfl:5@1",
};

const RUNWARE_CONFIG = {
  apiUrl: "https://api.runware.ai/v1",
  apiKeyEnv: "RUNWARE_API_KEY",
  model: IMAGE_MODELS.fluxDev,
  defaults: {
    width: 1024,
    height: 1024,
    steps: 28,
    CFGScale: 4,
    acceleration: "high" as const,
    numberResults: 1,
  },
};

const OPENROUTER_CONFIG = {
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  apiKeyEnv: "OPENROUTER_API_KEY",
  model: "google/gemini-3-flash-preview",
  temperature: 1.0,
  maxTokens: 16000,
  reasoningEffort: "low" as const,
  responseFormat: { type: "json_object" as const },
  referer: "https://storytime.app",
  title: "Storytime",
};

export type ImageGenerationOptions = {
  model?: string;
  positivePrompt: string;
  negativePrompt?: string;
  referenceImages?: string[];
  width?: number;
  height?: number;
  steps?: number;
  CFGScale?: number;
  scheduler?: string;
  acceleration?: "none" | "low" | "medium" | "high";
  numberResults?: number;
  outputFormat?: "JPG" | "PNG" | "WEBP";
};

type RunwareImageTask = {
  taskType: "imageInference";
  taskUUID: string;
  model: string;
} & ImageGenerationOptions;

type RunwareImageResponse = {
  data: Array<{
    taskType: string;
    imageUUID: string;
    taskUUID: string;
    seed?: number;
    imageURL?: string;
    imageBase64Data?: string;
    imageDataURI?: string;
  }>;
};

export type TextGenerationMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type TextGenerationOptions = {
  messages: TextGenerationMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: "low" | "medium" | "high";
  responseFormat?: { type: "json_object" };
  referer?: string;
  title?: string;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
      reasoning_content?: string;
    };
  }>;
};

export function getImageApiKey(): string | null {
  const envKey = RUNWARE_CONFIG.apiKeyEnv;
  return process.env[envKey] ?? null;
}

export function getTextApiKey(): string | null {
  const envKey = OPENROUTER_CONFIG.apiKeyEnv;
  return process.env[envKey] ?? null;
}

export async function generateImageUrl(
  apiKey: string,
  options: ImageGenerationOptions
): Promise<string> {
  if (AI_PROVIDERS.image === "runware") {
    return runwareGenerateImageUrl(apiKey, options);
  }

  throw new Error(`Unsupported image provider: ${AI_PROVIDERS.image}`);
}

export async function generateTextContent(
  apiKey: string,
  options: TextGenerationOptions
): Promise<string> {
  if (AI_PROVIDERS.text === "openrouter") {
    return openRouterChat(apiKey, options);
  }

  throw new Error(`Unsupported text provider: ${AI_PROVIDERS.text}`);
}

export function parseJsonFromContent<T>(content: string, jsonMatch?: RegExp): T {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("No content in response");
  }

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const extracted = extractJsonPayload(trimmed, jsonMatch);
    if (!extracted) {
      throw new Error("Failed to parse JSON from model response");
    }
    return JSON.parse(extracted) as T;
  }
}

function buildRunwareTask(options: ImageGenerationOptions): RunwareImageTask {
  const { model, ...restOptions } = options;

  const task: RunwareImageTask = {
    taskType: "imageInference",
    taskUUID: crypto.randomUUID(),
    model: model ?? RUNWARE_CONFIG.model,
    ...RUNWARE_CONFIG.defaults,
    ...restOptions,
  };

  if (!restOptions.referenceImages || restOptions.referenceImages.length === 0) {
    delete task.referenceImages;
  }

  return task;
}

async function runwareGenerateImageUrl(
  apiKey: string,
  options: ImageGenerationOptions
): Promise<string> {
  const task = buildRunwareTask(options);
  const response = await fetch(RUNWARE_CONFIG.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify([task]),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Runware API error: ${errorText}`);
  }

  const result = (await response.json()) as RunwareImageResponse;
  const imageUrl = result.data?.[0]?.imageURL;
  if (!imageUrl) {
    throw new Error("No image generated");
  }

  return imageUrl;
}

async function openRouterChat(
  apiKey: string,
  options: TextGenerationOptions
): Promise<string> {
  const response = await fetch(OPENROUTER_CONFIG.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": options.referer ?? OPENROUTER_CONFIG.referer,
      "X-Title": options.title ?? OPENROUTER_CONFIG.title,
    },
    body: JSON.stringify({
      model: options.model ?? OPENROUTER_CONFIG.model,
      messages: options.messages,
      response_format: options.responseFormat ?? OPENROUTER_CONFIG.responseFormat,
      temperature: options.temperature ?? OPENROUTER_CONFIG.temperature,
      max_tokens: options.maxTokens ?? OPENROUTER_CONFIG.maxTokens,
      reasoning: { effort: options.reasoningEffort ?? OPENROUTER_CONFIG.reasoningEffort },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${errorText}`);
  }

  const result = (await response.json()) as OpenRouterResponse;
  const message = result.choices?.[0]?.message;
  const content = message?.content ?? message?.reasoning_content;
  if (!content) {
    throw new Error("No content in OpenRouter response");
  }

  return content;
}

function extractJsonPayload(content: string, jsonMatch?: RegExp): string | null {
  if (jsonMatch) {
    const match = content.match(jsonMatch);
    return match ? match[0] : null;
  }

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return content.slice(start, end + 1);
}
