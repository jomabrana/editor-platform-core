
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Plus, MoreHorizontal, Edit, Trash, FolderOpen } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  color: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Technology", slug: "technology", description: "Latest tech news and innovations", articleCount: 45, color: "bg-blue-500" },
    { id: 2, name: "Business", slug: "business", description: "Business and financial news", articleCount: 32, color: "bg-green-500" },
    { id: 3, name: "Sports", slug: "sports", description: "Sports news and updates", articleCount: 28, color: "bg-orange-500" },
    { id: 4, name: "Politics", slug: "politics", description: "Political news and analysis", articleCount: 21, color: "bg-red-500" },
    { id: 5, name: "Entertainment", slug: "entertainment", description: "Entertainment and celebrity news", articleCount: 19, color: "bg-purple-500" },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-500"
  });

  const colors = [
    "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-red-500", 
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-yellow-500"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const slug = formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, slug }
          : cat
      ));
      toast({
        title: "Category updated",
        description: `"${formData.name}" has been updated successfully.`,
      });
      setEditingCategory(null);
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now(),
        ...formData,
        slug,
        articleCount: 0
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Category created",
        description: `"${formData.name}" has been created successfully.`,
      });
      setIsCreateOpen(false);
    }

    setFormData({ name: "", description: "", color: "bg-blue-500" });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
  };

  const handleDelete = (category: Category) => {
    if (category.articleCount > 0) {
      toast({
        title: "Cannot delete category",
        description: `"${category.name}" has ${category.articleCount} articles. Move or delete articles first.`,
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.filter(cat => cat.id !== category.id));
    toast({
      title: "Category deleted",
      description: `"${category.name}" has been deleted successfully.`,
    });
  };

  const CategoryForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter category name..."
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description..."
        />
      </div>
      <div>
        <Label>Color</Label>
        <div className="flex gap-2 mt-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full ${color} ${
                formData.color === color ? 'ring-2 ring-gray-400' : ''
              }`}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit">
          {editingCategory ? 'Update Category' : 'Create Category'}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingCategory(null);
            setFormData({ name: "", description: "", color: "bg-blue-500" });
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">
              Organize your articles into categories
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your articles.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {category.articleCount} articles
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(category)}
                        className="text-red-600"
                        disabled={category.articleCount > 0}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{category.description}</p>
                <p className="text-xs text-gray-500 mt-2">Slug: {category.slug}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingCategory && (
          <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the category information.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm />
            </DialogContent>
          </Dialog>
        )}

        {categories.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first category to organize your articles
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;
