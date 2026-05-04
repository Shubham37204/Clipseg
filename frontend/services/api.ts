const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SegmentRequest {
  image_base64: string; 
  prompt: string;
  threshold: number;
}

interface SegmentResponse {
  mask_base64: string;
  prompt: string;
  overlay_base64: string;
  inference_ms: number
}

interface ImagePromptRequest {
  image_base64: string
  mask_base64: string
  threshold: number
}

interface ImagePromptResponse {
  mask_base64: string
  overlay_base64: string
  inference_ms: number
}


export async function segmentImage(
  request: SegmentRequest,
): Promise<SegmentResponse> {
  const response = await fetch(`${API_URL}/api/segment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  // Handle errors
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.detail || errorMessage;
    } catch {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Parse and return JSON
  const data: SegmentResponse = await response.json();
  return data;
}

export async function segmentByImage(
  request: ImagePromptRequest
): Promise<ImagePromptResponse> {
  const response = await fetch(`${API_URL}/api/segment-by-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  // Handle errors
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.detail || errorMessage;
    } catch {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Parse and return JSON
  const data: ImagePromptResponse = await response.json();
  return data;
}
