import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { SlackChannel } from "@/types/slack";
import { useError } from "./useError";

export function useSlackChannels() {
  const { callSlackAPI } = useAuth();
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useError();

  const fetchChannels = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const result = await callSlackAPI("channels");
      setChannels(result.channels || []);
    } catch (err) {
      handleError(err);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  }, [callSlackAPI, handleError, clearError]);

  const clearChannels = useCallback(() => {
    setChannels([]);
    clearError();
  }, [clearError]);

  return {
    channels,
    loading,
    error,
    fetchChannels,
    clearChannels,
    hasChannels: channels.length > 0,
  };
}
