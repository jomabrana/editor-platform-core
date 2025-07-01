
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Users, FolderOpen, Eye, TrendingUp, Clock } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: "Total Articles", value: "156", icon: FileText, color: "bg-blue-500" },
    { title: "Published", value: "142", icon: Eye, color: "bg-green-500" },
    { title: "Drafts", value: "14", icon: Clock, color: "bg-yellow-500" },
    { title: "Categories", value: "12", icon: FolderOpen, color: "bg-purple-500" },
  ];

  if (user?.role === 'admin') {
    stats.push({ title: "Total Users", value: "8", icon: Users, color: "bg-red-500" });
  }

  const recentArticles = [
    { id: 1, title: "Breaking: Tech Company Announces New Product", status: "published", author: "John Doe", date: "2024-01-15" },
    { id: 2, title: "Market Analysis: Q4 Results Show Growth", status: "draft", author: "Jane Smith", date: "2024-01-14" },
    { id: 3, title: "Sports Update: Championship Finals", status: "published", author: "Mike Johnson", date: "2024-01-13" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your news platform today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
              <CardDescription>Latest articles from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{article.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        By {article.author} • {article.date}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a href="/articles/create" className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium">Create New Article</span>
                </a>
                <a href="/articles" className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">View All Articles</span>
                </a>
                {(user?.role === 'editor' || user?.role === 'admin') && (
                  <a href="/categories" className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <FolderOpen className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium">Manage Categories</span>
                  </a>
                )}
                {user?.role === 'admin' && (
                  <a href="/users" className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Users className="h-5 w-5 text-red-600 mr-3" />
                    <span className="font-medium">Manage Users</span>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
