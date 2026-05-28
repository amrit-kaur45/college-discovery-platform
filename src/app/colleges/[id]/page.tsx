'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { College } from '@/types/college';

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'recruiters'>('overview');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/colleges/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setCollege(data);
      })
      .catch(() => setError('Failed to load college'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 animate-pulse">
      Loading college details...
    </div>
  );
  if (error || !college) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <p className="text-4xl mb-4">😕</p>
      <p className="font-semibold text-slate-900 mb-2">{error || 'College not found'}</p>
      <Link href="/colleges" className="text-blue-600 hover:underline text-sm">← Back to colleges</Link>
    </div>
  );

  const courses = JSON.parse(college.courses || '[]') as string[];
  const recruiters = JSON.parse(college.recruiters || '[]') as string[];
  const fmtFees = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L/yr` : `₹${n.toLocaleString('en-IN')}/yr`;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'courses', label: 'Courses' },
    { key: 'placements', label: 'Placements' },
    { key: 'recruiters', label: 'Recruiters' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back */}
      <button onClick={() => router.back()} className="text-sm text-slate-500 hover:text-slate-900 mb-6 flex items-center gap-1">
        ← Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
        <div className="h-48 bg-gradient-to-br from-blue-800 to-indigo-700 relative overflow-hidden">
          {college.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={college.image} alt={college.name} className="w-full h-full object-cover opacity-50" />
          )}
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="text-xs font-semibold bg-white/20 text-white px-2 py-1 rounded-full">{college.type}</span>
                <span className="text-xs font-semibold bg-white/20 text-white px-2 py-1 rounded-full">{college.category}</span>
                <span className="text-xs font-semibold bg-white/20 text-white px-2 py-1 rounded-full">Est. {college.established}</span>
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-white">{college.name}</h1>
              <p className="text-blue-200 text-sm mt-1">📍 {college.location}</p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-t border-slate-100">
          {[
            { label: 'Rating', value: `⭐ ${college.rating}`, sub: `${college.reviewCount} reviews` },
            { label: 'Annual Fees', value: fmtFees(college.fees), sub: 'per year' },
            { label: 'Avg Package', value: `${college.avgPackage} LPA`, sub: 'median CTC' },
            { label: 'Placement Rate', value: `${college.placementRate}%`, sub: 'placed 2024' },
          ].map((s) => (
            <div key={s.label} className="p-4 text-center">
              <p className="font-display font-bold text-xl text-blue-700">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="font-display font-semibold text-xl text-slate-900 mb-3">About {college.name}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">{college.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Location</p>
                  <p className="font-semibold text-slate-900">{college.location}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Established</p>
                  <p className="font-semibold text-slate-900">{college.established}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Type</p>
                  <p className="font-semibold text-slate-900">{college.type}</p>
                </div>
                {college.website && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Website</p>
                    <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline truncate block">
                      {college.website.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h2 className="font-display font-semibold text-xl text-slate-900 mb-4">Available Courses</h2>
              <div className="flex flex-wrap gap-3">
                {courses.map((c) => (
                  <span key={c} className="bg-blue-50 text-blue-800 border border-blue-200 px-4 py-2 rounded-xl text-sm font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'placements' && (
            <div>
              <h2 className="font-display font-semibold text-xl text-slate-900 mb-4">Placement Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                  <p className="text-3xl font-display font-bold text-green-700">{college.avgPackage} LPA</p>
                  <p className="text-sm text-green-600 mt-1">Average Package</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                  <p className="text-3xl font-display font-bold text-blue-700">{college.maxPackage} Cr</p>
                  <p className="text-sm text-blue-600 mt-1">Highest Package</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center">
                  <p className="text-3xl font-display font-bold text-purple-700">{college.placementRate}%</p>
                  <p className="text-sm text-purple-600 mt-1">Placement Rate</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recruiters' && (
            <div>
              <h2 className="font-display font-semibold text-xl text-slate-900 mb-4">Top Recruiters</h2>
              <div className="flex flex-wrap gap-3">
                {recruiters.map((r) => (
                  <span key={r} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compare CTA */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-900">Want to compare this college?</p>
          <p className="text-sm text-slate-600">See how it stacks up against others</p>
        </div>
        <Link
          href={`/compare?ids=${college.id}`}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
        >
          Add to Compare
        </Link>
      </div>
    </div>
  );
}
