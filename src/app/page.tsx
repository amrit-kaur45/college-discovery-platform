export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function HomePage() {
  const stats = [
    { label: 'Colleges Listed', value: '12+' },
    { label: 'Categories', value: '5' },
    { label: 'States Covered', value: '8' },
    { label: 'Students Helped', value: '10K+' },
  ];

  const categories = [
    { name: 'Engineering', emoji: '⚙️', desc: 'B.Tech, M.Tech & more' },
    { name: 'Management', emoji: '📊', desc: 'MBA, BBA & more' },
    { name: 'Medical', emoji: '🏥', desc: 'MBBS, MD & more' },
    { name: 'Law', emoji: '⚖️', desc: 'LLB, LLM & more' },
    { name: 'Arts', emoji: '🎨', desc: 'BA, B.Com & more' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-4">
            India&apos;s College Discovery Platform
          </p>
          <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight mb-6">
            Find Your <span className="text-yellow-400">Dream College</span>
          </h1>
          <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
            Search, compare, and discover the best colleges across India. Make data-driven decisions for your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/colleges"
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Explore Colleges →
            </Link>
            <Link
              href="/compare"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Compare Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display font-bold text-3xl text-blue-700">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-2 text-center">Browse by Category</h2>
        <p className="text-slate-500 text-center mb-10">Find colleges that match your stream and interests</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/colleges?category=${cat.name}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="text-3xl mb-3">{cat.emoji}</div>
              <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{cat.name}</p>
              <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 border-y border-blue-100 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-slate-900 mb-4">
            Can&apos;t decide between colleges?
          </h2>
          <p className="text-slate-600 mb-8">
            Use our side-by-side comparison tool to evaluate fees, placements, ratings and more.
          </p>
          <Link
            href="/compare"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Try Compare Tool →
          </Link>
        </div>
      </section>
    </div>
  );
}