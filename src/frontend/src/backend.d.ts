import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AnalysisRecord {
    result: SkillGapResult;
    resume: string;
    jobDescription: string;
    timestamp: bigint;
}
export interface SkillGapResult {
    readinessScore: bigint;
    recommendations: Array<[string, string]>;
    recommendedSkills: Array<string>;
    missingSkills: Array<string>;
    matchedSkills: Array<string>;
}
export interface backendInterface {
    analyzeSkillGap(resume: string, jobDescription: string): Promise<SkillGapResult>;
    getAnalysisHistory(): Promise<Array<AnalysisRecord>>;
    saveAnalysis(resume: string, jobDescription: string, result: SkillGapResult): Promise<void>;
}
