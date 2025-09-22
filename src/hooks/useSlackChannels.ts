import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { SlackChannel } from "@/types/slack";
import { useError } from "./useError";

/**
 * Custom hook for managing Slack channels data and operations
 * @returns {Object} An object containing channels state and management functions
 */
export function useSlackChannels() {
  const { callSlackAPI } = useAuth();
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useError();

  /**
   * Fetches the user's Slack channels from the API
   * @function
   * @async
   * @returns {Promise<void>}
   */
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

  /**
   * Clears the current channels list and any errors
   * @function
   * @returns {void}
   */
  const clearChannels = useCallback(() => {
    setChannels([]);
    clearError();
  }, [clearError]);

  return {
    /** Array of user's Slack channels */
    channels,
    /** Loading state for channel operations */
    loading,
    /** Current error message from channel operations */
    error,
    /** Function to fetch channels from Slack API */
    fetchChannels,
    /** Function to clear channels and errors */
    clearChannels,
    /** Boolean indicating if user has any channels */
    hasChannels: channels.length > 0,
  };
}
