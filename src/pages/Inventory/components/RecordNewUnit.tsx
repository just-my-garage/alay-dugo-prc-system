import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RecordNewUnitProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export const RecordNewUnit = ({ open, onOpenChange }: RecordNewUnitProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    unit_id: "",
    blood_type: "",
    collection_date: "",
    expiry_date: "",
    donation_id: "",
    product_type_id: "",
    current_center_id: "",
    status: "In-Testing",
  });

  // Fetch donations for dropdown
  const { data: donations = [] } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("donation_id, donation_date, donor_id, users(first_name, last_name)")
        .order("donation_date", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch product types
  const { data: productTypes = [] } = useQuery({
    queryKey: ["product-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_product_types")
        .select("product_type_id, product_name, shelf_life_days");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch PRC centers
  const { data: centers = [] } = useQuery({
    queryKey: ["prc-centers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prc_centers")
        .select("center_id, center_name, city");
      
      if (error) throw error;
      return data || [];
    },
  });

  const createUnitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("blood_units").insert({
        unit_id: data.unit_id,
        blood_type: data.blood_type,
        collection_date: data.collection_date,
        expiry_date: data.expiry_date,
        donation_id: parseInt(data.donation_id),
        product_type_id: parseInt(data.product_type_id),
        current_center_id: data.current_center_id ? parseInt(data.current_center_id) : null,
        status: data.status as any,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Blood unit recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["blood-units"] });
      onOpenChange(false);
      setFormData({
        unit_id: "",
        blood_type: "",
        collection_date: "",
        expiry_date: "",
        donation_id: "",
        product_type_id: "",
        current_center_id: "",
        status: "In-Testing",
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to record unit: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.unit_id || !formData.blood_type || !formData.collection_date || 
        !formData.expiry_date || !formData.donation_id || !formData.product_type_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    createUnitMutation.mutate(formData);
  };

  const handleProductTypeChange = (productTypeId: string) => {
    setFormData({ ...formData, product_type_id: productTypeId });
    
    // Auto-calculate expiry date based on product type shelf life
    const productType = productTypes.find(pt => pt.product_type_id.toString() === productTypeId);
    if (productType && formData.collection_date) {
      const collectionDate = new Date(formData.collection_date);
      const expiryDate = new Date(collectionDate);
      expiryDate.setDate(expiryDate.getDate() + productType.shelf_life_days);
      setFormData(prev => ({ 
        ...prev, 
        product_type_id: productTypeId,
        expiry_date: expiryDate.toISOString().split('T')[0] 
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record New Blood Unit</DialogTitle>
          <DialogDescription>
            Enter the details of the new blood unit to add to inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_id">Unit ID *</Label>
              <Input
                id="unit_id"
                value={formData.unit_id}
                onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                placeholder="e.g., BU-2025-001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_type">Blood Type *</Label>
              <Select
                value={formData.blood_type}
                onValueChange={(value) => setFormData({ ...formData, blood_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="donation_id">Donation *</Label>
              <Select
                value={formData.donation_id}
                onValueChange={(value) => setFormData({ ...formData, donation_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select donation" />
                </SelectTrigger>
                <SelectContent>
                  {donations.map((donation: any) => (
                    <SelectItem key={donation.donation_id} value={donation.donation_id.toString()}>
                      ID: {donation.donation_id} - {donation.users?.first_name} {donation.users?.last_name} ({donation.donation_date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_type_id">Product Type *</Label>
              <Select
                value={formData.product_type_id}
                onValueChange={handleProductTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.product_type_id} value={type.product_type_id.toString()}>
                      {type.product_name} ({type.shelf_life_days} days)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection_date">Collection Date *</Label>
              <Input
                id="collection_date"
                type="date"
                value={formData.collection_date}
                onChange={(e) => setFormData({ ...formData, collection_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date *</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_center_id">Current Center</Label>
              <Select
                value={formData.current_center_id}
                onValueChange={(value) => setFormData({ ...formData, current_center_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select center (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {centers.map((center) => (
                    <SelectItem key={center.center_id} value={center.center_id.toString()}>
                      {center.center_name} - {center.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In-Testing">In-Testing</SelectItem>
                  <SelectItem value="In-Storage">In-Storage</SelectItem>
                  <SelectItem value="In-Transit">In-Transit</SelectItem>
                  <SelectItem value="Quarantined">Quarantined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createUnitMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createUnitMutation.isPending}>
              {createUnitMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Record Unit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
