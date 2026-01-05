// Company profiles and reviews data management
export interface CompanyProfile {
  id: string;
  companyName: string;
  email: string;
  industry: string;
  description: string;
  logo?: string;
  website?: string;
  location: string;
  foundedYear?: number;
  employeeCount?: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  benefits?: string[];
  techStack?: string[];
}

export interface CompanyReview {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  workEnvironment: number; // 1-5
  compensation: number; // 1-5
  careerGrowth: number; // 1-5
  createdAt: string;
  helpful: number;
  position?: string;
  workType?: 'full-time' | 'part-time' | 'internship' | 'contract';
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  averageWorkEnvironment: number;
  averageCompensation: number;
  averageCareerGrowth: number;
}

// Company data management functions
export class CompanyDataManager {
  private static COMPANIES_KEY = 'companyProfiles';
  private static REVIEWS_KEY = 'companyReviews';

  // Get all company profiles
  static getCompanies(): CompanyProfile[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.COMPANIES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Get company by ID
  static getCompanyById(id: string): CompanyProfile | null {
    const companies = this.getCompanies();
    return companies.find(company => company.id === id) || null;
  }

  // Save company profile
  static saveCompany(company: CompanyProfile): void {
    if (typeof window === 'undefined') return;
    const companies = this.getCompanies();
    const existingIndex = companies.findIndex(c => c.id === company.id);
    
    if (existingIndex >= 0) {
      companies[existingIndex] = company;
    } else {
      companies.push(company);
    }
    
    localStorage.setItem(this.COMPANIES_KEY, JSON.stringify(companies));
  }

  // Get all reviews
  static getReviews(): CompanyReview[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.REVIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Get reviews for a specific company
  static getCompanyReviews(companyId: string): CompanyReview[] {
    const reviews = this.getReviews();
    return reviews.filter(review => review.companyId === companyId);
  }

  // Save review
  static saveReview(review: CompanyReview): void {
    if (typeof window === 'undefined') return;
    const reviews = this.getReviews();
    reviews.push(review);
    localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews));
    
    // Update company rating
    this.updateCompanyRating(review.companyId);
  }

  // Update company rating based on reviews
  private static updateCompanyRating(companyId: string): void {
    const companies = this.getCompanies();
    const companyIndex = companies.findIndex(c => c.id === companyId);
    
    if (companyIndex >= 0) {
      const reviews = this.getCompanyReviews(companyId);
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      companies[companyIndex].averageRating = Math.round(averageRating * 10) / 10;
      companies[companyIndex].totalReviews = reviews.length;
      
      localStorage.setItem(this.COMPANIES_KEY, JSON.stringify(companies));
    }
  }

  // Get review statistics for a company
  static getReviewStats(companyId: string): ReviewStats {
    const reviews = this.getCompanyReviews(companyId);
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        averageWorkEnvironment: 0,
        averageCompensation: 0,
        averageCareerGrowth: 0,
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const totalWorkEnvironment = reviews.reduce((sum, review) => sum + review.workEnvironment, 0);
    const totalCompensation = reviews.reduce((sum, review) => sum + review.compensation, 0);
    const totalCareerGrowth = reviews.reduce((sum, review) => sum + review.careerGrowth, 0);

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    return {
      averageRating: Math.round((totalRating / reviews.length) * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution,
      averageWorkEnvironment: Math.round((totalWorkEnvironment / reviews.length) * 10) / 10,
      averageCompensation: Math.round((totalCompensation / reviews.length) * 10) / 10,
      averageCareerGrowth: Math.round((totalCareerGrowth / reviews.length) * 10) / 10,
    };
  }

  // Initialize with sample data (for demo purposes)
  static initializeSampleData(): void {
    if (typeof window === 'undefined') return;
    
    const existingCompanies = this.getCompanies();
    if (existingCompanies.length > 0) return; // Already initialized

    const sampleCompanies: CompanyProfile[] = [
      {
        id: 'tech-corp-1',
        companyName: 'TechCorp Solutions',
        email: 'hr@techcorp.com',
        industry: 'Technology',
        description: 'Leading software development company specializing in web and mobile applications.',
        website: 'https://techcorp.com',
        location: 'San Francisco, CA',
        foundedYear: 2015,
        employeeCount: '50-200',
        averageRating: 4.2,
        totalReviews: 0,
        createdAt: new Date().toISOString(),
        benefits: ['Health Insurance', 'Remote Work', 'Flexible Hours', 'Stock Options'],
        techStack: ['React', 'Node.js', 'TypeScript', 'AWS']
      },
      {
        id: 'innovate-labs-2',
        companyName: 'Innovate Labs',
        email: 'careers@innovatelabs.com',
        industry: 'Artificial Intelligence',
        description: 'AI-first company building the future of machine learning and data science.',
        website: 'https://innovatelabs.com',
        location: 'New York, NY',
        foundedYear: 2018,
        employeeCount: '20-50',
        averageRating: 4.5,
        totalReviews: 0,
        createdAt: new Date().toISOString(),
        benefits: ['Health Insurance', 'Learning Budget', 'Gym Membership', 'Catered Meals'],
        techStack: ['Python', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes']
      },
      {
        id: 'green-energy-3',
        companyName: 'GreenEnergy Systems',
        email: 'jobs@greenenergy.com',
        industry: 'Clean Energy',
        description: 'Sustainable energy solutions for a better tomorrow.',
        website: 'https://greenenergy.com',
        location: 'Austin, TX',
        foundedYear: 2012,
        employeeCount: '200-500',
        averageRating: 3.8,
        totalReviews: 0,
        createdAt: new Date().toISOString(),
        benefits: ['Health Insurance', 'Retirement Plan', 'PTO', 'Professional Development'],
        techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'React']
      }
    ];

    localStorage.setItem(this.COMPANIES_KEY, JSON.stringify(sampleCompanies));
  }

  // Generate unique ID
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}