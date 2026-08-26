export const metadata = {
  title: 'Privacy Policy - PortfolioHub',
  description: 'Privacy information for PortfolioHub users.',
};

const decisions = [
  'Lawful basis for each processing purpose',
  'Data retention periods',
  'Third-party subprocessors and vendor trust review',
  'Cookie, analytics, and marketing consent requirements',
  'International transfer terms such as DPAs or SCCs',
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-400">Privacy</p>
          <h1 className="text-4xl font-bold mt-2">Privacy Policy</h1>
          <p className="text-gray-300 mt-4">
            This page summarizes the app&apos;s current data handling features. It is not legal advice and should be reviewed by a qualified privacy professional before relying on it for compliance.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Data We Process</h2>
          <p className="text-gray-300">
            PortfolioHub stores account identifiers, names, email addresses, portfolio content, resume data, template settings, job application status entries, and notification read receipts when you use those features.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Your Controls</h2>
          <p className="text-gray-300">
            Signed-in users can download a JSON export of app-held account data or permanently delete their login and account data from Dashboard Settings. Signing in again after deletion starts a new account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Security</h2>
          <p className="text-gray-300">
            The app uses HTTPS in production, server-side identity verification for protected API routes, request validation, rate limits, and security headers. Database encryption at rest depends on the managed Postgres provider configuration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Human Decisions Still Needed</h2>
          <ul className="list-disc pl-5 text-gray-300 space-y-2">
            {decisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
