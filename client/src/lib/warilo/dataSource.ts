import type { WariloDataMode } from "@shared/warilo";
import { localWariloSource, wariloLocalDemoData } from "./localDemo";
import type { WariloDataSource } from "./source";
import { isWariloSupabaseConfigured, supabaseWariloSource } from "./supabaseSource";

const configuredMode = import.meta.env.VITE_WARILO_DATA_MODE as WariloDataMode | undefined;

export const wariloDataMode: WariloDataMode =
  configuredMode === "supabase" ? "supabase" : "local-demo";

export const activeWariloSource: WariloDataSource =
  wariloDataMode === "supabase" && isWariloSupabaseConfigured ? supabaseWariloSource : localWariloSource;

export const getWariloDemoData = () => {
  if (wariloDataMode === "supabase") {
    // The app keeps using local demo data until Supabase credentials and
    // queries are wired. This lets the UI stay usable during integration.
    return { ...wariloLocalDemoData, mode: "supabase" as const };
  }

  return wariloLocalDemoData;
};
