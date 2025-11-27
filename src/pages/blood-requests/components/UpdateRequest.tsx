import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["Emergency", "Urgent", "Routine"];

const bloodRequestSchema = z.object({
  hospital_id: z.string().min(1, "Hospital is required"),
  request_datetime: z.string().min(1, "Request date and time is required"),
  urgency: z.enum(["Emergency", "Urgent", "Routine"], {
    required_error: "Urgency level is required",
  }),
  items: z.array(
    z.object({
      blood_type: z.string().min(1, "Blood type is required"),
      product_type_id: z.string().min(1, "Product type is required"),
      quantity_requested: z.coerce.number().min(1, "Quantity must be at least 1"),
      request_item_id: z.number().optional(),
    })
  ).min(1, "At least one blood item is required"),
});

type BloodRequestFormValues = z.infer<typeof bloodRequestSchema>;

interface Hospital {
  hospital_id: number;
  hospital_name: string;
  city: string | null;
  province: string | null;
}

interface ProductType {
  product_type_id: number;
  product_name: string;
  shelf_life_days: number;
}

interface UpdateRequestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: number;
  onSuccess: () => void;
}

const UpdateRequest = ({ open, onOpenChange, requestId, onSuccess }: UpdateRequestProps) => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<BloodRequestFormValues>({
    resolver: zodResolver(bloodRequestSchema),
    defaultValues: {
      hospital_id: "",
      request_datetime: "",
      urgency: "Routine",
      items: [{ blood_type: "", product_type_id: "", quantity_requested: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (open) {
      fetchHospitals();
      fetchProductTypes();
      fetchRequestData();
    }
  }, [open, requestId]);

  const fetchHospitals = async () => {
    const { data, error } = await supabase
      .from("hospitals")
      .select("hospital_id, hospital_name, city, province")
      .order("hospital_name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load hospitals",
        variant: "destructive",
      });
    } else {
      setHospitals(data || []);
    }
  };

  const fetchProductTypes = async () => {
    const { data, error } = await supabase
      .from("blood_product_types")
      .select("product_type_id, product_name, shelf_life_days")
      .order("product_name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load product types",
        variant: "destructive",
      });
    } else {
      setProductTypes(data || []);
    }
  };

  const fetchRequestData = async () => {
    setIsLoading(true);
    try {
      const { data: requestData, error: requestError } = await supabase
        .from("blood_requests")
        .select(`
          *,
          blood_request_items (
            request_item_id,
            blood_type,
            product_type_id,
            quantity_requested
          )
        `)
        .eq("request_id", requestId)
        .single();

      if (requestError) throw requestError;

      // Convert datetime to local format for input
      const datetime = new Date(requestData.request_datetime);
      const localDatetime = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      form.reset({
        hospital_id: requestData.hospital_id.toString(),
        request_datetime: localDatetime,
        urgency: requestData.urgency,
        items: requestData.blood_request_items.map((item: any) => ({
          blood_type: item.blood_type,
          product_type_id: item.product_type_id.toString(),
          quantity_requested: item.quantity_requested,
          request_item_id: item.request_item_id,
        })),
      });
    } catch (error) {
      console.error("Error fetching request data:", error);
      toast({
        title: "Error",
        description: "Failed to load request data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: BloodRequestFormValues) => {
    setIsSubmitting(true);
    try {
      // Update blood request
      const { error: requestError } = await supabase
        .from("blood_requests")
        .update({
          hospital_id: parseInt(values.hospital_id),
          request_datetime: values.request_datetime,
          urgency: values.urgency,
        })
        .eq("request_id", requestId);

      if (requestError) throw requestError;

      // Delete existing items
      const { error: deleteError } = await supabase
        .from("blood_request_items")
        .delete()
        .eq("request_id", requestId);

      if (deleteError) throw deleteError;

      // Insert updated items
      const itemsToInsert = values.items.map((item) => ({
        request_id: requestId,
        blood_type: item.blood_type,
        product_type_id: parseInt(item.product_type_id),
        quantity_requested: item.quantity_requested,
        quantity_fulfilled: 0,
      }));

      const { error: itemsError } = await supabase
        .from("blood_request_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: "Success",
        description: "Blood request updated successfully",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating blood request:", error);
      toast({
        title: "Error",
        description: "Failed to update blood request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Blood Request</DialogTitle>
          <DialogDescription>Modify the details of your blood request</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Hospital Selection */}
              <FormField
                control={form.control}
                name="hospital_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hospital" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital.hospital_id} value={hospital.hospital_id.toString()}>
                            {hospital.hospital_name}
                            {hospital.city && hospital.province && ` - ${hospital.city}, ${hospital.province}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Request Date/Time */}
              <FormField
                control={form.control}
                name="request_datetime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>When is this blood needed?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Urgency Level */}
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Blood Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Blood Items</h3>
                    <p className="text-sm text-muted-foreground">Specify the blood products needed</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ blood_type: "", product_type_id: "", quantity_requested: 1 })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.blood_type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Blood Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {bloodTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.product_type_id`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Product" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {productTypes.map((product) => (
                                    <SelectItem key={product.product_type_id} value={product.product_type_id.toString()}>
                                      {product.product_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity_requested`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-end">
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Request"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRequest;
