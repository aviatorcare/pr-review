export function App() {
  return (
    <main className="page-shell">
      <header>
        <p className="eyebrow">Clinical Operations</p>
        <h1>Risk Adjustment Review</h1>
        <p className="subtitle">
          Review candidate conditions supported by clinical evidence.
        </p>
      </header>

      <section className="panel empty-state">
        <h2>Condition review queue</h2>
        <p>The review workflow is not enabled yet.</p>
      </section>
    </main>
  );
}
