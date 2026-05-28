import Link from 'next/link';
import { College } from '@/types/college';

interface Props {
  college: College;
  showCompareButton?: boolean;
  onCompareToggle?: (id: number) => void;
  isInCompare?: boolean;
}

export default function CollegeCard({ college, showCompareButton, onCompareToggle, isInCompare }: Props) {
  const fmtFees = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L/yr` : `₹${n.toLocaleString('en-IN')}/yr`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-200 relative overflow-hidden">
        {college.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={college.image} alt={college.name} className="w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            college.type === 'Public' ? 'bg-green-100 text-green-700' :
            college.type === 'Private' ? 'bg-purple-100 text-purple-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {college.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-slate-700">
            {college.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-slate-900 text-base leading-snug line-clamp-2 mb-1">
          {college.name}
        </h3>
        <p className="text-sm text-slate-500 mb-3">📍 {college.location}</p>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Rating</p>
            <p className="font-semibold text-sm text-yellow-600">⭐ {college.rating}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Fees</p>
            <p className="font-semibold text-sm text-blue-700">{fmtFees(college.fees)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Avg Pkg</p>
            <p className="font-semibold text-sm text-green-600">{college.avgPackage} LPA</p>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            View Details
          </Link>
          {showCompareButton && onCompareToggle && (
            <button
              onClick={() => onCompareToggle(college.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                isInCompare
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isInCompare ? '✓ Added' : '+ Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
