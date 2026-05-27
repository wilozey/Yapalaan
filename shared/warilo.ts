export type WariloDataMode = "local-demo" | "supabase";

export type WariloProduct = {
  id: string;
  name: string;
  short: string;
  category: string;
  productType?: "shoes" | "watch" | "other";
  brand?: string;
  description?: string;
  purchaseNote?: string;
  condition?: string;
  authenticityNote?: string;
  estimatedMarketPriceFcfa?: number;
  priceFcfa: number;
  oldPriceFcfa?: number;
  imageUrl: string;
  tag: string;
  sellerId: string;
  stock: number;
  availability: "available" | "sold" | "hidden";
};

export type WariloSellerProfile = {
  id: string;
  storeName: string;
  slug: string;
  commune: string;
  phone: string;
  whatsapp: string;
  email: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  verificationStatus: "pending" | "verified" | "rejected";
  trustLevel: string;
  rating: number;
  reviewCount: number;
};

export type WariloCourier = {
  id: string;
  fullName: string;
  phone: string;
  commune: string;
  zone: string;
  vehicleType: "moto" | "car" | "van";
  eta: string;
  deliveryFeeFcfa: number;
  yapalaanCommissionFcfa?: number;
  availabilityStatus?: "active" | "inactive";
  averageRating: number;
  ratingsCount: number;
  locationLabel: string;
  latitude: number;
  longitude: number;
};

export type WariloBuyerDeliveryContact = {
  phone: string;
  whatsapp: string;
  email: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  deliveryInstructions: string;
};

export type WariloDemoData = {
  mode: WariloDataMode;
  categories: string[];
  products: WariloProduct[];
  seller: WariloSellerProfile;
  couriers: WariloCourier[];
  buyerDeliveryContact: WariloBuyerDeliveryContact;
};

export const formatFcfa = (amount: number) => `${amount.toLocaleString("fr-FR")} FCFA`;
