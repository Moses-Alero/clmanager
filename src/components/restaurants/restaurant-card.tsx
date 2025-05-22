import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Restaurant } from "../../../shared/schema";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { restaurants } from "../../../shared/schema";
import { useUpdateRestaurant } from "@/hooks/use-restaurants";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

// Form validation schema for restaurants
const formSchema = createInsertSchema(restaurants)
  .pick({
    name: true,
    description: true,
  })
  .extend({
    name: z.string().min(2, {
      message: "Restaurant name must be at least 2 characters.",
    }),
  });

type FormData = z.infer<typeof formSchema>;

interface EditRestaurantFormProps {
  restaurant: Restaurant;
  onCancel: () => void;
  onSuccess: () => void;
}

function EditRestaurantForm({ restaurant, onCancel, onSuccess }: EditRestaurantFormProps) {
  const { toast } = useToast();
  const updateRestaurant = useUpdateRestaurant();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateRestaurant.mutateAsync({
        id: restaurant.id,
        data
      });
      toast({
        title: "Success",
        description: "Restaurant updated successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Restaurant Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter restaurant name" 
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter restaurant description" 
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none h-24"
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-border text-foreground"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={updateRestaurant.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {updateRestaurant.isPending ? "Updating..." : "Update Restaurant"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Card className="bg-card rounded-lg overflow-hidden shadow-md card-hover">
      <div className="relative h-48">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80" 
          alt="Restaurant interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
            Active
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80">
                <span className="material-icons text-white">more_vert</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem 
                className="flex items-center cursor-pointer"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <span className="material-icons mr-2 text-primary text-sm">edit</span>
                Edit Restaurant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {restaurant.description || "No description available"}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Manage items</span>
          <Link href={`/restaurants/${restaurant.id}/menu`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <span className="material-icons mr-1 text-sm">menu_book</span>
              View Menu
            </Button>
          </Link>
        </div>
      </CardContent>
      
      {/* Edit Restaurant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-background border-border text-foreground sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Restaurant</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the restaurant details
            </DialogDescription>
          </DialogHeader>
          {isEditDialogOpen && <EditRestaurantForm
            restaurant={restaurant}
            onCancel={() => setIsEditDialogOpen(false)}
            onSuccess={() => setIsEditDialogOpen(false)}
          />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
