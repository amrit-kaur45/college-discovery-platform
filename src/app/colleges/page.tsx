'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import { College, PaginatedColleges } from '@/types/college';

const CATEGORIES = ['', 'Engineering', 'Management', 'Medical', 'Law', 'Arts'];
const TYPES = ['', 'Public', 'Private', 'Deemed'];
const STATES = ['', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Rajasthan', 'Gujarat', 'West Bengal'];

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10 text-slate-500">Loading...</div>}>
      <CollegesContent />
    </Suspense>
  );
}

function CollegesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<PaginatedColleges | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState<number[]>([]);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const state = searchParams.get('state') || '';
  const type = searchParams.get('type') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (state) params.set('state', state);
    if (type) params.set('type', type);
    params.set('page', String(page));
    params.set('limit', '9');

    try {
      const res = await fetch(`/api/colleges?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, category, state, type, page]);

  useEffect(() => { fetchColleges(); }, [fetchColleges]);

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    router.push(`/colleges?${p.toString()}`);
  };

  const handleCompareToggle = (id: number) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const goCompare = () => {
    router.push(`/compare?ids=${compareList.join(',')}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">All Colleges</h1>
      <p className="text-slate-500 mb-8">Search and filter from our database of top Indian colleges</p>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, location..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value);
            }}
            onBlur={(e) => updateParam('search', e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={type}
            onChange={(e) => updateParam('type', e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {TYPES.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={state}
            onChange={(e) => updateParam('state', e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All States</option>
            {STATES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && data && (
        <p className="text-sm text-slate-500 mb-5">
          Showing <strong>{data.colleges.length}</strong> of <strong>{data.total}</strong> colleges
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 h-72 animate-pulse" />
          ))}
        </div>
      ) : data?.colleges.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-semibold text-lg">No colleges found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.colleges.map((college: College) => (
            <CollegeCard
              key={college.id}
              college={college}
              showCompareButton
              onCompareToggle={handleCompareToggle}
              isInCompare={compareList.includes(college.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: data.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => updateParam('page', String(i + 1))}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === i + 1
                  ? 'bg-blue-700 text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Floating compare bar */}
      {compareList.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-50">
          <span className="text-sm">{compareList.length} colleges selected</span>
          <button
            onClick={goCompare}
            className="bg-yellow-400 text-slate-900 font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Compare Now →
          </button>
          <button onClick={() => setCompareList([])} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>
      )}
    </div>
  );
}