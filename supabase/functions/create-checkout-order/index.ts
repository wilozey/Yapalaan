type CheckoutPayload = {
  buyerId?: string;
  sellerId?: string;
  productId?: string;
  courierId?: string;
  deliveryContact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    locationLabel?: string;
    latitude?: number | null;
    longitude?: number | null;
    deliveryInstructions?: string;
  };
  paymentMethod?: string;
};

type ProductRow = {
  id: string;
  seller_id: string;
  price_fcfa: number;
  stock: number;
  status: string;
};

type CourierRow = {
  id: string;
  delivery_fee_fcfa: number;
  yapalaan_commission_fcfa: number | null;
  status: string;
};

type OrderRow = {
  id: string;
  total_amount_fcfa: number;
  status: "pending_payment" | "paid" | "accepted" | "in_delivery" | "delivered";
};

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const requireString = (value: unknown, fieldName: string) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName}_required`);
  }

  return value.trim();
};

const dbRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("server_not_configured");
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`database_${response.status}`);
  }

  return (await response.json()) as T;
};

const one = <T>(rows: T[], errorCode: string) => {
  if (!rows[0]) {
    throw new Error(errorCode);
  }

  return rows[0];
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const payload = (await request.json()) as CheckoutPayload;
    const buyerId = requireString(payload.buyerId, "buyer_id");
    const sellerId = requireString(payload.sellerId, "seller_id");
    const productId = requireString(payload.productId, "product_id");
    const courierId = requireString(payload.courierId, "courier_id");
    const deliveryContact = payload.deliveryContact ?? {};
    const buyerPhone = requireString(deliveryContact.phone, "buyer_phone");
    const buyerWhatsapp = requireString(deliveryContact.whatsapp, "buyer_whatsapp");
    const buyerLocation = requireString(deliveryContact.locationLabel, "buyer_location");
    const paymentMethod = requireString(payload.paymentMethod, "payment_method");

    const product = one(
      await dbRequest<ProductRow[]>(
        `warilo_products?select=id,seller_id,price_fcfa,stock,status&id=eq.${encodeURIComponent(productId)}&seller_id=eq.${encodeURIComponent(sellerId)}&status=eq.active&limit=1`,
      ),
      "product_unavailable",
    );

    if (product.stock <= 0) {
      throw new Error("product_unavailable");
    }

    const courier = one(
      await dbRequest<CourierRow[]>(
        `warilo_couriers?select=id,delivery_fee_fcfa,yapalaan_commission_fcfa,status&id=eq.${encodeURIComponent(courierId)}&status=eq.active&limit=1`,
      ),
      "courier_unavailable",
    );

    const totalAmountFcfa = product.price_fcfa + courier.delivery_fee_fcfa;
    const orders = await dbRequest<OrderRow[]>("warilo_orders", {
      method: "POST",
      body: JSON.stringify({
        buyer_id: buyerId,
        seller_id: sellerId,
        courier_id: courierId,
        total_amount_fcfa: totalAmountFcfa,
        delivery_fee_fcfa: courier.delivery_fee_fcfa,
        delivery_commission_fcfa: courier.yapalaan_commission_fcfa ?? 0,
        delivery_commune: buyerLocation,
        delivery_landmark: buyerLocation,
        delivery_notes: deliveryContact.deliveryInstructions ?? "",
        buyer_phone: buyerPhone,
        buyer_whatsapp: buyerWhatsapp,
        buyer_email: deliveryContact.email ?? "",
        buyer_location_label: buyerLocation,
        buyer_latitude: deliveryContact.latitude ?? null,
        buyer_longitude: deliveryContact.longitude ?? null,
        payment_method: paymentMethod,
        status: "pending_payment",
      }),
    });
    const order = one(orders, "order_not_created");

    await dbRequest("warilo_order_items", {
      method: "POST",
      body: JSON.stringify({
        order_id: order.id,
        product_id: product.id,
        quantity: 1,
        unit_price_fcfa: product.price_fcfa,
      }),
    });

    return json({
      id: order.id,
      total_amount_fcfa: order.total_amount_fcfa,
      status: order.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    const status = message.endsWith("_required") ? 400 : 422;

    return json({ error: message }, status);
  }
});
