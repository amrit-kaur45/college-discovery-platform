'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { College } from '@/types/college';

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-10 text-slate-500">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const idsParam = searchParams.get('ids') || '';

  // Load all colleges for the selector
  useEffect(() => {
    fetch('/api/colleges?limit=50')
      .then((r) => r.json())
      .then((d) => setAllColleges(d.colleges || []))
      .catch(() => {});
  }, []);

  // Load compare data when ids change
  useEffect(() => {
    if (!idsParam) {
      setColleges([]);
      setSelectedIds([]);
      return;
    }
    const ids = idsParam.split(',').filter(Boolean);
    setSelectedIds(ids);
    if (ids.length < 2) { setColleges([]); return; }
    setLoading(true);
    fetch(`/api/colleges/compare?ids=${idsParam}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setColleges(d.colleges);
      })
      .catch(() => setError('Failed to load comparison'))
      .finally(() => setLoading(false));
  }, [idsParam]);

  const addCollege = (id: string) => {
    if (selectedIds.includes(id) || selectedIds.length >= 3) return;
    const newIds = [...selectedIds, id];
    router.push(`/compare?ids=${newIds.join(',')}`);
  };

  const removeCollege = (id: number) => {
    const newIds = selectedIds.filter((i) => i !== String(id));
    if (newIds.length === 0) router.push('/compare');
    else router.push(`/compare?ids=${newIds.join(',')}`);
  };

  const fmtFees = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L/yr` : `₹${n.toLocaleString('en-IN')}/yr`;

  const rows = [
    { label: 'Location', render: (c: College) => c.location },
    { label: 'Type', render: (c: College) => c.type },
    { label: 'Category', render: (c: College) => c.category },
    { label: 'Established', render: (c: College) => String(c.established) },
    { label: 'Annual Fees', render: (c: College) => fmtFees(c.fees), highlight: true },
    { label: 'Rating', render: (c: College) => `⭐ ${c.rating}`, highlight: true },
    { label: 'Avg Package', render: (c: College) => `${c.avgPackage} LPA`, highlight: true },
    { label: 'Max Package', render: (c: College) => `${c.maxPackage} Cr`, highlight: true },
    { label: 'Placement Rate', render: (c: College) => `${c.placementRate}%`, highlight: true },
  ];

  // Find best values for highlighting
  const getBest = (key: keyof College) => {
    if (colleges.length === 0) return null;
    return Math.max(...colleges.map((c) => Number(c[key])));
  };

  const bestAvg = getBest('avgPackage');
  const bestPlacement = getBest('placementRate');
  const bestRating = getBest('rating');
  const minFees = colleges.length > 0 ? Math.min(...colleges.map((c) => c.fees)) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">Compare Colleges</h1>
      <p className="text-slate-500 mb-8">Select 2–3 colleges to compare side by side</p>

      {/* College selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8">
        <p className="text-sm font-medium text-slate-700 mb-3">Add college to compare ({selectedIds.length}/3):</p>
        <div className="flex flex-wrap gap-2">
          {allColleges
            .filter((c) => !selectedIds.includes(String(c.id)))
            .map((c) => (
              <button
                key={c.id}
                onClick={() => addCollege(String(c.id))}
                disabled={selectedIds.length >= 3}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                + {c.name}
              </button>
            ))}
        </div>
      </div>

      {/* State messages */}
      {!idsParam && (
        <div className="text-center py-20 text-slate-500">
          <p className="text-5xl mb-4">⚖️</p>
          <p className="font-semibold text-lg text-slate-900">Select colleges above to start comparing</p>
          <p className="text-sm mt-2">Or browse colleges and click &ldquo;+ Compare&rdquo;</p>
          <Link href="/colleges" className="inline-block mt-4 text-blue-600 hover:underline text-sm">
            Browse colleges →
          </Link>
        </div>
      )}

      {idsParam && selectedIds.length < 2 && !loading && (
        <div className="text-center py-12 text-slate-500 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="font-medium text-amber-800">Please select at least 2 colleges to compare.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-slate-500 animate-pulse">Loading comparison...</div>
      )}

      {error && (
        <div className="text-center py-12 text-red-600 bg-red-50 border border-red-200 rounded-2xl">
          {error}
        </div>
      )}

      {/* Comparison table */}
      {colleges.length >= 2 && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* College headers */}
          <div className={`grid border-b border-slate-200`} style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}>
            <div className="p-4 bg-slate-50 border-r border-slate-200" />
            {colleges.map((c) => (
              <div key={c.id} className="p-4 border-r last:border-r-0 border-slate-200">
                <div className="h-20 rounded-xl bg-gradient-to-br from-blue-800 to-indigo-700 relative overflow-hidden mb-3">
                  {c.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover opacity-60" />
                  )}
                </div>
                <p className="font-display font-semibold text-sm text-slate-900 leading-tight">{c.name}</p>
                <p className="text-xs text-slate-500 mt-1">{c.location}</p>
                <button
                  onClick={() => removeCollege(c.id)}
                  className="text-xs text-red-400 hover:text-red-600 mt-2"
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid border-b last:border-b-0 border-slate-100`}
              style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}
            >
              <div className={`p-4 border-r border-slate-100 flex items-center ${i % 2 === 0 ? 'bg-slate-50/60' : ''}`}>
                <span className="text-sm font-medium text-slate-600">{row.label}</span>
              </div>
              {colleges.map((c) => {
                // Highlight logic
                let highlight = false;
                if (row.label === 'Avg Package' && c.avgPackage === bestAvg) highlight = true;
                if (row.label === 'Placement Rate' && c.placementRate === bestPlacement) highlight = true;
                if (row.label === 'Rating' && c.rating === bestRating) highlight = true;
                if (row.label === 'Annual Fees' && c.fees === minFees) highlight = true;

                return (
                  <div
                    key={c.id}
                    className={`p-4 border-r last:border-r-0 border-slate-100 flex items-center ${i % 2 === 0 ? 'bg-slate-50/60' : ''} ${highlight ? 'bg-green-50' : ''}`}
                  >
                    <span className={`text-sm ${highlight ? 'font-semibold text-green-700' : 'text-slate-700'}`}>
                      {highlight && '✓ '}
                      {row.render(c)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {colleges.length >= 2 && !loading && (
        <p className="text-xs text-slate-400 text-center mt-4">
          ✓ Green highlights indicate the best value in that category
        </p>
      )}
    </div>
  );
}