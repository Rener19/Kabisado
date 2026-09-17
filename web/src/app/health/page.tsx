// This is a React Server Component (default in App Router)
export default async function HealthPage() {
  // Simulate fetching data for the health check
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    cache: 'no-store' // ensures it fetches fresh data every time
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch health check data');
  }

  const data = await res.json();
  const timestamp = new Date().toISOString();

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-green-600">System Health: Normal</h1>
      <p className="mt-4 text-secondary">
        This page demonstrates a Server Component fetching data on the server side before rendering to the client.
      </p>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Health Check Results</h2>
        <ul className="mt-4 space-y-2 text-sm text-secondary">
          <li><strong>Timestamp:</strong> {timestamp}</li>
          <li><strong>API Status:</strong> Connected</li>
          <li><strong>Mock Data Received:</strong> &ldquo;{data.title}&rdquo;</li>
        </ul>
      </div>
    </div>
  );
}
