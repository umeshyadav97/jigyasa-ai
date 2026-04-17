export const voiceApiConfig = {
  baseUrl: "https://example.com/api",
  voicePath: "/voice",
  useMock: true,
  requestTimeoutMs: 20000,
  dummyAudioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
};

export const getVoiceApiUrl = () =>
  `${voiceApiConfig.baseUrl}${voiceApiConfig.voicePath}`;
