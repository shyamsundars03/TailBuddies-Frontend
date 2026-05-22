import apiClient from "./apiClient";
import { AI_ENDPOINTS } from "../endpoints/ai";
import { handleApiError } from "../utils/api-error.handler";
import { ApiResponse, AiAnalysisData } from "../types/api.types";

export const aiApi = {
    analyzeIssue: async (category: string, petId: string, description: string): Promise<ApiResponse<AiAnalysisData>> => {
        try {
            const response = await apiClient.post(AI_ENDPOINTS.ANALYZE, {
                category,
                petId,
                description
            });
            return response.data;
        } catch (error: unknown) {
            return handleApiError(error, "AI Analysis failed");
        }
    }
};
