
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count();
  const totalCommunities = await prisma.community.count();
  const totalCollections = await prisma.collection.count();
  const totalItems = await prisma.item.count();
  const itemsInReview = await prisma.item.count({ where: { status: 'IN_REVIEW' } });
  const itemsPublished = await prisma.item.count({ where: { status: 'PUBLISHED' } });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-8">Welcome to the admin dashboard. Here you can manage communities, collections, items, and users.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p className="text-3xl font-semibold">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-2">Communities</h2>
          <p className="text-3xl font-semibold">{totalCommunities}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-2">Collections</h2>
          <p className="text-3xl font-semibold">{totalCollections}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-2">Total Items</h2>
          <p className="text-3xl font-semibold">{totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-2">Items In Review</h2>
          <p className="text-3xl font-semibold">{itemsInReview}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-2">Items Published</h2>
          <p className="text-3xl font-semibold">{itemsPublished}</p>
        </div>
      </div>
    </div>
  );
}
