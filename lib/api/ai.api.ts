import apiClient from "./apiClient";

export const aiApi = {
    analyzeIssue: async (category: string, petId: string, description: string) => {
        try {
            const response = await apiClient.post("/ai/analyze", {
                category,
                petId,
                description
            });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "AI Analysis failed"
            };
        }
    }
};
