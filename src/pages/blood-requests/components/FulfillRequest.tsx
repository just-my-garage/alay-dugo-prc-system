import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FulfillRequestProps {
  request: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const FulfillRequest = ({
  request,
  open,
  onOpenChange,
  onSuccess,
}: FulfillRequestProps) => {
  const { toast } = useToast();
  const [fulfillmentData, setFulfillmentData] = useState<{
    [key: string]: number;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (bloodType: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setFulfillmentData((prev) => ({
      ...prev,
      [bloodType]: numValue,
    }));
  };

  const handleFulfill = async () => {
    setIsSubmitting(true);
    try {
      // Check if all quantities are fulfilled
      const allFulfilled = request.items.every((item: any) => {
        const fulfilledQty = fulfillmentData[item.bloodType] || 0;
        return fulfilledQty >= item.requested;
      });

      const partiallyFulfilled = request.items.some((item: any) => {
        const fulfilledQty = fulfillmentData[item.bloodType] || 0;
        return fulfilledQty > 0 && fulfilledQty < item.requested;
      });

      const newStatus = allFulfilled
        ? "Fulfilled"
        : partiallyFulfilled
        ? "Partially Fulfilled"
        : "Pending";

      // Update the blood request status
      const { error: requestError } = await supabase
        .from("blood_requests")
        .update({ status: newStatus })
        .eq("request_id", request.id);

      if (requestError) throw requestError;

      // Update blood request items with fulfilled quantities
      for (const item of request.items) {
        const fulfilledQty = fulfillmentData[item.bloodType] || 0;
        if (fulfilledQty > 0) {
          const { error: itemError } = await supabase
            .from("blood_request_items")
            .update({ quantity_fulfilled: fulfilledQty })
            .eq("request_id", request.id)
            .eq("blood_type", item.bloodType);

          if (itemError) throw itemError;
        }
      }

      toast({
        title: "Success",
        description: `Request ${newStatus.toLowerCase()} successfully`,
        variant: "default",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fulfill request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Fulfill Blood Request
          </DialogTitle>
          <DialogDescription>
            Enter the quantities you can fulfill for {request.hospital}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            Request Date: {request.requestDate}
          </div>

          <div className="space-y-4">
            {request.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-secondary/20 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Droplets className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {item.bloodType}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Requested: {item.requested} units
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`qty-${item.bloodType}`}>
                    Quantity to Fulfill
                  </Label>
                  <Input
                    id={`qty-${item.bloodType}`}
                    type="number"
                    min="0"
                    max={item.requested}
                    placeholder="0"
                    value={fulfillmentData[item.bloodType] || ""}
                    onChange={(e) =>
                      handleQuantityChange(item.bloodType, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleFulfill}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Fulfill Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FulfillRequest;
