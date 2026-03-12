import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type SkillGapResult = {
    matchedSkills : [Text];
    missingSkills : [Text];
    recommendedSkills : [Text];
    readinessScore : Nat;
    recommendations : [(Text, Text)];
  };

  type AnalysisRecord = {
    resume : Text;
    jobDescription : Text;
    result : SkillGapResult;
    timestamp : Int;
  };

  module AnalysisRecord {
    public func compare(a : AnalysisRecord, b : AnalysisRecord) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  let analysisHistory = List.empty<AnalysisRecord>();

  let knownSkills : [Text] = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "HTML",
    "CSS",
    "React",
    "Angular",
    "Node.js",
    "SQL",
    "NoSQL",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Agile",
    "DevOps",
    "Scrum",
    "Project Management",
    "Communication",
  ];

  func contains(array : [Text], value : Text) : Bool {
    for (item in array.values()) {
      if (item == value) {
        return true;
      };
    };
    false;
  };

  func extractSkills(text : Text) : [Text] {
    let lowerText = text.toLower();
    knownSkills.filter(func(skill) { lowerText.contains(#text(skill.toLower())) });
  };

  public shared ({ caller }) func analyzeSkillGap(resume : Text, jobDescription : Text) : async SkillGapResult {
    let resumeSkills = extractSkills(resume);
    let jobSkills = extractSkills(jobDescription);

    let matchedSkills = jobSkills.filter(
      func(skill) {
        contains(resumeSkills, skill);
      }
    );

    let missingSkills = jobSkills.filter(
      func(skill) {
        not contains(resumeSkills, skill);
      }
    );

    let readinessScore = if (jobSkills.size() == 0) {
      100;
    } else {
      (matchedSkills.size() * 100) / jobSkills.size();
    };

    let recommendations = missingSkills.map(
      func(skill) {
        (
          skill,
          "Consider taking a course or certification in " # skill,
        );
      }
    );

    {
      matchedSkills;
      missingSkills;
      recommendedSkills = [];
      readinessScore;
      recommendations;
    };
  };

  public shared ({ caller }) func saveAnalysis(resume : Text, jobDescription : Text, result : SkillGapResult) : async () {
    let record : AnalysisRecord = {
      resume;
      jobDescription;
      result;
      timestamp = 0;
    };

    if (analysisHistory.size() >= 10) {
      let tempList = analysisHistory.toArray().reverse();
      let trimmedList = tempList.sliceToArray(0, tempList.size() - 1).reverse();
      analysisHistory.clear();
      analysisHistory.addAll(trimmedList.values());
    };

    analysisHistory.add(record);
  };

  public query ({ caller }) func getAnalysisHistory() : async [AnalysisRecord] {
    analysisHistory.toArray().sort();
  };
};
