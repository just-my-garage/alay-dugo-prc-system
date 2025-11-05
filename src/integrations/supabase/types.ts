export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blood_product_types: {
        Row: {
          product_name: string
          product_type_id: number
          shelf_life_days: number
        }
        Insert: {
          product_name: string
          product_type_id?: number
          shelf_life_days: number
        }
        Update: {
          product_name?: string
          product_type_id?: number
          shelf_life_days?: number
        }
        Relationships: []
      }
      blood_request_items: {
        Row: {
          blood_type: string
          product_type_id: number
          quantity_fulfilled: number | null
          quantity_requested: number
          request_id: number
          request_item_id: number
        }
        Insert: {
          blood_type: string
          product_type_id: number
          quantity_fulfilled?: number | null
          quantity_requested: number
          request_id: number
          request_item_id?: number
        }
        Update: {
          blood_type?: string
          product_type_id?: number
          quantity_fulfilled?: number | null
          quantity_requested?: number
          request_id?: number
          request_item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "blood_request_items_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "blood_product_types"
            referencedColumns: ["product_type_id"]
          },
          {
            foreignKeyName: "blood_request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["request_id"]
          },
        ]
      }
      blood_requests: {
        Row: {
          hospital_id: number
          request_datetime: string
          request_id: number
          status: Database["public"]["Enums"]["request_status_enum"] | null
          urgency: Database["public"]["Enums"]["urgency_enum"]
        }
        Insert: {
          hospital_id: number
          request_datetime: string
          request_id?: number
          status?: Database["public"]["Enums"]["request_status_enum"] | null
          urgency: Database["public"]["Enums"]["urgency_enum"]
        }
        Update: {
          hospital_id?: number
          request_datetime?: string
          request_id?: number
          status?: Database["public"]["Enums"]["request_status_enum"] | null
          urgency?: Database["public"]["Enums"]["urgency_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "blood_requests_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["hospital_id"]
          },
        ]
      }
      blood_units: {
        Row: {
          blood_type: string
          collection_date: string
          current_center_id: number | null
          donation_id: number
          expiry_date: string
          parent_unit_id: string | null
          product_type_id: number
          status: Database["public"]["Enums"]["unit_status_enum"]
          unit_id: string
        }
        Insert: {
          blood_type: string
          collection_date: string
          current_center_id?: number | null
          donation_id: number
          expiry_date: string
          parent_unit_id?: string | null
          product_type_id: number
          status: Database["public"]["Enums"]["unit_status_enum"]
          unit_id: string
        }
        Update: {
          blood_type?: string
          collection_date?: string
          current_center_id?: number | null
          donation_id?: number
          expiry_date?: string
          parent_unit_id?: string | null
          product_type_id?: number
          status?: Database["public"]["Enums"]["unit_status_enum"]
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blood_units_current_center_id_fkey"
            columns: ["current_center_id"]
            isOneToOne: false
            referencedRelation: "prc_centers"
            referencedColumns: ["center_id"]
          },
          {
            foreignKeyName: "blood_units_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["donation_id"]
          },
          {
            foreignKeyName: "blood_units_parent_unit_id_fkey"
            columns: ["parent_unit_id"]
            isOneToOne: false
            referencedRelation: "blood_units"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "blood_units_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "blood_product_types"
            referencedColumns: ["product_type_id"]
          },
        ]
      }
      donation_drives: {
        Row: {
          city: string
          drive_id: number
          drive_name: string
          end_datetime: string
          organizing_center_id: number | null
          province: string
          start_datetime: string
          status: Database["public"]["Enums"]["drive_status_enum"] | null
          venue_address: string
        }
        Insert: {
          city: string
          drive_id?: number
          drive_name: string
          end_datetime: string
          organizing_center_id?: number | null
          province: string
          start_datetime: string
          status?: Database["public"]["Enums"]["drive_status_enum"] | null
          venue_address: string
        }
        Update: {
          city?: string
          drive_id?: number
          drive_name?: string
          end_datetime?: string
          organizing_center_id?: number | null
          province?: string
          start_datetime?: string
          status?: Database["public"]["Enums"]["drive_status_enum"] | null
          venue_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_drives_organizing_center_id_fkey"
            columns: ["organizing_center_id"]
            isOneToOne: false
            referencedRelation: "prc_centers"
            referencedColumns: ["center_id"]
          },
        ]
      }
      donations: {
        Row: {
          center_id: number | null
          donation_date: string
          donation_id: number
          donation_location_type: Database["public"]["Enums"]["donation_location_type_enum"]
          donor_id: number
          drive_id: number | null
          notes: string | null
          screening_result: Database["public"]["Enums"]["screening_result_enum"]
        }
        Insert: {
          center_id?: number | null
          donation_date: string
          donation_id?: number
          donation_location_type: Database["public"]["Enums"]["donation_location_type_enum"]
          donor_id: number
          drive_id?: number | null
          notes?: string | null
          screening_result: Database["public"]["Enums"]["screening_result_enum"]
        }
        Update: {
          center_id?: number | null
          donation_date?: string
          donation_id?: number
          donation_location_type?: Database["public"]["Enums"]["donation_location_type_enum"]
          donor_id?: number
          drive_id?: number | null
          notes?: string | null
          screening_result?: Database["public"]["Enums"]["screening_result_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "donations_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "prc_centers"
            referencedColumns: ["center_id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["donor_id"]
          },
          {
            foreignKeyName: "donations_drive_id_fkey"
            columns: ["drive_id"]
            isOneToOne: false
            referencedRelation: "donation_drives"
            referencedColumns: ["drive_id"]
          },
        ]
      }
      donors: {
        Row: {
          address: string | null
          blood_type: string
          city: string | null
          contact_number: string
          created_at: string | null
          date_of_birth: string
          donor_id: number
          eligibility_status:
            | Database["public"]["Enums"]["eligibility_status_enum"]
            | null
          email: string | null
          first_name: string
          last_donation_date: string | null
          last_name: string
          province: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          blood_type: string
          city?: string | null
          contact_number: string
          created_at?: string | null
          date_of_birth: string
          donor_id?: number
          eligibility_status?:
            | Database["public"]["Enums"]["eligibility_status_enum"]
            | null
          email?: string | null
          first_name: string
          last_donation_date?: string | null
          last_name: string
          province?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          blood_type?: string
          city?: string | null
          contact_number?: string
          created_at?: string | null
          date_of_birth?: string
          donor_id?: number
          eligibility_status?:
            | Database["public"]["Enums"]["eligibility_status_enum"]
            | null
          email?: string | null
          first_name?: string
          last_donation_date?: string | null
          last_name?: string
          province?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          address: string | null
          city: string | null
          hospital_id: number
          hospital_name: string
          province: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          hospital_id?: number
          hospital_name: string
          province?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          hospital_id?: number
          hospital_name?: string
          province?: string | null
        }
        Relationships: []
      }
      prc_centers: {
        Row: {
          address: string
          center_id: number
          center_name: string
          city: string
          contact_number: string | null
          latitude: number | null
          longitude: number | null
          province: string
        }
        Insert: {
          address: string
          center_id?: number
          center_name: string
          city: string
          contact_number?: string | null
          latitude?: number | null
          longitude?: number | null
          province: string
        }
        Update: {
          address?: string
          center_id?: number
          center_name?: string
          city?: string
          contact_number?: string | null
          latitude?: number | null
          longitude?: number | null
          province?: string
        }
        Relationships: []
      }
      shipment_items: {
        Row: {
          shipment_id: number
          shipment_item_id: number
          unit_id: string
        }
        Insert: {
          shipment_id: number
          shipment_item_id?: number
          unit_id: string
        }
        Update: {
          shipment_id?: number
          shipment_item_id?: number
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_items_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["shipment_id"]
          },
          {
            foreignKeyName: "shipment_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "blood_units"
            referencedColumns: ["unit_id"]
          },
        ]
      }
      shipments: {
        Row: {
          actual_arrival_datetime: string | null
          destination_center_id: number | null
          destination_hospital_id: number | null
          dispatch_datetime: string | null
          estimated_arrival_datetime: string | null
          origin_center_id: number
          request_id: number | null
          shipment_id: number
          status: Database["public"]["Enums"]["shipment_status_enum"]
        }
        Insert: {
          actual_arrival_datetime?: string | null
          destination_center_id?: number | null
          destination_hospital_id?: number | null
          dispatch_datetime?: string | null
          estimated_arrival_datetime?: string | null
          origin_center_id: number
          request_id?: number | null
          shipment_id?: number
          status: Database["public"]["Enums"]["shipment_status_enum"]
        }
        Update: {
          actual_arrival_datetime?: string | null
          destination_center_id?: number | null
          destination_hospital_id?: number | null
          dispatch_datetime?: string | null
          estimated_arrival_datetime?: string | null
          origin_center_id?: number
          request_id?: number | null
          shipment_id?: number
          status?: Database["public"]["Enums"]["shipment_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "shipments_destination_center_id_fkey"
            columns: ["destination_center_id"]
            isOneToOne: false
            referencedRelation: "prc_centers"
            referencedColumns: ["center_id"]
          },
          {
            foreignKeyName: "shipments_destination_hospital_id_fkey"
            columns: ["destination_hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["hospital_id"]
          },
          {
            foreignKeyName: "shipments_origin_center_id_fkey"
            columns: ["origin_center_id"]
            isOneToOne: false
            referencedRelation: "prc_centers"
            referencedColumns: ["center_id"]
          },
          {
            foreignKeyName: "shipments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["request_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      donation_location_type_enum: "Center" | "Drive"
      drive_status_enum: "Planned" | "Ongoing" | "Completed" | "Cancelled"
      eligibility_status_enum:
        | "Eligible"
        | "Temporarily Deferred"
        | "Permanently Deferred"
      request_status_enum:
        | "Pending"
        | "Partially Fulfilled"
        | "Fulfilled"
        | "Cancelled"
      screening_result_enum: "Passed" | "Deferred"
      shipment_status_enum:
        | "Preparing"
        | "In-Transit"
        | "Delivered"
        | "Delayed"
        | "Cancelled"
      unit_status_enum:
        | "In-Testing"
        | "In-Storage"
        | "In-Transit"
        | "Dispatched"
        | "Expired"
        | "Used"
        | "Quarantined"
      urgency_enum: "Routine" | "Urgent" | "Emergency"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      donation_location_type_enum: ["Center", "Drive"],
      drive_status_enum: ["Planned", "Ongoing", "Completed", "Cancelled"],
      eligibility_status_enum: [
        "Eligible",
        "Temporarily Deferred",
        "Permanently Deferred",
      ],
      request_status_enum: [
        "Pending",
        "Partially Fulfilled",
        "Fulfilled",
        "Cancelled",
      ],
      screening_result_enum: ["Passed", "Deferred"],
      shipment_status_enum: [
        "Preparing",
        "In-Transit",
        "Delivered",
        "Delayed",
        "Cancelled",
      ],
      unit_status_enum: [
        "In-Testing",
        "In-Storage",
        "In-Transit",
        "Dispatched",
        "Expired",
        "Used",
        "Quarantined",
      ],
      urgency_enum: ["Routine", "Urgent", "Emergency"],
    },
  },
} as const
