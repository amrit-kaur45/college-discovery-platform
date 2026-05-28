export interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  type: string;
  category: string;
  fees: number;
  rating: number;
  reviewCount: number;
  established: number;
  description: string;
  website?: string | null;
  image?: string | null;
  avgPackage: number;
  maxPackage: number;
  placementRate: number;
  courses: string;
  recruiters: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollegeFilters {
  search?: string;
  category?: string;
  state?: string;
  type?: string;
  minFees?: number;
  maxFees?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedColleges {
  colleges: College[];
  total: number;
  page: number;
  totalPages: number;
}
