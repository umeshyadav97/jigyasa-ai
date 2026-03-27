import axios from "axios";

import { AvatarEmotion } from "../components/avatar/avatar.types";
import { getVoiceApiUrl, voiceApiConfig } from "../config/voice";

export interface VoiceApiRequest {
  audioUri: string;
  fileName?: string;
  mimeType?: string;
}

export interface VoiceApiResponse {
  transcript: string;
  replyText: string;
  audioUrl: string;
  emotion: AvatarEmotion;
}

const createMockVoiceResponse = async (
  request: VoiceApiRequest,
): Promise<VoiceApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const shortName = request.fileName ?? "voice-input.m4a";

  return {
    transcript: `Recorded from ${shortName}`,
    replyText:
      "Hi, I heard you. This is a mock voice response from the frontend flow, ready to swap with your real backend later.",
    audioUrl: voiceApiConfig.dummyAudioUrl,
    emotion: "happy",
  };
};

export const postVoiceMessage = async (
  request: VoiceApiRequest,
): Promise<VoiceApiResponse> => {
  if (voiceApiConfig.useMock) {
    return createMockVoiceResponse(request);
  }

  const formData = new FormData();
  formData.append("audio", {
    uri: request.audioUri,
    name: request.fileName ?? "voice-input.m4a",
    type: request.mimeType ?? "audio/m4a",
  } as unknown as Blob);

  const response = await axios.post(getVoiceApiUrl(), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: voiceApiConfig.requestTimeoutMs,
  });

  return {
    transcript: response.data?.transcript ?? "",
    replyText: response.data?.replyText ?? response.data?.text ?? "",
    audioUrl: response.data?.audioUrl ?? "",
    emotion: response.data?.emotion ?? "neutral",
  };
};
