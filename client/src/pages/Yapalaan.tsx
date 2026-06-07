import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  BadgeCheck,
  Bell,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Calculator,
  Heart,
  Home,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Mic,
  PackageCheck,
  Palette,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Truck,
  User,
} from "lucide-react";
import { activeWariloSource, getWariloDemoData } from "@/lib/warilo/dataSource";
import { formatFcfa } from "@shared/warilo";
import type { WariloBuyerDeliveryContact, WariloCourier, WariloDemoData, WariloProduct, WariloSellerProfile } from "@shared/warilo";

type Screen = "home" | "product" | "shop" | "import" | "sell" | "checkout" | "orders" | "settings";
type YapalaanThemeId = "forest" | "marine" | "terracotta" | "olive" | "prune" | "turquoise" | "noir-or" | "orange";
type YapalaanOrder = {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  sellerName: string;
  courierId: string;
  courierName: string;
  courierPhone: string;
  courierRating: number;
  courierRatingsCount: number;
  deliveryCommissionFcfa: number;
  deliveryLabel: string;
  paymentMethod: string;
  totalAmountFcfa: number;
  status: "pending_payment" | "paid" | "accepted" | "in_delivery" | "delivered";
  paymentStatus: "test_success" | "test_failed" | "cash_on_delivery";
  escrowStatus: "held" | "released" | "refund_requested";
  disputeStatus: "none" | "opened";
  createdAtLabel: string;
};

const appName = "Yapalaan";
const appTagline = "Le marché qui rapproche.";
const unifiedLogoSrc = "/assets/yapalaan-logo-unified.png";
const unifiedLogoIconSrc = "/assets/yapalaan-logo-icon.png";
const saleCommissionRate = 0.05;
const importServiceRate = 0.1;
const importMinimumFeeFcfa = 5000;

const yapalaanThemes: Array<{
  id: YapalaanThemeId;
  label: string;
  iconSrc: string;
  logoSrc: string;
  colors: Record<string, string>;
}> = [
  {
    id: "forest",
    label: "Vert forêt & or",
    iconSrc: unifiedLogoIconSrc,
    logoSrc: unifiedLogoSrc,
    colors: {
      "--yapa-ink": "#103d2a",
      "--yapa-primary": "#ff6a2e",
      "--yapa-primary-text": "#102116",
      "--yapa-accent": "#f9881a",
      "--yapa-page": "#fff4ea",
      "--yapa-bg": "#fff8ee",
      "--yapa-soft": "#ffe0cf",
    },
  },
  {
    id: "marine",
    label: "Bleu marine & ciel",
    iconSrc: unifiedLogoIconSrc,
    logoSrc: unifiedLogoSrc,
    colors: {
      "--yapa-ink": "#0b3858",
      "--yapa-primary": "#5db3df",
      "--yapa-primary-text": "#071e30",
      "--yapa-accent": "#9dd8f4",
      "--yapa-page": "#edf7ff",
      "--yapa-bg": "#f7fcff",
      "--yapa-soft": "#dff1fb",
    },
  },
  {
    id: "terracotta",
    label: "Brun terre & terracotta",
    iconSrc: unifiedLogoIconSrc,
    logoSrc: unifiedLogoSrc,
    colors: {
      "--yapa-ink": "#5a2b07",
      "--yapa-primary": "#d85d31",
      "--yapa-primary-text": "#2d1203",
      "--yapa-accent": "#e4744d",
      "--yapa-page": "#fff3ec",
      "--yapa-bg": "#fff8f3",
      "--yapa-soft": "#f5d8c5",
    },
  },
  {
    id: "olive",
    label: "Vert olive & citron",
    iconSrc: unifiedLogoIconSrc,
    logoSrc: unifiedLogoSrc,
    colors: {
      "--yapa-ink": "#286532",
      "--yapa-primary": "#a8b71c",
      "--yapa-primary-text": "#162511",
      "--yapa-accent": "#c1cc2d",
      "--yapa-page": "#f6faeb",
      "--yapa-bg": "#fbfdf4",
      "--yapa-soft": "#e6edb6",
    },
  },
  {
    id: "prune",
    label: "Prune & lilas",
    iconSrc: unifiedLogoIconSrc,
    logoSrc: unifiedLogoSrc,
    colors: {
      "--yapa-ink": "#3b2453",
      "--yapa-primary": "#b58ab3",
      "--yapa-primary-text": "#251433",
      "--yapa-accent": "#c9a4c3",
      "--yapa-page": "#fbf3fb",
      "--yapa-bg": "#fff8ff",
      "--yapa-soft": "#ead8eb",
    },
  },
  {
    id: "turquoise",
    label: "Bleu canard & turquoise",
    iconSrc: unifiedLogoIconSrc,
    logoSrc: unifiedLogoSrc,
    colors: {
      "--yapa-ink": "#0d7a78",
      "--yapa-primary": "#47bec5",
      "--yapa-primary-text": "#062c2d",
      "--yapa-accent": "#6fd1d3",
      "--yapa-page": "#effafa",
      "--yapa-bg": "#f8ffff",
      "--yapa-soft": "#d9f3f3",
    },
  },
  {
    id: "noir-or",
    label: "Noir & or",
    iconSrc: unifiedLogoIconSrc,
    logoSrc: unifiedLogoSrc,
    colors: {
      "--yapa-ink": "#202020",
      "--yapa-primary": "#e7a91c",
      "--yapa-primary-text": "#171717",
      "--yapa-accent": "#f4bd2f",
      "--yapa-page": "#f8f5ed",
      "--yapa-bg": "#fffaf0",
      "--yapa-soft": "#f4dfaa",
    },
  },
  {
    id: "orange",
    label: "Orange du print",
    iconSrc: unifiedLogoIconSrc,
    logoSrc: unifiedLogoSrc,
    colors: {
      "--yapa-ink": "#101010",
      "--yapa-primary": "#ff6a2e",
      "--yapa-primary-text": "#101010",
      "--yapa-accent": "#f9881a",
      "--yapa-page": "#fff4ea",
      "--yapa-bg": "#fff7ee",
      "--yapa-soft": "#ffd9af",
    },
  },
];

const YapalaanThemeContext = createContext(yapalaanThemes[0]);
const themeStorageKey = "yapalaan-theme-v2";

function getInitialYapalaanThemeId(): YapalaanThemeId {
  if (typeof window === "undefined") {
    return "orange";
  }

  const savedThemeId = window.localStorage.getItem(themeStorageKey);
  return yapalaanThemes.some((theme) => theme.id === savedThemeId) ? (savedThemeId as YapalaanThemeId) : "orange";
}

const fallbackWariloDemo = getWariloDemoData();
const WariloDataContext = createContext<WariloDemoData>(fallbackWariloDemo);
const ProductSelectionContext = createContext<{
  selectedProductId: string | null;
  setSelectedProductId: (productId: string) => void;
}>({
  selectedProductId: null,
  setSelectedProductId: () => undefined,
});
const ProductInventoryContext = createContext<{
  setProductAvailability: (productId: string, availability: WariloProduct["availability"]) => void;
  publishProduct: (product: WariloProduct) => void;
  updateProduct: (productId: string, updates: Partial<WariloProduct>) => void;
}>({
  setProductAvailability: () => undefined,
  publishProduct: () => undefined,
  updateProduct: () => undefined,
});
const SellerProfileContext = createContext<{
  updateSellerProfile: (updates: Partial<WariloSellerProfile>) => void;
}>({
  updateSellerProfile: () => undefined,
});
const OrdersContext = createContext<{
  orders: YapalaanOrder[];
  addOrder: (order: YapalaanOrder) => void;
  rateOrderCourier: (orderId: string, rating: number) => void;
}>({
  orders: [],
  addOrder: () => undefined,
  rateOrderCourier: () => undefined,
});
const CourierAdminContext = createContext<{
  addDemoCourier: () => void;
  removeCourier: (courierId: string) => void;
  updateCourier: (courierId: string, updates: Partial<WariloCourier>) => void;
  rateCourier: (courierId: string, rating: number) => void;
}>({
  addDemoCourier: () => undefined,
  removeCourier: () => undefined,
  updateCourier: () => undefined,
  rateCourier: () => undefined,
});

function useWariloData() {
  const data = useContext(WariloDataContext);
  const { selectedProductId } = useContext(ProductSelectionContext);
  const selectedProduct = data.products.find((product) => product.id === selectedProductId);
  const featuredProduct = selectedProduct ?? data.products.find((product) => product.availability === "available") ?? data.products[0] ?? fallbackWariloDemo.products[0];
  const activeCouriers = data.couriers.filter((courier) => (courier.availabilityStatus ?? "active") === "active");

  return {
    ...data,
    deliveryOptions: activeCouriers.length > 0 ? activeCouriers : fallbackWariloDemo.couriers,
    allCouriers: data.couriers,
    featuredProduct,
    seller: data.seller ?? fallbackWariloDemo.seller,
  };
}

const navItems: Array<{ id: Screen; label: string; icon: typeof Home }> = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "shop", label: "Marché", icon: Store },
  { id: "import", label: "Import", icon: PackageCheck },
  { id: "orders", label: "Suivi", icon: ShoppingBag },
  { id: "sell", label: "Vendre", icon: User },
];

function YapalaanLogo({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const theme = useContext(YapalaanThemeContext);

  if (compact) {
    return (
      <div className="inline-flex h-28 w-[86%] shrink-0 items-center justify-center">
        <img src={theme.logoSrc} alt={`${appName} logo`} className="h-28 w-full shrink-0 object-contain object-center" />
      </div>
    );
  }

  return (
    <div className="inline-flex max-w-full shrink-0 items-center">
      <div className="min-w-0">
        <img src={theme.logoSrc} alt={`${appName} logo`} className="h-28 w-[380px] max-w-full object-contain object-center" />
        <p className="mt-1 text-[10px] font-black uppercase leading-none text-[#1d2b22]/60">{appTagline}</p>
      </div>
    </div>
  );
}

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex h-8 items-center justify-between px-5 text-[11px] font-black ${dark ? "text-white" : "text-[var(--yapa-ink)]"}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <span className={`h-2.5 w-4 rounded-[3px] border ${dark ? "border-white" : "border-[var(--yapa-ink)]"}`} />
        <span className={`h-2.5 w-3 rounded-[3px] ${dark ? "bg-white" : "bg-[var(--yapa-ink)]"}`} />
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  return (
    <nav className="absolute inset-x-2 bottom-3 z-20 rounded-[26px] border border-white/40 bg-white/82 px-1.5 py-2 shadow-[0_18px_40px_rgba(14,19,17,0.18)] backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setScreen(item.id)}
              className={`flex h-[52px] min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] px-1 text-[8px] font-black leading-none transition ${
                active ? "bg-[var(--yapa-ink)] text-white" : "text-[#627067]"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="block w-full truncate text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function PhoneShell({ screen, setScreen, children, dark = false }: { screen: Screen; setScreen: (screen: Screen) => void; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="relative mx-auto h-[844px] w-full max-w-[390px] overflow-hidden rounded-[42px] border-[10px] border-[var(--yapa-ink)] bg-[var(--yapa-bg)] shadow-[0_28px_80px_rgba(17,24,22,0.34)]">
      <div className={`absolute inset-x-28 top-0 z-30 h-6 rounded-b-2xl ${dark ? "bg-[var(--yapa-ink)]" : "bg-[var(--yapa-ink)]"}`} />
      <StatusBar dark={dark} />
      {children}
      <BottomNav screen={screen} setScreen={setScreen} />
    </div>
  );
}

function TrustPill({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-black text-white">
      <Icon className="size-4 text-[var(--yapa-primary)]" />
      {label}
    </div>
  );
}

function ProductImage({
  product,
  className,
  mode = "contain",
}: {
  product: WariloProduct;
  className: string;
  mode?: "contain" | "cover";
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`${className} grid place-items-center bg-white text-center`}>
        <div className="px-3">
          <ShoppingBag className="mx-auto mb-2 size-7 text-[var(--yapa-primary)]" />
          <p className="text-[10px] font-black leading-4 text-[var(--yapa-ink)]">{product.short}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={product.imageUrl}
      alt={product.name}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${className} bg-white ${mode === "contain" ? "object-contain" : "object-cover"}`}
    />
  );
}

function getProductPurchaseInfo(product: WariloProduct) {
  const isShoe = product.productType === "shoes" || product.category === "Sport" || product.name.toLowerCase().includes("shoe") || product.name.toLowerCase().includes("basket");
  const isWatch = product.productType === "watch" || product.category === "Montres" || product.name.toLowerCase().includes("montre") || product.name.toLowerCase().includes("watch");
  const estimate = product.estimatedMarketPriceFcfa ?? product.oldPriceFcfa;
  const brand = product.brand ?? product.name.split(" montre")[0].split(" watch")[0].split(" Spikeless")[0];
  const condition = product.condition ?? "Neuf";
  const authenticityNote = product.authenticityNote ?? "Vérification Yapalaan";

  if (isShoe) {
    return {
      meta: ["Chaussures", "Taille disponible", `${Math.max(product.stock, 1)} en stock`],
      subtitle: product.id === "product_adidas_gazelle_lux_blue" ? "Taille unique 42" : "Pointures disponibles selon stock",
      sectionTitle: "Pointure",
      actionLabel: "Guide des tailles",
      options: ["40", "41", "42", "43", "44", "45"],
      selectedOption: product.id === "product_adidas_gazelle_lux_blue" ? "42" : "42",
      details: [
        { label: "État", value: condition },
        { label: "Authenticité", value: authenticityNote },
        { label: "Usage", value: product.purchaseNote ?? "Confort quotidien et tenue sportive" },
      ],
      history: product.purchaseNote ?? product.description ?? "Produit sélectionné par l'équipe Yapalaan après contrôle de disponibilité et de cohérence du prix.",
      estimate,
    };
  }

  if (isWatch) {
    return {
      meta: ["Montre", "Taille unique", `${Math.max(product.stock, 1)} en stock`],
      subtitle: "Taille unique - Bracelet ajustable selon le modèle",
      sectionTitle: "Informations utiles",
      actionLabel: "Voir garanties",
      options: [],
      selectedOption: "",
      details: [
        { label: "Marque", value: brand },
        { label: "État", value: condition },
        { label: "Authenticité", value: authenticityNote },
      ],
      history: product.purchaseNote ?? product.description ?? `${brand} est sélectionnée pour son style reconnu et son positionnement accessible. Ce modèle convient aux tenues habillées comme au quotidien.`,
      estimate,
    };
  }

  return {
    meta: [product.category, "Produit vérifié", `${Math.max(product.stock, 1)} en stock`],
    subtitle: "Produit vérifié par l'équipe Yapalaan",
    sectionTitle: "Informations utiles",
    actionLabel: "Voir détails",
    options: [],
      selectedOption: "",
      details: [
        { label: "Catégorie", value: product.category },
        { label: "État", value: condition },
        { label: "Authenticité", value: authenticityNote },
      ],
    history: product.purchaseNote ?? product.description ?? "Produit ajouté par l'équipe Yapalaan après contrôle de disponibilité et de cohérence du prix.",
    estimate,
  };
}

function getSavingsPercent(product: WariloProduct, estimate?: number) {
  const referencePrice = estimate && estimate > product.priceFcfa ? estimate : product.oldPriceFcfa;
  if (!referencePrice || referencePrice <= product.priceFcfa) return null;
  return Math.round(((referencePrice - product.priceFcfa) / referencePrice) * 100);
}

function getCourierCommission(courier: WariloCourier) {
  return courier.yapalaanCommissionFcfa ?? Math.max(300, Math.round(courier.deliveryFeeFcfa * 0.12));
}

function getTrustScore(seller: WariloSellerProfile) {
  let score = 50;
  if (seller.verificationStatus === "verified") score += 20;
  if (seller.phone) score += 8;
  if (seller.whatsapp) score += 8;
  if (seller.locationLabel) score += 8;
  if (seller.rating >= 4.5) score += 6;

  return Math.min(100, score);
}

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filterProducts(products: WariloProduct[], availability: WariloProduct["availability"], query: string, category: string) {
  const normalizedQuery = normalizeSearch(query.trim());

  return products.filter((product) => {
    const matchesAvailability = product.availability === availability;
    const matchesCategory = category === "Toutes" || product.category === category;
    const searchableText = normalizeSearch(`${product.name} ${product.short} ${product.category} ${product.tag}`);
    const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return matchesAvailability && matchesCategory && matchesQuery;
  });
}

function getOrderStatusLabel(status: YapalaanOrder["status"]) {
  const labels: Record<YapalaanOrder["status"], string> = {
    pending_payment: "Paiement en attente",
    paid: "Payée",
    accepted: "Acceptée",
    in_delivery: "En livraison",
    delivered: "Livrée",
  };

  return labels[status];
}

function getDemoGeoLabel() {
  return "5.3599, -4.0083 - Cocody Riviera";
}

function ThemePicker({
  selectedThemeId,
  onSelectTheme,
  compact = false,
}: {
  selectedThemeId: YapalaanThemeId;
  onSelectTheme: (themeId: YapalaanThemeId) => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "rounded-[24px] bg-white/10 p-3" : "rounded-[28px] bg-white p-4 shadow-[0_12px_30px_rgba(17,24,22,.08)]"}>
      <div className="mb-3 flex items-center gap-2">
        <Palette className={compact ? "size-4 text-white" : "size-4 text-[var(--yapa-primary)]"} />
        <p className={compact ? "text-xs font-black text-white" : "text-xs font-black text-[var(--yapa-ink)]"}>Couleur de l'app</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {yapalaanThemes.map((theme) => {
          const selected = selectedThemeId === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`grid h-14 place-items-center rounded-[18px] border bg-white p-1 text-[0] transition ${
                selected ? "border-[var(--yapa-primary)] bg-white" : "border-white/20 bg-white/20"
              }`}
              aria-label={`Choisir la couleur ${theme.label}`}
              title={theme.label}
            >
              <img src={theme.iconSrc} alt="" className="h-8 w-full object-contain" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HomeScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const { categories, products } = useWariloData();
  const { setSelectedProductId } = useContext(ProductSelectionContext);
  const [availabilityFilter, setAvailabilityFilter] = useState<WariloProduct["availability"]>("available");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const visibleProducts = filterProducts(products, availabilityFilter, query, selectedCategory);
  const categoryOptions = ["Toutes", ...categories];

  return (
    <PhoneShell screen="home" setScreen={setScreen} dark>
      <div className="absolute inset-0 bg-[var(--yapa-ink)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(135deg,rgba(247,160,74,.35)_0_10%,transparent_10%_20%,rgba(53,213,139,.28)_20%_30%,transparent_30%_40%),linear-gradient(45deg,transparent_0_48%,rgba(255,255,255,.16)_48%_52%,transparent_52%_100%)] [background-size:42px_42px,28px_28px]" />
      <div className="relative z-10 h-[calc(100%-32px)] overflow-y-auto px-5 pb-28 pt-0 text-white">
        <header className="relative -mt-3 flex h-28 items-start justify-center pl-0 pr-14">
          <YapalaanLogo compact dark />
          <button onClick={() => setScreen("settings")} className="absolute right-0 top-4 grid size-10 place-items-center rounded-full bg-white/10">
            <Bell className="size-5" />
          </button>
        </header>

        <label className="mt-1 flex h-14 items-center gap-3 rounded-[24px] border border-white/12 bg-white/10 px-4 backdrop-blur">
          <Search className="size-5 text-white/70" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cherche un produit ou un vendeur"
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white placeholder:text-white/58 focus:outline-none"
          />
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-[22px] bg-white/10 p-1">
          {[
            ["available", "Disponibles"],
            ["sold", "Vendus"],
          ].map(([status, label]) => (
            <button
              key={status}
              onClick={() => setAvailabilityFilter(status as WariloProduct["availability"])}
              className={`h-10 rounded-[18px] text-xs font-black ${availabilityFilter === status ? "bg-white text-[var(--yapa-ink)]" : "text-white/70"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="pt-8">
          <h1 className="text-[44px] font-black leading-[0.92] tracking-normal">
            Le marché qui rapproche.
          </h1>
          <p className="mt-4 max-w-[290px] text-[15px] font-semibold leading-6 text-white/70">
            Produits vérifiés, vendeurs contrôlés, livreurs comparables et paiement sécurisé pour acheter local sans peur.
          </p>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setScreen("product")} className="h-11 rounded-full bg-[var(--yapa-accent)] px-4 text-xs font-black text-[var(--yapa-ink)]">
              Découvrir les offres
            </button>
            <button onClick={() => setScreen("sell")} className="h-11 rounded-full border border-white/20 px-4 text-xs font-black">
              Devenir vendeur
            </button>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-2">
          <TrustPill icon={LockKeyhole} label="Paiement protégé" />
          <TrustPill icon={BadgeCheck} label="Vendeur vérifié" />
          <TrustPill icon={Truck} label="Suivi en direct" />
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-[28px] bg-white p-4 text-[var(--yapa-ink)]">
            <p className="text-3xl font-black">10</p>
            <p className="text-xs font-black text-[#69746d]">Produits vérifiés</p>
            <p className="mt-2 text-[10px] font-bold text-[#8a918c]">Stock initial Yapalaan</p>
          </div>
          <div className="rounded-[28px] bg-[var(--yapa-primary)] p-4 text-[var(--yapa-primary-text)]">
            <p className="text-3xl font-black">12</p>
            <p className="text-xs font-black">Livreurs listés</p>
            <p className="mt-2 text-[10px] font-bold text-[#14583f]">Coût affiché avant achat</p>
          </div>
        </section>

        <section className="mt-4 rounded-[30px] bg-white/10 p-4">
          <p className="text-sm font-black">Pourquoi acheter ici ?</p>
          <div className="mt-3 grid gap-2">
            {[
              ["Produit contrôlé", "Prix, état et disponibilité sont affichés avant paiement."],
              ["Livreur au choix", "Tu vois le coût estimé et la note du livreur avant de commander."],
              ["Protection achat", "Le suivi, le litige et l'avis restent disponibles après commande."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[22px] bg-white/10 p-3">
                <p className="text-xs font-black">{title}</p>
                <p className="mt-1 text-[10px] font-bold leading-4 text-white/62">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[32px] bg-[var(--yapa-soft)] p-4 text-[var(--yapa-ink)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-black">Vente flash</p>
              <p className="text-xs font-bold text-[#68726a]">Se termine dans</p>
            </div>
            <div className="rounded-full bg-[var(--yapa-ink)] px-3 py-1.5 text-xs font-black text-white">02:18:09</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {visibleProducts.slice(0, 2).map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProductId(product.id);
                  setScreen("product");
                }}
                className="text-left"
              >
                <div className="relative aspect-[0.78] overflow-hidden rounded-[24px] bg-white">
                  <ProductImage product={product} className="h-full w-full" />
                  <span className="absolute left-2 top-2 rounded-full bg-[var(--yapa-accent)] px-2 py-1 text-[10px] font-black">{product.tag}</span>
                  {product.availability === "sold" ? <span className="absolute inset-x-3 bottom-3 rounded-full bg-black/72 py-2 text-center text-[10px] font-black text-white">VENDU</span> : null}
                </div>
                <p className="mt-2 text-xs font-black">{product.short}</p>
                <p className="text-[11px] font-black text-[var(--yapa-primary)]">{formatFcfa(product.priceFcfa)}</p>
              </button>
            ))}
          </div>
          {visibleProducts.length === 0 ? <p className="mt-4 text-xs font-black text-[#5d6a61]">Aucun article dans ce statut pour le moment.</p> : null}
        </section>

        <section className="mt-4 rounded-[30px] bg-white/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black">Catégories</p>
            <ChevronRight className="size-4 text-white/60" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`h-16 rounded-[22px] px-1 text-xs font-black ${selectedCategory === category ? "bg-white text-[var(--yapa-ink)]" : "bg-white/10 text-white"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
      </div>
    </PhoneShell>
  );
}

function ProductScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const { featuredProduct, seller } = useWariloData();
  const purchaseInfo = getProductPurchaseInfo(featuredProduct);
  const savingsPercent = getSavingsPercent(featuredProduct, purchaseInfo.estimate);
  const referencePrice = purchaseInfo.estimate && purchaseInfo.estimate > featuredProduct.priceFcfa ? purchaseInfo.estimate : featuredProduct.oldPriceFcfa;
  const trustScore = getTrustScore(seller);

  return (
    <PhoneShell screen="product" setScreen={setScreen}>
      <div className="h-[calc(100%-32px)] overflow-y-auto pb-28">
        <div className="relative h-[460px] bg-white">
          <ProductImage product={featuredProduct} className="h-full w-full" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
            <button onClick={() => setScreen("home")} className="grid size-10 place-items-center rounded-full bg-white/88">
              <ChevronLeft className="size-5" />
            </button>
            <button className="grid size-10 place-items-center rounded-full bg-white/88">
              <Heart className="size-5" />
            </button>
          </div>
          <div className="absolute bottom-4 right-4 rounded-full bg-[var(--yapa-ink)]/84 px-3 py-1.5 text-xs font-black text-white">1 / 5</div>
          <div className="absolute bottom-4 left-4 rounded-full bg-white/88 px-3 py-1.5 text-[10px] font-black text-[var(--yapa-ink)]">TOUCHER POUR ZOOMER</div>
          {featuredProduct.availability === "sold" ? <div className="absolute inset-x-8 top-24 rounded-full bg-black/72 py-3 text-center text-sm font-black text-white">ARTICLE VENDU</div> : null}
        </div>

        <section className="-mt-8 rounded-t-[38px] bg-[var(--yapa-bg)] px-5 pb-6 pt-6">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#7a6b52]">
            {purchaseInfo.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <h2 className="text-[28px] font-black leading-[1.05] text-[var(--yapa-ink)]">{featuredProduct.name}</h2>
          <p className="mt-1 text-sm font-bold text-[#6a746d]">{purchaseInfo.subtitle}</p>
          {featuredProduct.description ? (
            <p className="mt-3 text-sm font-bold leading-6 text-[#56625a]">{featuredProduct.description}</p>
          ) : null}

          <div className="mt-4 flex items-end gap-3">
            <p className="text-[30px] font-black text-[var(--yapa-ink)]">{formatFcfa(featuredProduct.priceFcfa)}</p>
            {referencePrice ? (
              <p className="pb-1 text-sm font-black text-[#a39077] line-through">{formatFcfa(referencePrice)}</p>
            ) : null}
            {savingsPercent ? <span className="mb-1 rounded-full bg-[var(--yapa-accent)] px-2 py-1 text-[10px] font-black text-[var(--yapa-ink)]">-{savingsPercent}%</span> : null}
          </div>
          {referencePrice ? (
            <p className="mt-1 text-xs font-bold text-[#6a746d]">
              Prix estimé ailleurs : {formatFcfa(referencePrice)}. Notre prix te fait économiser environ {formatFcfa(referencePrice - featuredProduct.priceFcfa)}.
            </p>
          ) : null}

          <div className="mt-4 rounded-[24px] border border-[var(--yapa-primary)]/35 bg-[var(--yapa-soft)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-[#0b5f42]">Argent sécurisé jusqu'à la livraison</p>
                <p className="text-xs font-bold text-[#4b6f61]">Le vendeur reçoit l'argent après ta confirmation</p>
              </div>
              <span className="rounded-full bg-[var(--yapa-primary)] px-3 py-1.5 text-[10px] font-black text-[var(--yapa-primary-text)]">PROTÉGÉ</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black">{purchaseInfo.sectionTitle}</p>
              <button className="text-xs font-black text-[var(--yapa-primary)]">{purchaseInfo.actionLabel}</button>
            </div>
            {purchaseInfo.options.length > 0 ? (
              <div className="mt-3 grid grid-cols-6 gap-2">
                {purchaseInfo.options.map((size) => (
                  <button key={size} className={`h-11 rounded-[18px] text-sm font-black ${size === purchaseInfo.selectedOption ? "bg-[var(--yapa-ink)] text-white" : "bg-white text-[var(--yapa-ink)]"}`}>
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-3 grid gap-2">
                {purchaseInfo.details.map((detail) => (
                  <div key={detail.label} className="flex items-start justify-between gap-3 rounded-[20px] bg-white px-4 py-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7659]">{detail.label}</span>
                    <span className="max-w-[190px] text-right text-xs font-black leading-5 text-[var(--yapa-ink)]">{detail.value}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 rounded-[22px] bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">Bref historique</p>
              <p className="mt-2 text-xs font-bold leading-5 text-[#56625a]">{purchaseInfo.history}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[26px] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-[var(--yapa-ink)] text-lg font-black text-white">K</div>
              <div className="flex-1">
                <p className="font-black">{seller.storeName}</p>
                <p className="text-xs font-bold text-[#6d766f]">{seller.trustLevel}</p>
              </div>
              <div className="text-right">
                <p className="flex items-center gap-1 text-sm font-black">
                  <Star className="size-4 fill-[var(--yapa-accent)] text-[var(--yapa-accent)]" />
                  {seller.rating.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}
                </p>
                <p className="text-[10px] font-bold text-[#7d857f]">{seller.reviewCount} avis</p>
              </div>
            </div>
            <div className="mt-4 rounded-[22px] bg-[var(--yapa-bg)] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">Score confiance</p>
                <p className="text-sm font-black text-[var(--yapa-ink)]">{trustScore}/100</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[var(--yapa-primary)]" style={{ width: `${trustScore}%` }} />
              </div>
              <p className="mt-2 text-[11px] font-bold leading-5 text-[#69746d]">Téléphone, WhatsApp, géolocalisation, avis et contrôle Yapalaan.</p>
            </div>
          </div>

          <button
            onClick={() => featuredProduct.availability === "available" && setScreen("checkout")}
            disabled={featuredProduct.availability === "sold"}
            className="mt-5 h-14 w-full rounded-[24px] bg-[var(--yapa-ink)] text-sm font-black text-white shadow-[0_14px_28px_rgba(17,24,22,.24)] disabled:opacity-55"
          >
            {featuredProduct.availability === "sold" ? "Article vendu" : "Acheter avec paiement protégé"}
          </button>
        </section>
      </div>
    </PhoneShell>
  );
}

function ShopScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const { categories, products, seller } = useWariloData();
  const { setSelectedProductId } = useContext(ProductSelectionContext);
  const [availabilityFilter, setAvailabilityFilter] = useState<WariloProduct["availability"]>("available");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [isFollowing, setIsFollowing] = useState(false);
  const [sortMode, setSortMode] = useState<"recent" | "price-asc" | "price-desc">("recent");
  const visibleProducts = filterProducts(products, availabilityFilter, query, selectedCategory).sort((a, b) => {
    if (sortMode === "price-asc") return a.priceFcfa - b.priceFcfa;
    if (sortMode === "price-desc") return b.priceFcfa - a.priceFcfa;
    return 0;
  });
  const categoryOptions = ["Toutes", ...categories];
  const nextSortMode = () => {
    setSortMode((current) => {
      if (current === "recent") return "price-asc";
      if (current === "price-asc") return "price-desc";
      return "recent";
    });
  };
  const sortLabel = sortMode === "recent" ? "Trier" : sortMode === "price-asc" ? "Prix +" : "Prix -";
  const trustScore = getTrustScore(seller);

  return (
    <PhoneShell screen="shop" setScreen={setScreen}>
      <div className="h-[calc(100%-32px)] overflow-y-auto bg-[var(--yapa-bg)] pb-28">
        <section className="relative overflow-hidden bg-[var(--yapa-ink)] px-5 pb-8 pt-4 text-white">
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(135deg,rgba(247,160,74,.4)_0_12%,transparent_12%_24%,rgba(53,213,139,.32)_24%_36%,transparent_36%_48%)] [background-size:46px_46px]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <button onClick={() => setScreen("product")} className="grid size-10 place-items-center rounded-full bg-white/10">
                <ChevronLeft className="size-5" />
              </button>
              <button onClick={() => setIsFollowing((current) => !current)} className="rounded-full bg-[var(--yapa-primary)] px-4 py-2 text-xs font-black text-[var(--yapa-primary-text)]">
                {isFollowing ? "Suivi" : "Suivre"}
              </button>
            </div>
            <div className="mt-10 flex items-end gap-3">
              <div className="grid size-20 place-items-center rounded-[28px] bg-[var(--yapa-accent)] text-3xl font-black text-[var(--yapa-ink)]">K</div>
              <div>
                <p className="text-[30px] font-black leading-none">{seller.storeName}</p>
                <p className="mt-1 text-xs font-bold text-white/66">yapalaan.ci/{seller.slug}</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-white/70">Ouvert maintenant - Ferme à 21 h</p>
            <div className="mt-3 flex flex-wrap gap-2">
            {["Boutique officielle", "Sport", "Produits vérifiés"].map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="-mt-5 mx-5 rounded-[28px] bg-white p-4 shadow-[0_16px_34px_rgba(17,24,22,.12)]">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              [products.length.toString(), "Produits"],
              [seller.rating.toLocaleString("fr-FR", { maximumFractionDigits: 1 }), "Note"],
              [seller.reviewCount.toString(), "Avis pilotes"],
              ["12", "Livreurs"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-lg font-black">{value}</p>
                <p className="text-[9px] font-bold text-[#788078]">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 text-xs font-bold text-[#4c5d54]">
            <p className="flex items-center gap-2"><BadgeCheck className="size-4 text-[var(--yapa-primary)]" /> Boutique officielle Yapalaan</p>
            <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-[var(--yapa-primary)]" /> Produits contrôlés avant remise au livreur</p>
            <p className="flex items-center gap-2"><MapPin className="size-4 text-[var(--yapa-primary)]" /> Géolocalisation boutique fournie</p>
            <p className="flex items-center gap-2"><LockKeyhole className="size-4 text-[var(--yapa-primary)]" /> Score confiance : {trustScore}/100</p>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="flex items-center gap-2 border-b border-[#e3d8c6] text-sm font-black">
            {["Boutique", "Nouveautés", "Promos", "Avis"].map((tab, index) => (
              <button key={tab} className={`pb-3 ${index === 0 ? "border-b-2 border-[var(--yapa-ink)] text-[var(--yapa-ink)]" : "text-[#8b8e86]"}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs font-black text-[#69746d]">{visibleProducts.length} produits</p>
            <button onClick={nextSortMode} className="rounded-full bg-white px-3 py-1.5 text-xs font-black">{sortLabel}</button>
          </div>
          <label className="mt-3 flex h-12 items-center gap-3 rounded-[22px] bg-white px-4">
            <Search className="size-4 text-[#7b857d]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher dans la boutique"
              className="min-w-0 flex-1 bg-transparent text-xs font-bold text-[var(--yapa-ink)] placeholder:text-[#8a928c] focus:outline-none"
            />
          </label>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`h-9 shrink-0 rounded-full px-3 text-[10px] font-black ${
                  selectedCategory === category ? "bg-[var(--yapa-ink)] text-white" : "bg-white text-[#6f786f]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-[22px] bg-white p-1">
            {[
              ["available", "Disponibles"],
              ["sold", "Vendus"],
            ].map(([status, label]) => (
              <button
                key={status}
                onClick={() => setAvailabilityFilter(status as WariloProduct["availability"])}
                className={`h-10 rounded-[18px] text-xs font-black ${availabilityFilter === status ? "bg-[var(--yapa-ink)] text-white" : "text-[#6f786f]"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {visibleProducts.map((product, index) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProductId(product.id);
                  setScreen("product");
                }}
                className={`text-left ${index % 2 ? "pt-5" : ""}`}
              >
                <div className="relative overflow-hidden rounded-[24px] bg-white">
                  <ProductImage product={product} className="aspect-[0.86] w-full" />
                  <span className="absolute left-2 top-2 rounded-full bg-[var(--yapa-accent)] px-2 py-1 text-[10px] font-black text-[var(--yapa-ink)]">{product.tag}</span>
                  {product.availability === "sold" ? <span className="absolute inset-x-3 bottom-3 rounded-full bg-black/72 py-2 text-center text-[10px] font-black text-white">VENDU</span> : null}
                </div>
                <p className="mt-2 text-xs font-black">{product.short}</p>
                <p className="text-[11px] font-black text-[var(--yapa-primary)]">{formatFcfa(product.priceFcfa)}</p>
              </button>
            ))}
          </div>
          {visibleProducts.length === 0 ? <p className="mt-4 text-xs font-black text-[#69746d]">Aucun produit dans ce statut.</p> : null}
        </section>

        <button className="absolute bottom-24 right-5 grid size-14 place-items-center rounded-full bg-[var(--yapa-primary)] text-[var(--yapa-primary-text)] shadow-[0_16px_30px_rgba(17,24,22,.2)]">
          <MessageCircle className="size-6" />
        </button>
      </div>
    </PhoneShell>
  );
}

function SellScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const { featuredProduct, seller, products } = useWariloData();
  const { setSelectedProductId } = useContext(ProductSelectionContext);
  const { publishProduct, setProductAvailability, updateProduct } = useContext(ProductInventoryContext);
  const { updateSellerProfile } = useContext(SellerProfileContext);
  const { orders } = useContext(OrdersContext);
  const [sellerSession, setSellerSession] = useState(false);
  const [sellerPhone, setSellerPhone] = useState(seller.phone);
  const [sellerOtp, setSellerOtp] = useState("");
  const [shopName, setShopName] = useState(seller.storeName);
  const [shopCommune, setShopCommune] = useState(seller.commune);
  const [shopLocation, setShopLocation] = useState(seller.locationLabel);
  const [shopWhatsapp, setShopWhatsapp] = useState(seller.whatsapp);
  const [shopEmail, setShopEmail] = useState(seller.email);
  const [draftName, setDraftName] = useState("Nouveau produit Yapalaan");
  const [draftCategory, setDraftCategory] = useState("Montres");
  const [draftPrice, setDraftPrice] = useState("75000");
  const [draftStock, setDraftStock] = useState("1");
  const [draftDescription, setDraftDescription] = useState("Produit vérifié, disponible à Abidjan avec livraison rapide.");
  const [editPrice, setEditPrice] = useState(String(featuredProduct.priceFcfa));
  const [editStock, setEditStock] = useState(String(featuredProduct.stock));
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const isSold = featuredProduct.availability === "sold";
  const sellerProducts = products.filter((product) => product.sellerId === seller.id);
  const sellerOrders = orders.filter((order) => order.sellerName === seller.storeName);
  const pendingPayout = sellerOrders.reduce((sum, order) => sum + order.totalAmountFcfa, 0);
  const canCreateSellerAccount = sellerPhone.trim().length >= 8 && sellerOtp.trim().length >= 4;
  const canSaveShop = sellerSession && shopName.trim().length >= 2 && shopWhatsapp.trim().length >= 8 && shopLocation.trim().length >= 3;
  const canPublish = sellerSession && draftName.trim().length >= 3 && Number(draftPrice) > 0 && Number(draftStock) > 0;

  useEffect(() => {
    setEditPrice(String(featuredProduct.priceFcfa));
    setEditStock(String(featuredProduct.stock));
  }, [featuredProduct.id, featuredProduct.priceFcfa, featuredProduct.stock]);

  const saveShop = () => {
    if (!canSaveShop) return;
    updateSellerProfile({
      storeName: shopName.trim(),
      slug: shopName.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      commune: shopCommune.trim() || seller.commune,
      phone: sellerPhone.trim(),
      whatsapp: shopWhatsapp.trim(),
      email: shopEmail.trim(),
      locationLabel: shopLocation.trim(),
      trustLevel: "Boutique vérifiée localement - En attente validation finale",
    });
    setPublishMessage("Profil boutique sauvegardé en local.");
  };

  const handlePublish = () => {
    if (!canPublish) return;

    const productId = `product_demo_${Date.now()}`;
    const nextProduct: WariloProduct = {
      id: productId,
      name: draftName.trim(),
      short: draftName.trim().slice(0, 28),
      category: draftCategory.trim() || "Mode",
      priceFcfa: Number(draftPrice),
      imageUrl: "/assets/yapalaan-logo-icon.png",
      tag: "Nouveau",
      productType: "other",
      description: draftDescription.trim(),
      purchaseNote: draftDescription.trim(),
      condition: "À confirmer par le vendeur",
      authenticityNote: "À contrôler par Yapalaan avant publication finale",
      sellerId: seller.id,
      stock: Number(draftStock),
      availability: "available",
    };

    publishProduct(nextProduct);
    setSelectedProductId(productId);
    setPublishMessage(`${nextProduct.short} est publié en mode local vendeur.`);
  };

  const saveProductChanges = () => {
    updateProduct(featuredProduct.id, {
      priceFcfa: Number(editPrice) > 0 ? Number(editPrice) : featuredProduct.priceFcfa,
      stock: Number(editStock) >= 0 ? Number(editStock) : featuredProduct.stock,
    });
    setPublishMessage("Produit mis à jour en local.");
  };

  return (
    <PhoneShell screen="sell" setScreen={setScreen}>
      <div className="h-[calc(100%-32px)] overflow-y-auto bg-[var(--yapa-bg)] px-5 pb-28 pt-3">
        <header className="flex items-center justify-between">
          <button onClick={() => setScreen("home")} className="grid size-10 place-items-center rounded-full bg-white">
            <ChevronLeft className="size-5" />
          </button>
          <p className="text-sm font-black">Devenir vendeur</p>
          <button onClick={() => setScreen("home")} className="text-xs font-black text-[#7a837c]">Accueil</button>
        </header>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">
            <span>Phase vendeur</span>
            <span>Local sécurisé</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#e2d8c8]">
            <div className="h-full w-2/3 rounded-full bg-[var(--yapa-primary)]" />
          </div>
        </div>

        <section className="pt-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--yapa-ink)] px-3 py-1.5 text-[10px] font-black text-white">
            <Store className="size-3.5 text-[var(--yapa-accent)]" />
            Boutique vendeur
          </div>
          <h2 className="text-[34px] font-black leading-[0.98]">Crée ta boutique.</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-[#657066]">Un compte vendeur est obligatoire pour publier, gérer le stock et marquer un article comme vendu. Les acheteurs peuvent commander sans compte, avec la possibilité d'en créer un plus tard.</p>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Compte vendeur</p>
              <p className="mt-1 text-sm font-black">{sellerSession ? "Compte local actif" : "Créer le compte vendeur"}</p>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-[10px] font-black ${sellerSession ? "bg-[var(--yapa-soft)] text-[var(--yapa-ink)]" : "bg-[#f1e8dc] text-[#8a7659]"}`}>
              {sellerSession ? "Actif" : "Obligatoire"}
            </span>
          </div>
          <div className="mt-4 grid gap-3">
            <label className="block rounded-[22px] bg-[var(--yapa-bg)] p-3">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">Téléphone vendeur</span>
              <input value={sellerPhone} onChange={(event) => setSellerPhone(event.target.value)} className="mt-1 w-full bg-transparent text-sm font-black text-[var(--yapa-ink)] outline-none" />
            </label>
            <label className="block rounded-[22px] bg-[var(--yapa-bg)] p-3">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">Code OTP local</span>
              <input value={sellerOtp} onChange={(event) => setSellerOtp(event.target.value)} placeholder="1234" className="mt-1 w-full bg-transparent text-sm font-black text-[var(--yapa-ink)] outline-none" />
            </label>
          </div>
          <button disabled={!canCreateSellerAccount} onClick={() => setSellerSession(true)} className="mt-4 h-12 w-full rounded-[22px] bg-[var(--yapa-ink)] text-xs font-black text-white disabled:opacity-50">
            {sellerSession ? "Compte vendeur actif" : "Activer le compte vendeur"}
          </button>
          <p className="mt-3 text-[11px] font-bold leading-5 text-[#69746d]">Les acheteurs peuvent toujours commander sans compte. Le compte reste obligatoire uniquement pour publier et gérer une boutique.</p>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Profil boutique</p>
          <div className="mt-4 grid gap-3">
            {[
              ["Nom de la boutique", shopName, setShopName],
              ["Commune principale", shopCommune, setShopCommune],
              ["Géolocalisation boutique", shopLocation, setShopLocation],
              ["WhatsApp", shopWhatsapp, setShopWhatsapp],
              ["Email", shopEmail, setShopEmail],
            ].map(([label, value, setter]) => (
              <label key={label as string} className="block rounded-[22px] bg-[var(--yapa-bg)] p-3">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">{label as string}</span>
                <input value={value as string} onChange={(event) => (setter as (nextValue: string) => void)(event.target.value)} className="mt-1 w-full bg-transparent text-sm font-black text-[var(--yapa-ink)] outline-none" />
              </label>
            ))}
          </div>
          <button disabled={!canSaveShop} onClick={saveShop} className="mt-4 h-12 w-full rounded-[22px] bg-[var(--yapa-primary)] text-xs font-black text-[var(--yapa-primary-text)] disabled:opacity-50">
            Sauvegarder la boutique
          </button>
        </section>

        <section className="mt-4 rounded-[28px] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Ajouter un produit</p>
              <p className="mt-1 text-sm font-black text-[var(--yapa-ink)]">Publication boutique</p>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-[10px] font-black ${sellerSession ? "bg-[var(--yapa-soft)] text-[var(--yapa-ink)]" : "bg-[#f1e8dc] text-[#8a7659]"}`}>
              {sellerSession ? "Compte prêt" : "Compte requis"}
            </span>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              ["Nom du produit", draftName, setDraftName],
              ["Catégorie", draftCategory, setDraftCategory],
              ["Prix FCFA", draftPrice, setDraftPrice],
              ["Stock", draftStock, setDraftStock],
            ].map(([label, value, setter]) => (
              <label key={label as string} className="block rounded-[22px] bg-[var(--yapa-bg)] p-3">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">{label as string}</span>
                <input
                  value={value as string}
                  onChange={(event) => (setter as (nextValue: string) => void)(event.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-black text-[var(--yapa-ink)] outline-none"
                />
              </label>
            ))}
            <label className="block rounded-[22px] bg-[var(--yapa-bg)] p-3">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">Description courte</span>
              <textarea
                value={draftDescription}
                onChange={(event) => setDraftDescription(event.target.value)}
                rows={3}
                className="mt-1 w-full resize-none bg-transparent text-sm font-black leading-5 text-[var(--yapa-ink)] outline-none"
              />
            </label>
          </div>
          <button
            disabled={!canPublish}
            onClick={handlePublish}
            className="mt-4 h-12 w-full rounded-[22px] bg-[var(--yapa-ink)] text-xs font-black text-white disabled:opacity-50"
          >
            Publier le produit
          </button>
          {publishMessage ? <p className="mt-3 rounded-[18px] bg-[var(--yapa-soft)] p-3 text-xs font-black text-[var(--yapa-ink)]">{publishMessage}</p> : null}
        </section>

        <section className="mt-4 rounded-[28px] bg-white p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Gestion produit</p>
          <div className="flex gap-3">
            <div className="grid size-20 place-items-center rounded-[24px] bg-[var(--yapa-accent)]/24">
              <Camera className="size-7 text-[var(--yapa-ink)]" />
            </div>
            <div className="flex-1">
              <p className="font-black">{featuredProduct.name}</p>
              <p className="mt-1 text-xs font-bold text-[#69746d]">{formatFcfa(featuredProduct.priceFcfa)} · {isSold ? "Vendu" : `Stock ${featuredProduct.stock}`}</p>
              <p className="mt-2 text-[11px] font-bold text-[#69746d]">La description pourra être améliorée plus tard. Pour le MVP, le vendeur remplit lui-même les informations.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="block rounded-[18px] bg-[var(--yapa-bg)] p-3">
              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7659]">Prix</span>
              <input value={editPrice} onChange={(event) => setEditPrice(event.target.value)} className="mt-1 w-full bg-transparent text-xs font-black outline-none" />
            </label>
            <label className="block rounded-[18px] bg-[var(--yapa-bg)] p-3">
              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7659]">Stock</span>
              <input value={editStock} onChange={(event) => setEditStock(event.target.value)} className="mt-1 w-full bg-transparent text-xs font-black outline-none" />
            </label>
          </div>
          <button onClick={saveProductChanges} className="mt-3 h-11 w-full rounded-[18px] bg-[var(--yapa-soft)] text-xs font-black text-[var(--yapa-ink)]">
            Enregistrer les changements
          </button>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setProductAvailability(featuredProduct.id, "available")}
              className={`h-11 rounded-[18px] text-xs font-black ${!isSold ? "bg-[var(--yapa-ink)] text-white" : "bg-[var(--yapa-bg)] text-[var(--yapa-ink)]"}`}
            >
              Disponible
            </button>
            <button
              onClick={() => setProductAvailability(featuredProduct.id, "sold")}
              className={`h-11 rounded-[18px] text-xs font-black ${isSold ? "bg-[var(--yapa-primary)] text-[var(--yapa-primary-text)]" : "bg-[var(--yapa-bg)] text-[var(--yapa-ink)]"}`}
            >
              Marquer vendu
            </button>
          </div>
          <button onClick={() => setProductAvailability(featuredProduct.id, "hidden")} className="mt-2 h-11 w-full rounded-[18px] bg-[#f1e8dc] text-xs font-black text-[#8a7659]">
            Masquer le produit
          </button>
        </section>

        <section className="mt-4 rounded-[28px] bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Commandes vendeur</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ["Produits", sellerProducts.length],
              ["Commandes", sellerOrders.length],
              ["À payer", formatFcfa(pendingPayout)],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-[18px] bg-[var(--yapa-bg)] p-3">
                <p className="text-[10px] font-black text-[#8a7659]">{label as string}</p>
                <p className="mt-1 text-xs font-black">{value as string}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-2">
            {sellerOrders.length > 0 ? (
              sellerOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="rounded-[20px] bg-[var(--yapa-bg)] p-3">
                  <p className="text-sm font-black">{order.productName}</p>
                  <p className="mt-1 text-[11px] font-bold text-[#69746d]">{getOrderStatusLabel(order.status)} · {formatFcfa(order.totalAmountFcfa)}</p>
                </div>
              ))
            ) : (
              <p className="rounded-[20px] bg-[var(--yapa-bg)] p-3 text-xs font-bold leading-5 text-[#69746d]">Aucune commande vendeur pour l'instant. Les commandes créées au checkout apparaîtront ici.</p>
            )}
          </div>
          <p className="mt-3 text-[11px] font-bold leading-5 text-[#69746d]">Les payouts restent simulés en local. Le paiement réel sera traité plus tard dans la phase paiement.</p>
        </section>

        <section className="mt-4 rounded-[28px] bg-[var(--yapa-ink)] p-4 text-white">
          <p className="font-black">Vérification vendeur</p>
          <p className="mt-2 text-xs font-bold leading-5 text-white/70">Téléphone confirmé aujourd'hui. La géolocalisation de la boutique restera liée au profil vendeur pour faciliter les retraits et livraisons.</p>
        </section>

        <button onClick={() => setScreen("orders")} className="mt-5 h-14 w-full rounded-[24px] bg-[var(--yapa-ink)] text-sm font-black text-white">
          Envoyer pour vérification
        </button>
      </div>
    </PhoneShell>
  );
}

function OrdersScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const { orders, rateOrderCourier } = useContext(OrdersContext);
  const activeOrder = orders[0];
  const hasCourierPhone = activeOrder?.courierPhone.startsWith("+") ?? false;

  return (
    <PhoneShell screen="orders" setScreen={setScreen}>
      <div className="h-[calc(100%-32px)] overflow-y-auto bg-[var(--yapa-bg)] px-5 pb-28 pt-3">
        <header className="flex items-center justify-between">
          <button onClick={() => setScreen("home")} className="grid size-10 place-items-center rounded-full bg-white">
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-black">Commandes</p>
            <p className="text-[10px] font-black text-[var(--yapa-primary)]">Suivi et assistance</p>
          </div>
          <button className="grid size-10 place-items-center rounded-full bg-white">
            <MessageCircle className="size-5 text-[var(--yapa-primary)]" />
          </button>
        </header>

        {activeOrder ? (
          <>
        <section className="mt-5 rounded-[30px] bg-[var(--yapa-ink)] p-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--yapa-primary)]">Commande active</p>
              <h2 className="mt-2 text-2xl font-black leading-tight">{activeOrder.productName}</h2>
              <p className="mt-2 text-sm font-bold text-white/64">{activeOrder.sellerName} · {formatFcfa(activeOrder.totalAmountFcfa)}</p>
            </div>
            <span className="rounded-full bg-[var(--yapa-primary)] px-3 py-1.5 text-[10px] font-black text-[var(--yapa-primary-text)]">{getOrderStatusLabel(activeOrder.status)}</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              ["Créée", activeOrder.createdAtLabel],
              ["Paiement", activeOrder.paymentMethod],
              ["Livraison", activeOrder.status === "in_delivery" ? "En cours" : "À préparer"],
              ["Protection", activeOrder.escrowStatus === "held" ? "Fonds gardés" : "À vérifier"],
              ["Litige", activeOrder.disputeStatus === "none" ? "Aucun" : "Ouvert"],
              ["Remboursement", activeOrder.escrowStatus === "refund_requested" ? "Demandé" : "Non demandé"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[20px] bg-white/10 p-3">
                <p className="text-[10px] font-black">{label}</p>
                <p className="mt-1 text-[10px] font-bold text-white/58">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[30px] bg-white p-4">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Suivi</p>
          <div className="space-y-3">
            {[
              ["Paiement reçu", "L'argent reste protégé jusqu'à confirmation.", Check],
              ["Vendeur confirmé", "La boutique prépare la commande.", Store],
              ["Livreur contacté", "Coordination manuelle via WhatsApp.", Truck],
              ["Confirmation OTP", "À donner seulement à la réception.", LockKeyhole],
            ].map(([title, detail, Icon]) => (
              <div key={title as string} className="flex gap-3 rounded-[22px] bg-[var(--yapa-bg)] p-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--yapa-primary)] text-[var(--yapa-primary-text)]">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-black">{title as string}</p>
                  <p className="text-xs font-bold leading-5 text-[#69746d]">{detail as string}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[30px] bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Livreur assigné</p>
              <p className="mt-1 text-lg font-black">{activeOrder.courierName}</p>
              <p className="mt-1 text-xs font-bold text-[#69746d]">{activeOrder.deliveryLabel} · {activeOrder.courierRating.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/5 sur {activeOrder.courierRatingsCount} notes</p>
              <p className="mt-1 text-[11px] font-black text-[#8a7659]">Commission Yapalaan : {formatFcfa(activeOrder.deliveryCommissionFcfa)}</p>
            </div>
            {hasCourierPhone ? (
              <a href={`tel:${activeOrder.courierPhone}`} className="rounded-full bg-[var(--yapa-ink)] px-3 py-2 text-[10px] font-black text-white">Appeler</a>
            ) : (
              <span className="rounded-full bg-[#eef1ed] px-3 py-2 text-[10px] font-black text-[#69746d]">Non disponible</span>
            )}
          </div>
          <div className="mt-4 rounded-[24px] bg-[var(--yapa-bg)] p-3">
            <p className="text-sm font-black">Noter le livreur après livraison</p>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button key={rating} onClick={() => rateOrderCourier(activeOrder.id, rating)} className="grid size-9 place-items-center rounded-full bg-white text-[var(--yapa-accent)]">
                  <Star className={`size-5 ${rating <= Math.round(activeOrder.courierRating) ? "fill-[var(--yapa-accent)]" : ""}`} />
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-bold text-[#69746d]">Note actuelle : {activeOrder.courierRating.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/5.</p>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <button className="rounded-[26px] bg-white p-4 text-left">
            <ShieldCheck className="mb-3 size-5 text-[var(--yapa-primary)]" />
            <p className="text-sm font-black">Ouvrir un litige</p>
            <p className="mt-1 text-xs font-bold text-[#69746d]">Si le produit n'arrive pas ou ne correspond pas.</p>
          </button>
          <button className="rounded-[26px] bg-white p-4 text-left">
            <Star className="mb-3 size-5 text-[var(--yapa-accent)]" />
            <p className="text-sm font-black">Laisser un avis</p>
            <p className="mt-1 text-xs font-bold text-[#69746d]">Disponible après livraison confirmée.</p>
          </button>
        </section>

        <button className="mt-5 h-14 w-full rounded-[24px] bg-[var(--yapa-primary)] text-sm font-black text-[var(--yapa-primary-text)]">
          Contacter l'assistance WhatsApp
        </button>
          </>
        ) : (
          <section className="mt-5 rounded-[30px] bg-white p-5 text-center">
            <ShoppingBag className="mx-auto size-10 text-[var(--yapa-primary)]" />
            <h2 className="mt-4 text-xl font-black text-[var(--yapa-ink)]">Aucune commande pour le moment</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-[#69746d]">Choisis un produit, sélectionne un livreur puis confirme le paiement protégé pour voir le suivi ici.</p>
            <button onClick={() => setScreen("shop")} className="mt-5 h-12 w-full rounded-[22px] bg-[var(--yapa-ink)] text-xs font-black text-white">
              Voir les produits
            </button>
          </section>
        )}
      </div>
    </PhoneShell>
  );
}

function CheckoutScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const { buyerDeliveryContact, deliveryOptions, featuredProduct, seller } = useWariloData();
  const { addOrder } = useContext(OrdersContext);
  const purchaseInfo = getProductPurchaseInfo(featuredProduct);
  const [payment, setPayment] = useState("Wave CI");
  const [paymentTestMode, setPaymentTestMode] = useState<"success" | "failure">("success");
  const [selectedCourierId, setSelectedCourierId] = useState(deliveryOptions[0].id);
  const [deliveryContact, setDeliveryContact] = useState<WariloBuyerDeliveryContact>(buyerDeliveryContact);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const selectedCourier = deliveryOptions.find((courier) => courier.id === selectedCourierId) ?? deliveryOptions[0];
  const productAmount = featuredProduct.priceFcfa;
  const deliveryCommission = getCourierCommission(selectedCourier);
  const totalAmount = productAmount + selectedCourier.deliveryFeeFcfa;
  const canConfirmOrder = !isCreatingOrder;
  const confirmOrder = async () => {
    setIsCreatingOrder(true);
    setOrderError(false);

    try {
      if (paymentTestMode === "failure") {
        throw new Error("Paiement test refusé");
      }

      const order = await activeWariloSource.createOrder({
        buyerId: "buyer_demo",
        sellerId: seller.id,
        productId: featuredProduct.id,
        courierId: selectedCourier.id,
        productAmountFcfa: productAmount,
        deliveryFeeFcfa: selectedCourier.deliveryFeeFcfa,
        deliveryCommissionFcfa: deliveryCommission,
        paymentMethod: payment,
        buyerDeliveryContact: deliveryContact,
      });

      addOrder({
        id: order.id,
        productId: featuredProduct.id,
        productName: featuredProduct.short,
        productImageUrl: featuredProduct.imageUrl,
        sellerName: seller.storeName,
        courierId: selectedCourier.id,
        courierName: selectedCourier.fullName,
        courierPhone: selectedCourier.phone,
        courierRating: selectedCourier.averageRating,
        courierRatingsCount: selectedCourier.ratingsCount,
        deliveryCommissionFcfa: deliveryCommission,
        deliveryLabel: `${selectedCourier.vehicleType === "moto" ? "Moto" : selectedCourier.vehicleType} · ${deliveryContact.locationLabel}`,
        paymentMethod: payment,
        totalAmountFcfa: order.totalAmountFcfa,
        status: "in_delivery",
        paymentStatus: payment === "Livraison contre remboursement" ? "cash_on_delivery" : "test_success",
        escrowStatus: "held",
        disputeStatus: "none",
        createdAtLabel: "À l'instant",
      });
      setOrderConfirmation(`Commande ${order.id} créée. Total: ${formatFcfa(order.totalAmountFcfa)}. Argent protégé jusqu'à confirmation.`);
    } catch {
      setOrderError(true);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <PhoneShell screen="checkout" setScreen={setScreen}>
      <div className="h-[calc(100%-32px)] overflow-y-auto bg-[var(--yapa-bg)] px-5 pb-28 pt-3">
        <header className="flex items-center justify-between">
          <button onClick={() => setScreen("product")} className="grid size-10 place-items-center rounded-full bg-white">
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-black">Paiement protégé</p>
            <p className="text-[10px] font-black text-[var(--yapa-primary)]">SÉCURISÉ</p>
          </div>
          <LockKeyhole className="size-5 text-[var(--yapa-primary)]" />
        </header>

        <section className="mt-5 rounded-[30px] bg-white p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Commande</p>
          <div className="flex gap-3">
            <ProductImage product={featuredProduct} className="size-20 rounded-[22px]" />
            <div className="flex-1">
              <p className="text-sm font-black leading-tight">{featuredProduct.name}</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#8a7659]">{purchaseInfo.subtitle}</p>
              <p className="mt-1 text-xs font-bold text-[#6f7972]">{seller.storeName}</p>
              <p className="mt-2 text-xl font-black">{formatFcfa(featuredProduct.priceFcfa)}</p>
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[30px] bg-[var(--yapa-ink)] text-white">
          <div className="h-28 bg-[#20332c] p-4">
            <div className="flex h-full items-center justify-between rounded-[24px] bg-[var(--yapa-primary)]/16 px-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--yapa-primary)]">Cocody - Riviera</p>
                <p className="mt-1 text-sm font-black">{deliveryContact.locationLabel}</p>
              </div>
              <MapPin className="size-8 text-[var(--yapa-accent)]" />
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase text-white/50">Adresse de livraison</p>
                <p className="mt-1 text-sm font-bold leading-5">"{deliveryContact.deliveryInstructions}"</p>
              </div>
              <button onClick={() => setIsEditingDelivery((current) => !current)} className="text-xs font-black text-[var(--yapa-primary)]">
                {isEditingDelivery ? "Fermer" : "Modifier"}
              </button>
            </div>
            <button onClick={() => setIsEditingDelivery(true)} className="mt-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-black">
              <Mic className="size-4 text-[var(--yapa-accent)]" />
              Ajouter une précision
            </button>
          </div>
        </section>

        {isEditingDelivery ? (
          <section className="mt-4 rounded-[30px] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black">Modifier la livraison</p>
              <button
                onClick={() =>
                  setDeliveryContact((current) => ({
                    ...current,
                    locationLabel: getDemoGeoLabel(),
                    latitude: 5.3599,
                    longitude: -4.0083,
                  }))
                }
                className="rounded-full bg-[var(--yapa-soft)] px-3 py-2 text-[10px] font-black text-[var(--yapa-ink)]"
              >
                Ma position
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {[
                ["phone", "Téléphone"],
                ["whatsapp", "WhatsApp"],
                ["email", "Email"],
                ["locationLabel", "Géolocalisation / repère"],
              ].map(([field, label]) => (
                <label key={field} className="block rounded-[22px] bg-[var(--yapa-bg)] p-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">{label}</span>
                  <input
                    value={String(deliveryContact[field as keyof WariloBuyerDeliveryContact])}
                    onChange={(event) =>
                      setDeliveryContact((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                    className="mt-1 w-full bg-transparent text-sm font-black text-[var(--yapa-ink)] outline-none"
                  />
                </label>
              ))}
              <label className="block rounded-[22px] bg-[var(--yapa-bg)] p-3">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">Instructions au livreur</span>
                <textarea
                  value={deliveryContact.deliveryInstructions}
                  onChange={(event) =>
                    setDeliveryContact((current) => ({
                      ...current,
                      deliveryInstructions: event.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-1 w-full resize-none bg-transparent text-sm font-black leading-5 text-[var(--yapa-ink)] outline-none"
                />
              </label>
            </div>
            <button onClick={() => setIsEditingDelivery(false)} className="mt-4 h-11 w-full rounded-[20px] bg-[var(--yapa-ink)] text-xs font-black text-white">
              Enregistrer la livraison
            </button>
          </section>
        ) : null}

        <section className="mt-4 rounded-[30px] bg-white p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Contact livraison acheteur</p>
          <div className="grid gap-3">
            {[
              ["Téléphone", deliveryContact.phone],
              ["WhatsApp", deliveryContact.whatsapp],
              ["Email", deliveryContact.email],
              ["Géolocalisation", deliveryContact.locationLabel],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[22px] bg-[var(--yapa-bg)] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">{label}</p>
                <p className="mt-1 text-sm font-black">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] font-bold leading-5 text-[#69746d]">Ces informations sont utilisées uniquement pour cette livraison et le support de commande.</p>
        </section>

        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Choisir le livreur</p>
            <span className="text-[10px] font-black text-[var(--yapa-primary)]">Prix affiché</span>
          </div>
          <p className="mb-3 text-[11px] font-bold leading-5 text-[#69746d]">
            Liste temporaire de prestataires sur Abidjan. Les tarifs sont estimés et seront ajustés plus tard avec la commission Yapalaan.
          </p>
          <div className="grid gap-3">
            {deliveryOptions.map((courier) => {
              const selected = selectedCourierId === courier.id;
              return (
                <button
                  key={courier.id}
                  onClick={() => setSelectedCourierId(courier.id)}
                  className={`rounded-[26px] border p-4 text-left ${
                    selected ? "border-[var(--yapa-primary)] bg-[var(--yapa-soft)]" : "border-transparent bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-black">{courier.fullName}</p>
                      <p className="mt-1 text-[11px] font-bold text-[#69746d]">
                        {courier.vehicleType === "moto" ? "Moto" : courier.vehicleType} · {courier.zone}
                      </p>
                      <p className="mt-1 text-[11px] font-bold text-[#69746d]">{courier.eta}</p>
                      <p className="mt-1 text-[10px] font-black text-[#8a7659]">Commission Yapalaan incluse : {formatFcfa(getCourierCommission(courier))}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-[var(--yapa-ink)]">{formatFcfa(courier.deliveryFeeFcfa)}</p>
                      <p className="mt-1 flex items-center justify-end gap-1 text-[11px] font-black text-[#69746d]">
                        <Star className="size-3.5 fill-[var(--yapa-accent)] text-[var(--yapa-accent)]" />
                        {courier.averageRating.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#69746d]">{courier.ratingsCount} notes</span>
                    {selected ? <span className="rounded-full bg-[var(--yapa-primary)] px-3 py-1 text-[10px] font-black text-[var(--yapa-primary-text)]">Sélectionné</span> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Moyen de paiement</p>
          <div className="grid gap-3">
            {[
              ["Wave CI", "Instantané - sans frais", "W"],
              ["Orange Money", "Instantané", "O"],
              ["MTN MoMo", "Instantané", "M"],
              ["Livraison contre remboursement", "+ 1 000 FCFA", "C"],
            ].map(([name, meta, letter]) => (
              <button
                key={name}
                onClick={() => setPayment(name)}
                className={`flex h-16 items-center gap-3 rounded-[24px] border px-4 text-left ${
                  payment === name ? "border-[var(--yapa-primary)] bg-[var(--yapa-soft)]" : "border-transparent bg-white"
                }`}
              >
                <span className={`grid size-10 place-items-center rounded-full text-sm font-black ${payment === name ? "bg-[var(--yapa-primary)] text-[var(--yapa-primary-text)]" : "bg-[var(--yapa-ink)] text-white"}`}>
                  {letter}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-black">{name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#778078]">{meta}</span>
                </span>
                {payment === name ? <Check className="size-5 text-[var(--yapa-primary)]" /> : null}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["success", "Paiement test réussi"],
              ["failure", "Paiement test refusé"],
            ].map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setPaymentTestMode(mode as "success" | "failure")}
                className={`h-11 rounded-[18px] text-[10px] font-black ${
                  paymentTestMode === mode ? "bg-[var(--yapa-ink)] text-white" : "bg-white text-[var(--yapa-ink)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] font-bold leading-5 text-[#69746d]">Simulation locale en attendant le prestataire final. Aucun argent réel n'est débité.</p>
        </section>

        <section className="mt-4 rounded-[30px] bg-white p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Résumé</p>
          <div className="space-y-2 text-sm font-bold">
            <div className="flex justify-between">
              <span className="text-[#69746d]">Produit</span>
              <span>{formatFcfa(productAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#69746d]">Livraison · {selectedCourier.fullName}</span>
              <span>{formatFcfa(selectedCourier.deliveryFeeFcfa)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#69746d]">Commission Yapalaan incluse</span>
              <span>{formatFcfa(deliveryCommission)}</span>
            </div>
            <div className="flex justify-between border-t border-[#eee3d2] pt-3 text-base font-black">
              <span>Total</span>
              <span>{formatFcfa(totalAmount)}</span>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[30px] bg-[var(--yapa-ink)] p-4 text-white">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-black">Protection achat</p>
            <ShieldCheck className="size-5 text-[var(--yapa-primary)]" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Payer", CreditCard],
              ["Livrer", Truck],
              ["Libérer", PackageCheck],
            ].map(([label, Icon], index) => (
              <div key={label as string} className="rounded-[20px] bg-white/10 p-3">
                <div className="mx-auto mb-2 grid size-8 place-items-center rounded-full bg-[var(--yapa-primary)] text-[var(--yapa-primary-text)]">
                  <Icon className="size-4" />
                </div>
                <p className="text-[10px] font-black">{label as string}</p>
                <p className="mt-1 text-[9px] font-bold text-white/50">{index === 2 ? "Après OTP" : "Étape " + (index + 1)}</p>
              </div>
            ))}
          </div>
        </section>

        {orderConfirmation ? (
          <div className="mt-5 rounded-[26px] bg-white p-4 text-sm font-black leading-5 text-[var(--yapa-ink)]">
            {orderConfirmation}
            <button onClick={() => setScreen("orders")} className="mt-3 h-11 w-full rounded-[20px] bg-[var(--yapa-ink)] text-xs font-black text-white">
              Voir le suivi
            </button>
          </div>
        ) : null}

        {orderError ? (
          <p className="mt-3 rounded-[20px] bg-red-50 p-3 text-xs font-black text-red-700">
            Paiement refusé en mode test. La commande n'est pas créée et aucun débit réel n'est effectué.
          </p>
        ) : null}

        <button
          disabled={!canConfirmOrder}
          onClick={confirmOrder}
          className="mt-5 h-16 w-full rounded-[28px] bg-[var(--yapa-primary)] text-base font-black text-[var(--yapa-primary-text)] shadow-[0_16px_34px_rgba(17,24,22,.18)] disabled:opacity-60"
        >
          {isCreatingOrder ? "Création de la commande..." : `Payer ${formatFcfa(totalAmount)} avec ${payment}`}
        </button>
      </div>
    </PhoneShell>
  );
}

function ImportScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const [chinaLink, setChinaLink] = useState("");
  const [requestText, setRequestText] = useState("Montre homme automatique, style premium, budget 150 000 FCFA");
  const marketplace = chinaLink.includes("1688")
    ? "1688"
    : chinaLink.includes("alibaba")
      ? "Alibaba"
      : chinaLink.includes("aliexpress")
        ? "AliExpress"
        : chinaLink.includes("temu")
          ? "Temu"
          : chinaLink.includes("dhgate")
            ? "DHGate"
            : chinaLink.includes("made-in-china")
              ? "Made-in-China"
              : "Lien Chine";
  const productCost = chinaLink.trim().length > 0 ? 42000 : 0;
  const shippingCost = chinaLink.trim().length > 0 ? 18000 : 0;
  const customsCost = chinaLink.trim().length > 0 ? 12000 : 0;
  const calculatedImportFee = Math.round(productCost * importServiceRate);
  const yapalaanFee = chinaLink.trim().length > 0 ? Math.max(importMinimumFeeFcfa, calculatedImportFee) : 0;
  const totalImportCost = productCost + shippingCost + customsCost + yapalaanFee;

  return (
    <PhoneShell screen="import" setScreen={setScreen}>
      <div className="h-[calc(100%-32px)] overflow-y-auto bg-[var(--yapa-bg)] px-5 pb-28 pt-3">
        <header className="flex items-center justify-between">
          <button onClick={() => setScreen("home")} className="grid size-10 place-items-center rounded-full bg-white">
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-black">Yapalaan Import</p>
            <p className="text-[10px] font-black text-[var(--yapa-primary)]">Chine vers Abidjan</p>
          </div>
          <div className="grid size-10 place-items-center rounded-full bg-[var(--yapa-ink)] text-white">
            <PackageCheck className="size-5" />
          </div>
        </header>

        <section className="pt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7659]">Nouveau module</p>
          <h2 className="mt-2 text-[34px] font-black leading-[1] text-[var(--yapa-ink)]">Importer depuis la Chine, sans confusion.</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-[#657066]">
            Colle un lien Alibaba, 1688, AliExpress, Temu, DHGate ou Made-in-China. Yapalaan estime le coût complet en FCFA et peut acheter pour toi.
          </p>
        </section>

        <section className="mt-5 rounded-[30px] bg-white p-4 shadow-[0_12px_30px_rgba(17,24,22,.08)]">
          <div className="flex items-center gap-2">
            <Search className="size-5 text-[var(--yapa-primary)]" />
            <p className="text-sm font-black">Coller un lien produit Chine</p>
          </div>
          <input
            value={chinaLink}
            onChange={(event) => setChinaLink(event.target.value)}
            placeholder="https://1688.com/... ou lien Alibaba..."
            className="mt-3 h-12 w-full rounded-[20px] bg-[var(--yapa-bg)] px-4 text-xs font-bold outline-none"
          />
          <div className="mt-3 rounded-[22px] bg-[var(--yapa-soft)] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7659]">Source détectée</p>
            <p className="mt-1 text-lg font-black text-[var(--yapa-ink)]">{marketplace}</p>
          </div>
        </section>

        <section className="mt-4 rounded-[30px] bg-[var(--yapa-ink)] p-4 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-black">Calculateur import IA</p>
              <p className="text-[11px] font-bold text-white/58">Estimation transparente avant paiement</p>
            </div>
            <Calculator className="size-5 text-[var(--yapa-primary)]" />
          </div>
          <div className="grid gap-2">
            {[
              ["Produit", productCost],
              ["Transport international", shippingCost],
              ["Douane estimée", customsCost],
              ["Frais Yapalaan", yapalaanFee],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between rounded-[18px] bg-white/10 px-3 py-2">
                <span className="text-xs font-bold text-white/68">{label as string}</span>
                <span className="text-xs font-black">{formatFcfa(value as number)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-[22px] bg-[var(--yapa-primary)] p-3 text-[var(--yapa-primary-text)]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em]">Total estimé livré</p>
            <p className="mt-1 text-2xl font-black">{formatFcfa(totalImportCost)}</p>
            <p className="mt-1 text-[10px] font-bold opacity-75">Frais service : {Math.round(importServiceRate * 100)}% avec minimum {formatFcfa(importMinimumFeeFcfa)}</p>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          {[
            ["Traduction IA", "Descriptions chinoises traduites en français."],
            ["Acheter pour moi", "Yapalaan gère l'achat fournisseur."],
            ["Recherche image", "Importer à partir d'une photo produit."],
            ["Commandes groupées", "Réduire transport et douane."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[24px] bg-white p-4">
              <p className="text-sm font-black text-[var(--yapa-ink)]">{title}</p>
              <p className="mt-2 text-[11px] font-bold leading-5 text-[#69746d]">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-[30px] bg-white p-4">
          <p className="text-sm font-black">Demande produit</p>
          <textarea
            value={requestText}
            onChange={(event) => setRequestText(event.target.value)}
            className="mt-3 min-h-24 w-full resize-none rounded-[22px] bg-[var(--yapa-bg)] p-4 text-xs font-bold leading-5 outline-none"
          />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ["Bronze", "Nouveau"],
              ["Or", "Fiable"],
              ["Platine", "Priorité"],
            ].map(([level, label]) => (
              <div key={level} className="rounded-[18px] bg-[var(--yapa-bg)] p-3">
                <p className="text-xs font-black">{level}</p>
                <p className="mt-1 text-[9px] font-bold text-[#69746d]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <button className="mt-5 h-14 w-full rounded-[24px] bg-[var(--yapa-primary)] text-sm font-black text-[var(--yapa-primary-text)] shadow-[0_14px_28px_rgba(17,24,22,.18)]">
          Demander un devis import
        </button>

        <button onClick={() => setScreen("checkout")} className="mt-3 h-12 w-full rounded-[22px] bg-white text-xs font-black text-[var(--yapa-ink)]">
          Acheter pour moi
        </button>
      </div>
    </PhoneShell>
  );
}

function SettingsScreen({
  setScreen,
  selectedThemeId,
  onSelectTheme,
}: {
  setScreen: (screen: Screen) => void;
  selectedThemeId: YapalaanThemeId;
  onSelectTheme: (themeId: YapalaanThemeId) => void;
}) {
  const selectedTheme = yapalaanThemes.find((theme) => theme.id === selectedThemeId) ?? yapalaanThemes[0];
  const { deliveryOptions, allCouriers } = useWariloData();
  const { addDemoCourier, removeCourier, updateCourier } = useContext(CourierAdminContext);
  const totalDeliveryRevenue = allCouriers.reduce((sum, courier) => sum + courier.deliveryFeeFcfa, 0);
  const totalCommission = allCouriers.reduce((sum, courier) => sum + getCourierCommission(courier), 0);
  const averageBasketFcfa = 100000;
  const projectedSaleCommission = Math.round(averageBasketFcfa * saleCommissionRate);
  const projectedImportFee = Math.max(importMinimumFeeFcfa, Math.round(averageBasketFcfa * importServiceRate));

  return (
    <PhoneShell screen="settings" setScreen={setScreen}>
      <div className="h-[calc(100%-32px)] overflow-y-auto bg-[var(--yapa-bg)] px-5 pb-28 pt-3">
        <header className="flex items-center justify-between">
          <button onClick={() => setScreen("home")} className="grid size-10 place-items-center rounded-full bg-white">
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-black">Réglages</p>
            <p className="text-[10px] font-black text-[var(--yapa-primary)]">Préférences</p>
          </div>
          <div className="grid size-10 place-items-center rounded-full bg-white">
            <Palette className="size-5 text-[var(--yapa-primary)]" />
          </div>
        </header>

        <section className="pt-6">
          <h2 className="text-[32px] font-black leading-[1] text-[var(--yapa-ink)]">Personnalise ton application.</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-[#657066]">
            Le thème choisi change les couleurs principales de l'application sans modifier tes commandes, ta boutique ou tes préférences de livraison.
          </p>
        </section>

        <section className="mt-5">
          <ThemePicker selectedThemeId={selectedThemeId} onSelectTheme={onSelectTheme} />
        </section>

        <section className="mt-4 rounded-[28px] bg-[var(--yapa-ink)] p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--yapa-primary)]">Thème actif</p>
          <div className="mt-4">
            <p className="text-lg font-black">{selectedTheme.label}</p>
            <p className="text-xs font-bold text-white/62">Appliqué immédiatement</p>
          </div>
        </section>

        <section className="mt-4 grid gap-3">
          {[
            ["Langue", "Français uniquement"],
            ["Notifications", "Commandes et livraison"],
            ["Sécurité", "Protection activée"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">{label}</p>
              <p className="mt-1 text-sm font-black text-[var(--yapa-ink)]">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-[28px] bg-[var(--yapa-ink)] p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--yapa-primary)]">Monétisation MVP</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["Vente", formatFcfa(projectedSaleCommission), `${Math.round(saleCommissionRate * 100)}%`],
              ["Livraison", formatFcfa(totalCommission), "Commission"],
              ["Import", formatFcfa(projectedImportFee), "Service"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-[20px] bg-white/10 p-3">
                <p className="text-[10px] font-black text-white/58">{label}</p>
                <p className="mt-1 text-xs font-black">{value}</p>
                <p className="mt-1 text-[9px] font-bold text-white/48">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] font-bold leading-5 text-white/62">Objectif : gagner sur transaction réussie, livraison suivie, devis import et services vendeurs, sans abonnement au départ.</p>
        </section>

        <section className="mt-4 rounded-[28px] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7659]">Gestion livreurs</p>
              <p className="mt-1 text-sm font-black text-[var(--yapa-ink)]">{deliveryOptions.length} actifs sur {allCouriers.length}</p>
            </div>
            <button onClick={addDemoCourier} className="rounded-full bg-[var(--yapa-ink)] px-3 py-2 text-[10px] font-black text-white">
              Ajouter
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-[20px] bg-[var(--yapa-bg)] p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7659]">CA livraison</p>
              <p className="mt-1 text-sm font-black">{formatFcfa(totalDeliveryRevenue)}</p>
            </div>
            <div className="rounded-[20px] bg-[var(--yapa-bg)] p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7659]">Commission</p>
              <p className="mt-1 text-sm font-black">{formatFcfa(totalCommission)}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {allCouriers.map((courier) => {
              const active = (courier.availabilityStatus ?? "active") === "active";
              return (
              <div key={courier.id} className="rounded-[22px] bg-[var(--yapa-bg)] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-black">{courier.fullName}</p>
                    <p className="mt-1 text-[11px] font-bold leading-5 text-[#69746d]">{courier.zone}</p>
                    <p className="mt-1 text-[11px] font-bold text-[#69746d]">Coût : {formatFcfa(courier.deliveryFeeFcfa)} · Commission : {formatFcfa(getCourierCommission(courier))}</p>
                    <p className="mt-1 text-[11px] font-bold text-[#69746d]">{courier.averageRating.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/5 · {courier.ratingsCount} notes</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-black ${active ? "bg-[var(--yapa-soft)] text-[var(--yapa-ink)]" : "bg-white text-[#8a7659]"}`}>
                    {active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="block rounded-[18px] bg-white p-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7659]">Coût livraison</span>
                    <input
                      value={courier.deliveryFeeFcfa}
                      onChange={(event) => updateCourier(courier.id, { deliveryFeeFcfa: Number(event.target.value) || 0 })}
                      className="mt-1 w-full bg-transparent text-xs font-black outline-none"
                    />
                  </label>
                  <label className="block rounded-[18px] bg-white p-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7659]">Commission</span>
                    <input
                      value={getCourierCommission(courier)}
                      onChange={(event) => updateCourier(courier.id, { yapalaanCommissionFcfa: Number(event.target.value) || 0 })}
                      className="mt-1 w-full bg-transparent text-xs font-black outline-none"
                    />
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateCourier(courier.id, { availabilityStatus: active ? "inactive" : "active" })}
                    disabled={active && deliveryOptions.length <= 1}
                    className="h-10 rounded-[18px] bg-white text-[10px] font-black text-[var(--yapa-ink)] disabled:opacity-40"
                  >
                    {active ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    onClick={() => removeCourier(courier.id)}
                    disabled={allCouriers.length <= 1}
                    className="h-10 rounded-[18px] bg-white text-[10px] font-black text-[#8a7659] disabled:opacity-40"
                  >
                    Retirer
                  </button>
                </div>
              </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] font-bold leading-5 text-[#69746d]">Cette gestion reste locale pour le MVP. Elle sera reliée à Supabase avant publication.</p>
        </section>
      </div>
    </PhoneShell>
  );
}

function ScreenNotes({ screen }: { screen: Screen }) {
  const notes = useMemo(
    () => ({
      home: ["Accueil sombre avec motifs kente", "Recherche en français", "Vente flash + catégories", "Navigation basse effet verre"],
      product: ["Carrousel plein écran", "Prix en FCFA", "Protection achat visible", "Vendeur vérifié"],
      shop: ["Micro-boutique vendeur", "Carte de confiance flottante", "Grille à 2 colonnes", "Bouton WhatsApp"],
      import: ["Lien Chine vers prix FCFA", "Achat assisté", "Commandes groupées", "Devis WhatsApp plus tard"],
      sell: ["Création de boutique", "WhatsApp vendeur", "Premier produit manuel", "Validation par l'équipe"],
      checkout: ["Adresse par repère", "Contacts livraison", "Choix du livreur", "Total avant paiement"],
      orders: ["Suivi de commande", "Assistance WhatsApp", "Litiges", "Avis après livraison"],
      settings: ["Choix du thème", "Français uniquement", "Préférences utilisateur", "Logo officiel"],
    }),
    [],
  );

  return (
    <aside className="hidden max-w-sm lg:block">
      <YapalaanLogo />
      <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-[var(--yapa-primary)]">Application mobile</p>
      <h1 className="mt-3 text-5xl font-black leading-[0.94] text-[var(--yapa-ink)]">Le marché qui rapproche.</h1>
      <p className="mt-5 text-base font-semibold leading-7 text-[#5e675f]">
        Version mobile avec la nouvelle identité de l'application. La palette par défaut reprend le noir profond et l'orange vif du design initial, avec des thèmes alternatifs au choix.
      </p>
      <div className="mt-7 grid gap-3">
        {notes[screen].map((note) => (
          <div key={note} className="flex items-center gap-3 rounded-[22px] bg-white p-4 shadow-[0_12px_30px_rgba(17,24,22,.08)]">
            <Sparkles className="size-5 text-[var(--yapa-accent)]" />
            <p className="text-sm font-black text-[var(--yapa-ink)]">{note}</p>
          </div>
        ))}
      </div>
      <div className="mt-7 rounded-[28px] bg-[var(--yapa-ink)] p-5 text-white">
        <div className="flex items-center gap-3">
          <Clock3 className="size-5 text-[var(--yapa-primary)]" />
          <p className="font-black">Priorité MVP</p>
        </div>
        <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
          Priorité à l'expérience acheteur, puis à l'intégration vendeur. La protection achat reste visible pour rappeler la promesse de confiance à chaque écran.
        </p>
      </div>
    </aside>
  );
}

export default function SoukCI() {
  const [screen, setScreen] = useState<Screen>("home");
  const [wariloData, setWariloData] = useState<WariloDemoData>(fallbackWariloDemo);
  const [productAvailability, setProductAvailabilityState] = useState<Record<string, WariloProduct["availability"]>>({});
  const [orders, setOrders] = useState<YapalaanOrder[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<YapalaanThemeId>(getInitialYapalaanThemeId);
  const selectedTheme = yapalaanThemes.find((theme) => theme.id === selectedThemeId) ?? yapalaanThemes[0];
  const setProductAvailability = (productId: string, availability: WariloProduct["availability"]) => {
    setProductAvailabilityState((current) => ({ ...current, [productId]: availability }));
  };
  const updateProduct = (productId: string, updates: Partial<WariloProduct>) => {
    setWariloData((current) => ({
      ...current,
      categories: updates.category && !current.categories.includes(updates.category) ? [updates.category, ...current.categories] : current.categories,
      products: current.products.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
    }));
  };
  const publishProduct = (product: WariloProduct) => {
    setWariloData((current) => ({
      ...current,
      categories: current.categories.includes(product.category) ? current.categories : [product.category, ...current.categories],
      products: [product, ...current.products.filter((item) => item.id !== product.id)],
    }));
  };
  const updateSellerProfile = (updates: Partial<WariloSellerProfile>) => {
    setWariloData((current) => ({
      ...current,
      seller: { ...current.seller, ...updates },
    }));
  };
  const addOrder = (order: YapalaanOrder) => {
    setOrders((current) => [order, ...current.filter((item) => item.id !== order.id)]);
  };
  const rateCourier = (courierId: string, rating: number) => {
    setWariloData((current) => ({
      ...current,
      couriers: current.couriers.map((courier) =>
        courier.id === courierId
          ? {
              ...courier,
              averageRating: Number(((courier.averageRating * courier.ratingsCount + rating) / (courier.ratingsCount + 1)).toFixed(1)),
              ratingsCount: courier.ratingsCount + 1,
            }
          : courier,
      ),
    }));
  };
  const rateOrderCourier = (orderId: string, rating: number) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              courierRating: rating,
              courierRatingsCount: order.courierRatingsCount + 1,
            }
          : order,
      ),
    );
    const order = orders.find((item) => item.id === orderId);
    if (order) {
      rateCourier(order.courierId, rating);
    }
  };
  const addDemoCourier = () => {
    const id = `courier_demo_${Date.now()}`;
    setWariloData((current) => ({
      ...current,
      couriers: [
        {
          id,
          fullName: "Livreur Yapalaan",
          phone: "+225 07 77 77 77 77",
          commune: "Cocody",
          zone: "Cocody, Bingerville, Plateau",
          vehicleType: "moto",
          eta: "Aujourd'hui - 2 h",
          deliveryFeeFcfa: 1300,
          yapalaanCommissionFcfa: 300,
          availabilityStatus: "active",
          averageRating: 5,
          ratingsCount: 1,
          locationLabel: "Cocody Angré",
          latitude: 5.385,
          longitude: -3.973,
        },
        ...current.couriers,
      ],
    }));
  };
  const updateCourier = (courierId: string, updates: Partial<WariloCourier>) => {
    setWariloData((current) => ({
      ...current,
      couriers: current.couriers.map((courier) => (courier.id === courierId ? { ...courier, ...updates } : courier)),
    }));
  };
  const removeCourier = (courierId: string) => {
    setWariloData((current) => ({
      ...current,
      couriers: current.couriers.length <= 1 ? current.couriers : current.couriers.filter((courier) => courier.id !== courierId),
    }));
  };
  const displayedWariloData = useMemo<WariloDemoData>(
    () => ({
      ...wariloData,
      products: wariloData.products.map((product) => ({
        ...product,
        availability: productAvailability[product.id] ?? product.availability,
      })),
    }),
    [productAvailability, wariloData],
  );

  useEffect(() => {
    let mounted = true;

    activeWariloSource
      .getSnapshot()
      .then((snapshot) => {
        if (mounted) {
          setWariloData(snapshot);
        }
      })
      .catch(() => {
        if (mounted) {
          setWariloData(fallbackWariloDemo);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(themeStorageKey, selectedThemeId);
  }, [selectedThemeId]);

  return (
    <main
      className="min-h-screen overflow-x-hidden overflow-y-auto bg-[var(--yapa-page)] px-4 py-5 font-sans text-[var(--yapa-ink)] sm:px-6 lg:grid lg:place-items-center"
      style={selectedTheme.colors as CSSProperties}
    >
      <div className="absolute inset-0 -z-0 opacity-35 [background-image:linear-gradient(135deg,rgba(247,160,74,.22)_0_12%,transparent_12%_24%,rgba(53,213,139,.18)_24%_36%,transparent_36%_48%)] [background-size:56px_56px]" />
      <div className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[390px_1fr]">
        <YapalaanThemeContext.Provider value={selectedTheme}>
          <OrdersContext.Provider value={{ orders, addOrder, rateOrderCourier }}>
            <CourierAdminContext.Provider value={{ addDemoCourier, removeCourier, updateCourier, rateCourier }}>
              <ProductInventoryContext.Provider value={{ publishProduct, setProductAvailability, updateProduct }}>
                <SellerProfileContext.Provider value={{ updateSellerProfile }}>
                  <ProductSelectionContext.Provider value={{ selectedProductId, setSelectedProductId }}>
                  <WariloDataContext.Provider value={displayedWariloData}>
                    {screen === "home" ? <HomeScreen setScreen={setScreen} /> : null}
                    {screen === "product" ? <ProductScreen setScreen={setScreen} /> : null}
                    {screen === "shop" ? <ShopScreen setScreen={setScreen} /> : null}
                    {screen === "import" ? <ImportScreen setScreen={setScreen} /> : null}
                    {screen === "sell" ? <SellScreen setScreen={setScreen} /> : null}
                    {screen === "orders" ? <OrdersScreen setScreen={setScreen} /> : null}
                    {screen === "checkout" ? <CheckoutScreen setScreen={setScreen} /> : null}
                    {screen === "settings" ? <SettingsScreen setScreen={setScreen} selectedThemeId={selectedThemeId} onSelectTheme={setSelectedThemeId} /> : null}
                    <ScreenNotes screen={screen} />
                  </WariloDataContext.Provider>
                  </ProductSelectionContext.Provider>
                </SellerProfileContext.Provider>
              </ProductInventoryContext.Provider>
            </CourierAdminContext.Provider>
          </OrdersContext.Provider>
        </YapalaanThemeContext.Provider>
      </div>
    </main>
  );
}

