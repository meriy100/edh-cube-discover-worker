import { VertexAI,  GenerationConfig } from '@google-cloud/vertexai';

// 環境変数から設定を取得（デプロイ時に設定可能）
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT ?? 'edh-cube-discover-localdev';
const LOCATION = process.env.FUNCTION_REGION || 'asia-northeast1'; // フォールバックを設定しておくと安全
export const MODEL_NAME = 'gemini-2.5-flash';

// クライアントをグローバルに保持
export const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });


export const generationConfig: GenerationConfig = {
  temperature: 0.2, // 翻訳の正確性を高めるため低めに設定
  maxOutputTokens: 4000,
};

