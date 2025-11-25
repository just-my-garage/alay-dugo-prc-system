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

const CreateRequest = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    fetchHospitals();
    fetchProductTypes();
  }, []);

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

  const onSubmit = async (values: BloodRequestFormValues) => {
    setIsSubmitting(true);
    try {
      // Insert blood request
      const { data: requestData, error: requestError } = await supabase
        .from("blood_requests")
        .insert({
          hospital_id: parseInt(values.hospital_id),
          request_datetime: values.request_datetime,
          urgency: values.urgency,
          status: "Pending",
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Insert blood request items
      const itemsToInsert = values.items.map((item) => ({
        request_id: requestData.request_id,
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
        description: "Blood request created successfully",
      });

      navigate("/requests");
    } catch (error) {
      console.error("Error creating blood request:", error);
      toast({
        title: "Error",
        description: "Failed to create blood request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Create Blood Request</h1>
          <p className="text-muted-foreground">Submit a new blood request for hospital needs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>Fill in the information for the blood request</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Hospital Selection */}
                <FormField
                  control={form.control}
                  name="hospital_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Button type="button" variant="outline" onClick={() => navigate("/requests")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Request"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateRequest;
