import { yapalaanDemoData } from "@shared/wariloDemo";
import type { WariloCreateOrderInput, WariloDataSource } from "./source";

export const wariloLocalDemoData = yapalaanDemoData;

export const localWariloSource: WariloDataSource = {
  getSnapshot: async () => wariloLocalDemoData,
  listProducts: async () => wariloLocalDemoData.products,
  listCouriers: async () => wariloLocalDemoData.couriers,
  getSellerProfile: async (sellerId: string) =>
    wariloLocalDemoData.seller.id === sellerId ? wariloLocalDemoData.seller : null,
  createOrder: async (input: WariloCreateOrderInput) => ({
    id: `demo_order_${input.productId}_${input.courierId}`,
    totalAmountFcfa: input.productAmountFcfa + input.deliveryFeeFcfa,
    status: "pending_payment",
  }),
  rateCourier: async () => {
    return;
  },
};
