import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { restaurants } from "../../../shared/schema";
import { useCreateRestaurant } from "@/hooks/use-restaurants";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export function AddRestaurantDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createRestaurant = useCreateRestaurant();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createRestaurant.mutateAsync(data);
      toast({
        title: "Success",
        description: "Restaurant created successfully",
        variant: "default",
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 w-full sm:w-auto flex items-center justify-center"
        >
          <span className="material-icons mr-2">add</span>
          <span>Add Restaurant</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Restaurant</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details to add a new restaurant
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
                onClick={() => setOpen(false)}
                className="border-border text-foreground"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createRestaurant.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {createRestaurant.isPending ? "Creating..." : "Create Restaurant"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
