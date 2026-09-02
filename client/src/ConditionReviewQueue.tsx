import { useEffect, useState } from "react";

interface CandidateCondition {
  id: string;
  patient: {
    name: string;
    dateOfBirth: string;
  };
  code: string;
  description: string;
  evidenceSummary: string;
  isRelevant: boolean | null;
  needsMoreInformation: boolean;
  lastReviewedBy: string | null;
}

interface ReviewDraft {
  isRelevant?: boolean;
  needsMoreInformation?: boolean;
  reviewerId: string;
}

function reviewStatus(candidate: CandidateCondition) {
  if (candidate.needsMoreInformation) return "Needs more information";
  if (candidate.isRelevant === true) return "Relevant";
  if (candidate.isRelevant === false) return "Not relevant";
  return "Not reviewed";
}

export function ConditionReviewQueue() {
  const [candidates, setCandidates] = useState<CandidateCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedCandidateId, setSavedCandidateId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/condition-reviews")
      .then((response) => response.json())
      .then((data: CandidateCondition[]) => setCandidates(data))
      .catch(() => setError("The review queue could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  async function saveReview(candidateId: string, draft: ReviewDraft) {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, ...draft } : candidate,
      ),
    );
    setSavedCandidateId(candidateId);

    await fetch(`/api/condition-reviews/${candidateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
  }

  if (loading) return <section className="panel notice">Loading review queue…</section>;
  if (error) return <section className="panel notice error">{error}</section>;

  return (
    <section className="panel">
      <div className="queue-header">
        <div>
          <h2>Condition review queue</h2>
          <p className="muted">{candidates.length} candidate conditions</p>
        </div>
      </div>

      <ul className="condition-list">
        {candidates.map((candidate) => (
          <li className="condition-row" key={candidate.id}>
            <div>
              <p className="patient-name">{candidate.patient.name}</p>
              <span className="condition-code">DOB {candidate.patient.dateOfBirth}</span>
            </div>
            <div>
              <p className="condition-name">
                {candidate.code} · {candidate.description}
              </p>
              <p className="evidence">{candidate.evidenceSummary}</p>
              {candidate.lastReviewedBy && (
                <span className="review-meta">Last reviewed by {candidate.lastReviewedBy}</span>
              )}
            </div>
            <div className="review-actions">
              <button
                onClick={() =>
                  saveReview(candidate.id, {
                    isRelevant: true,
                    needsMoreInformation: false,
                    reviewerId: "reviewer-1",
                  })
                }
              >
                Relevant
              </button>
              <button
                onClick={() =>
                  saveReview(candidate.id, {
                    isRelevant: false,
                    needsMoreInformation: false,
                    reviewerId: "reviewer-1",
                  })
                }
              >
                Not relevant
              </button>
              <button
                onClick={() =>
                  saveReview(candidate.id, {
                    isRelevant: candidate.isRelevant ?? undefined,
                    needsMoreInformation: true,
                    reviewerId: "reviewer-1",
                  })
                }
              >
                Need more info
              </button>
              <p className={savedCandidateId === candidate.id ? "status saved" : "status"}>
                {savedCandidateId === candidate.id ? "Saved · " : ""}
                {reviewStatus(candidate)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
