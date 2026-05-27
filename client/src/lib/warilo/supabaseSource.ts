import type {
  WariloCourier,
  WariloDemoData,
  WariloProduct,
  WariloSellerProfile,
} from "@shared/warilo";
import { wariloLocalDemoData } from "./localDemo";
import type { WariloCreateOrderInput, WariloCreatedOrder, WariloDataSource } from "./source";

type SupabaseProductRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  category: string;
  product_type: "shoes" | "watch" | "other" | null;
  brand: string | null;
  purchase_note: string | null;
  condition_label: string | null;
  authenticity_note: string | null;
  estimated_market_price_fcfa: number | null;
  price_fcfa: number;
  images: unknown;
  stock: number;
  status: string;
};

type SupabaseSellerRow = {
  id: string;
  store_name: string;
  commune: string;
  whatsapp_number: string;
  phone: string | null;
  email: string | null;
  location_label: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  trust_score: number;
  verification_status: "pending" | "verified" | "rejected" | "suspended";
};

type SupabaseCourierRow = {
  id: string;
  full_name: string;
  phone: string;
  commune: string;
  vehicle_type: "moto" | "car" | "van" | "walk";
  delivery_fee_fcfa: number;
  yapalaan_commission_fcfa: number | null;
  average_rating: number | string;
  ratings_count: number;
  notes: string | null;
  location_label: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
};

type SupabaseOrderRow = {
  id?: string;
  order_id?: string;
  total_amount_fcfa: number;
  status: WariloCreatedOrder["status"];
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isWariloSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const numberOrZero = (value: number | string | null | undefined) => Number(value ?? 0);

const firstImage = (images: unknown) => {
  if (Array.isArray(images) && typeof images[0] === "string") {
    return images[0];
  }

  return wariloLocalDemoData.products[0].imageUrl;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const buildUrl = (path: string) => {
  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is missing");
  }

  return `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!supabaseAnonKey) {
    throw new Error("VITE_SUPABASE_ANON_KEY is missing");
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  return (await response.json()) as T;
};

const mapProduct = (row: SupabaseProductRow): WariloProduct => ({
  id: row.id,
  name: row.title,
  short: row.title.length > 22 ? `${row.title.slice(0, 22)}...` : row.title,
  category: row.category,
  productType: row.product_type ?? "other",
  brand: row.brand ?? undefined,
  description: row.description ?? undefined,
  purchaseNote: row.purchase_note ?? undefined,
  condition: row.condition_label ?? undefined,
  authenticityNote: row.authenticity_note ?? undefined,
  estimatedMarketPriceFcfa: row.estimated_market_price_fcfa ?? undefined,
  priceFcfa: row.price_fcfa,
  imageUrl: firstImage(row.images),
  tag: row.status === "active" ? "Vérifié" : "Brouillon",
  sellerId: row.seller_id,
  stock: row.stock,
  availability: row.status === "sold" ? "sold" : row.status === "active" && row.stock > 0 ? "available" : "hidden",
});

const mapSeller = (row: SupabaseSellerRow): WariloSellerProfile => ({
  id: row.id,
  storeName: row.store_name,
  slug: slugify(row.store_name),
  commune: row.commune,
  phone: row.phone ?? row.whatsapp_number,
  whatsapp: row.whatsapp_number,
  email: row.email ?? "",
  locationLabel: row.location_label ?? row.commune,
  latitude: numberOrZero(row.latitude),
  longitude: numberOrZero(row.longitude),
  verificationStatus: row.verification_status === "suspended" ? "rejected" : row.verification_status,
  trustLevel: row.trust_score >= 80 ? "Vendeur Or - Profil vérifié" : "Vendeur vérifié",
  rating: wariloLocalDemoData.seller.rating,
  reviewCount: wariloLocalDemoData.seller.reviewCount,
});

const mapCourier = (row: SupabaseCourierRow): WariloCourier => ({
  id: row.id,
  fullName: row.full_name,
  phone: row.phone,
  commune: row.commune,
  zone: row.notes ?? row.commune,
  vehicleType: row.vehicle_type === "walk" ? "moto" : row.vehicle_type,
  eta: "À confirmer",
  deliveryFeeFcfa: row.delivery_fee_fcfa,
  yapalaanCommissionFcfa: row.yapalaan_commission_fcfa ?? undefined,
  availabilityStatus: "active",
  averageRating: numberOrZero(row.average_rating),
  ratingsCount: row.ratings_count,
  locationLabel: row.location_label ?? row.commune,
  latitude: numberOrZero(row.latitude),
  longitude: numberOrZero(row.longitude),
});

export const supabaseWariloSource: WariloDataSource = {
  getSnapshot: async (): Promise<WariloDemoData> => {
    const [products, couriers] = await Promise.all([
      supabaseWariloSource.listProducts(),
      supabaseWariloSource.listCouriers(),
    ]);
    const seller = products[0] ? await supabaseWariloSource.getSellerProfile(products[0].sellerId) : null;

    return {
      ...wariloLocalDemoData,
      mode: "supabase",
      categories: Array.from(new Set(products.map((product) => product.category))),
      products: products.length > 0 ? products : wariloLocalDemoData.products,
      couriers: couriers.length > 0 ? couriers : wariloLocalDemoData.couriers,
      seller: seller ?? wariloLocalDemoData.seller,
    };
  },
  listProducts: async () => {
    const rows = await request<SupabaseProductRow[]>(
      "warilo_products?select=*&status=eq.active&order=created_at.desc",
    );
    return rows.map(mapProduct);
  },
  listCouriers: async () => {
    const rows = await request<SupabaseCourierRow[]>(
      "warilo_couriers?select=*&status=eq.active&order=delivery_fee_fcfa.asc",
    );
    return rows.map(mapCourier);
  },
  getSellerProfile: async (sellerId: string) => {
    const rows = await request<SupabaseSellerRow[]>(
      `warilo_seller_profiles?select=*&id=eq.${encodeURIComponent(sellerId)}&limit=1`,
    );
    return rows[0] ? mapSeller(rows[0]) : null;
  },
  createOrder: async (input: WariloCreateOrderInput) => {
    const orders = await request<SupabaseOrderRow[]>("rpc/create_yapalaan_checkout_order", {
      method: "POST",
      body: JSON.stringify({
        p_buyer_id: input.buyerId,
        p_seller_id: input.sellerId,
        p_product_id: input.productId,
        p_courier_id: input.courierId,
        p_delivery_commune: input.buyerDeliveryContact.locationLabel,
        p_delivery_landmark: input.buyerDeliveryContact.locationLabel,
        p_delivery_notes: input.buyerDeliveryContact.deliveryInstructions,
        p_buyer_phone: input.buyerDeliveryContact.phone,
        p_buyer_whatsapp: input.buyerDeliveryContact.whatsapp,
        p_buyer_email: input.buyerDeliveryContact.email,
        p_buyer_location_label: input.buyerDeliveryContact.locationLabel,
        p_buyer_latitude: input.buyerDeliveryContact.latitude,
        p_buyer_longitude: input.buyerDeliveryContact.longitude,
        p_payment_method: input.paymentMethod,
      }),
    });
    const order = orders[0];

    if (!order) {
      throw new Error("Supabase did not return the created order");
    }

    const orderId = order.id ?? order.order_id;

    if (!orderId) {
      throw new Error("Supabase did not return the created order id");
    }

    return {
      id: orderId,
      totalAmountFcfa: order.total_amount_fcfa,
      status: order.status,
    };
  },
  rateCourier: async () => {
    throw new Error("Courier rating needs the authenticated buyer id before Supabase writes are enabled.");
  },
};
