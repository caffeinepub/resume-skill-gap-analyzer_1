import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnalysisRecord, SkillGapResult } from "../backend.d";
import { useActor } from "./useActor";

export function useAnalysisHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<AnalysisRecord[]>({
    queryKey: ["analysisHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnalysisHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnalyzeSkillGap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resume,
      jobDescription,
    }: {
      resume: string;
      jobDescription: string;
    }): Promise<SkillGapResult> => {
      if (!actor) throw new Error("Backend not available");
      const result = await actor.analyzeSkillGap(resume, jobDescription);
      // Save analysis after getting result
      await actor.saveAnalysis(resume, jobDescription, result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysisHistory"] });
    },
  });
}
