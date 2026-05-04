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
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  // Parse and return JSON
  const data: SegmentResponse = await response.json();
  return data;
}
