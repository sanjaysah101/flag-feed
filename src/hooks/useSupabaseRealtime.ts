"use client";

import { useEffect, useRef } from "react";

import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

interface RealtimeOptions {
  event: "INSERT" | "UPDATE" | "DELETE";
  schema?: string;
  table: string;
  filter?: string;
}

export const useSupabaseRealtime = <T extends Record<string, unknown>>(
  options: RealtimeOptions,
  callback: (payload: T) => void
) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`public:${options.table}`)
      .on<T>(
        "postgres_changes" as unknown as "system",
        {
          event: options.event,
          schema: options.schema || "public",
          table: options.table,
          filter: options.filter,
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          callback(payload.new as T);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [options.event, options.schema, options.table, options.filter, callback]);

  return channelRef.current;
};
