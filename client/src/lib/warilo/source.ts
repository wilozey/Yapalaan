import type {
  WariloBuyerDeliveryContact,
  WariloCourier,
  WariloDemoData,
  WariloProduct,
  WariloSellerProfile,
} from "@shared/warilo";

export type WariloCreateOrderInput = {
  buyerId: string;
  sellerId: string;
  productId: string;
  courierId: string;
  productAmountFcfa: number;
  deliveryFeeFcfa: number;
  deliveryCommissionFcfa: number;
  paymentMethod: string;
  buyerDeliveryContact: WariloBuyerDeliveryContact;
};

export type WariloCreatedOrder = {
  id: string;
  totalAmountFcfa: number;
  status: "pending_payment" | "paid" | "accepted" | "in_delivery" | "delivered";
};

export type WariloDataSource = {
  getSnapshot: () => Promise<WariloDemoData>;
  listProducts: () => Promise<WariloProduct[]>;
  listCouriers: () => Promise<WariloCourier[]>;
  getSellerProfile: (sellerId: string) => Promise<WariloSellerProfile | null>;
  createOrder: (input: WariloCreateOrderInput) => Promise<WariloCreatedOrder>;
  rateCourier: (courierId: string, orderId: string, rating: number) => Promise<void>;
};
