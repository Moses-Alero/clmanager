import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateRestaurant } from "@/hooks/use-restaurants";
import { useToast } from "@/hooks/use-toast";
import { type Restaurant } from "../../../shared/schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

// Form validation schema
export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Restaurant name must be at least 2 characters.",
  }),
  plate_price: z.coerce.number().min(0, {
      message: "Plate price must be a positive number.",
    }).optional(),
  delivery_fee: z.coerce.number().min(0, {
      message: "Delivery fee must be a positive number.",
    }).optional(),
  description: z.string().optional().nullable(),
});

export type FormData = z.infer<typeof formSchema>;

interface EditRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant;
}

export function EditRestaurantDialog({ 
  open, 
  onOpenChange, 
  restaurant 
}: EditRestaurantDialogProps) {
  const { toast } = useToast();
  const updateRestaurant = useUpdateRestaurant();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: restaurant.name,
      plate_price: restaurant.plate_price || 0,
      delivery_fee: restaurant.delivery_fee || 0,
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
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Restaurant</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the restaurant details
          </DialogDescription>
        </DialogHeader>
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
              name="plate_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Plate Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter plate price" 
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
              name="delivery_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Delivery Fee</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter delivery fee" 
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
                      value={field.value ?? ""}
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
                onClick={() => onOpenChange(false)}
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
      </DialogContent>
    </Dialog>
  );
}