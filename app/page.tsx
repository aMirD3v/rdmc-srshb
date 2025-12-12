import { Search, ChevronDown, BarChart3, FileText, Users, Database, ArrowRight, Eye, Calendar, Download, Globe } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import RecentSubmissionCard from '@/components/RecentSubmissionCard'; // Import the new component

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-gray-600 text-sm">{label}</p>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
    <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
      <Icon className="w-6 h-6 text-blue-700" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const CommunityCard = ({ community }: { community: any }) => {
  const totalItems = community.collections.reduce((acc: number, collection: any) => acc + collection._count.items, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{community.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{community.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Database className="w-4 h-4 mr-1" />
            <span>{totalItems} datasets</span>
          </div>
        </div>
        <Link 
          href={`/communities/${community.id}`}
          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default async function Home() {
  const communities = await prisma.community.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      collections: {
        include: {
          _count: {
            select: { items: true },
          },
        },
      },
    },
  });

  const rawRecentItems = await prisma.item.findMany({
    take: 4,
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: {
      submitter: true,
      collection: true,
      metadata: {
        where: { key: 'dc.description.abstract' },
      },
    },
  });

  const recentItems = rawRecentItems.map(item => {
    const abstract = item.metadata.find(m => m.key === 'dc.description.abstract')?.value || '';
    return {
      ...item,
      abstract,
    };
  });

  const totalItems = await prisma.item.count();
  const totalUsers = await prisma.user.count();
  const totalCommunities = await prisma.community.count();

  // Mock stats - replace with actual database queries
  const stats = [
    { icon: Database, value: totalItems.toLocaleString(), label: "Total Datasets" },
    { icon: Users, value: totalUsers.toLocaleString(), label: "Active Researchers" },
    { icon: FileText, value: totalItems.toLocaleString(), label: "Research Papers" }, // Assuming research papers are also items
    { icon: Globe, value: totalCommunities.toLocaleString(), label: "Communities" },
  ];

  const features = [
    {
      icon: Database,
      title: "Comprehensive Data Repositories",
      description: "The repository houses valuable health data, including public health records, clinical studies, and academic research datasets."
    },
    {
      icon: FileText,
      title: "Research Publications",
      description: "Access to research outputs and scholarly articles to advance knowledge in various fields of study."
    },
    {
      icon: BarChart3,
      title: "Visualization Tools",
      description: "Interactive dashboards and visual tools to explore health trends and research patterns effectively."
    },
    {
      icon: Globe,
      title: "Open Access",
      description: "We believe in transparency and open access to data, empowering researchers worldwide."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
         {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-800 to-blue-400">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-15">
          <div className="max-w-5xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-8 border border-white/30">
              <Globe className="w-4 h-4 mr-2" />
              Somali Regional State Health Bureau Repository
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Welcome to the Somali Regional State Health Bureau Repository
            </h1>
            
            <p className=" text-blue-100 mb-8 max-w-2xl">
              At the heart of advancing research and management at Somali Regional State Health Bureau, 
              the Repository is dedicated to improving outcomes through the efficient collection 
              and dissemination of knowledge.
            </p>

            {/* Search Section in Hero */}
            <div className="">
              <form action="/search" method="GET" className="relative max-w-2xl">
                <div className="relative border border-gray-300 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search the repository..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-800 hover:text-white transition-colors"
                >
                  <span className="flex items-center">
                    <Search size={20} className="mr-2" />
                    Search
                  </span>
                </button>
              </form>
            </div>

            {/* Key Features List */}
            {/* <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Key Features:</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Database className="w-5 h-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">
                    <strong className="text-white">Comprehensive Data Repositories:</strong> The repository houses valuable health data, including public health records, clinical studies, and academic research.
                  </span>
                </li>
                <li className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">
                    <strong className="text-white">Research Publications:</strong> Access to research outputs and scholarly articles to advance knowledge in various disciplines.
                  </span>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">
                    <strong className="text-white">Visualization Tools:</strong> Interactive dashboards and visual tools to explore trends and patterns in research data.
                  </span>
                </li>
                <li className="flex items-start">
                  <Globe className="w-5 h-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">
                    <strong className="text-white">Open Access:</strong> We believe in transparency and open access to data, empowering researchers and promoting collaboration.
                  </span>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div> */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section (Clean Cards) */}
        {/* <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Repository Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the comprehensive tools and resources available in our research repository
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div> */}

       

        {/* Recent Submissions */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Submissions</h2>
              <p className="text-gray-600">Latest research contributions from our community</p>
            </div>
            <Link 
              href="/items"
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
            >
              View all submissions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentItems.map((item) => (
              <RecentSubmissionCard key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Load more ...
            </button>
          </div>
        </div>

      {/* Communities Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Communities</h2>
              <p className="text-gray-600">Browse the communities in the repository.</p>
            </div>
            <Link 
              href="/communities"
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
            >
              View all communities
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </div>
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-800 to-blue-400 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Share Your Research?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Contribute to the growing repository of knowledge and make your research 
              accessible to the global academic community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Submit Your Work
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Learn How to Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}