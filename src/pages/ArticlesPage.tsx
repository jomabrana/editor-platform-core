
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Search, Plus, MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ArticlesPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const mockArticles = [
    {
      id: 1,
      title: "Breaking: Tech Company Announces Revolutionary AI Product",
      excerpt: "A major technology company has unveiled their latest artificial intelligence...",
      status: "published",
      author: "John Doe",
      category: "Technology",
      publishedAt: "2024-01-15",
      views: 1250,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Market Analysis: Q4 Results Show Unprecedented Growth",
      excerpt: "Financial markets are showing remarkable resilience as companies report...",
      status: "draft",
      author: "Jane Smith",
      category: "Business",
      publishedAt: null,
      views: 0,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Sports Championship Finals Draw Record Viewership",
      excerpt: "The annual championship drew millions of viewers worldwide...",
      status: "published",
      author: "Mike Johnson",
      category: "Sports",
      publishedAt: "2024-01-13",
      views: 890,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop"
    },
  ];

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || article.status === filterStatus;
    const matchesAuthor = user?.role === 'author' ? article.author === user.name : true;
    
    return matchesSearch && matchesStatus && matchesAuthor;
  });

  const handleDelete = (id: number, title: string) => {
    toast({
      title: "Article deleted",
      description: `"${title}" has been deleted successfully.`,
    });
  };

  const canEdit = (article: any) => {
    if (user?.role === 'admin' || user?.role === 'editor') return true;
    return user?.role === 'author' && article.author === user?.name;
  };

  const canDelete = (article: any) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'editor') return true;
    return user?.role === 'author' && article.author === user?.name;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600 mt-1">
              Manage and organize your news articles
            </p>
          </div>
          <Button asChild>
            <a href="/articles/create">
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </a>
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="grid gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-48 h-32 bg-gray-200 flex-shrink-0">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                          {article.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{article.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>By {article.author}</span>
                        {article.publishedAt && <span>{article.publishedAt}</span>}
                        {article.status === 'published' && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views} views
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        {canEdit(article) && (
                          <DropdownMenuItem asChild>
                            <a href={`/articles/edit/${article.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </a>
                          </DropdownMenuItem>
                        )}
                        {canDelete(article) && (
                          <DropdownMenuItem 
                            onClick={() => handleDelete(article.id, article.title)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "Create your first article to get started"}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ArticlesPage;
