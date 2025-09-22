import type { SlackChannel } from "@/types/slack";

/**
 * Props for the ChannelsList component
 */
interface ChannelsListProps {
  /** Array of Slack channels to display */
  channels: SlackChannel[];
}

/**
 * Displays a list of Slack channels with scrollable container
 * @param {ChannelsListProps} props - The component props
 * @returns {JSX.Element | null} The channels list component or null if no channels
 */
export function ChannelsList({ channels }: ChannelsListProps) {
  if (channels.length === 0) return null;

  return (
    <div className="mt-4 max-h-60 overflow-y-auto">
      <h3 className="font-semibold mb-2">My Channels ({channels.length})</h3>

      <div className="space-y-2">
        {channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}

/**
 * Props for the ChannelItem component
 */
interface ChannelItemProps {
  /** The Slack channel data to display */
  channel: SlackChannel;
}

/**
 * Displays a single Slack channel item with name, member count, and topic
 * @param {ChannelItemProps} props - The component props
 * @returns {JSX.Element} The channel item component
 */
function ChannelItem({ channel }: ChannelItemProps) {
  return (
    <div className="p-2 border rounded">
      <div className="flex items-center gap-2">
        <span>{channel.is_private ? "🔒" : "#"}</span>
        <strong>{channel.name}</strong>
        <span className="text-sm text-gray-500">
          ({channel.num_members} members)
        </span>
      </div>

      {channel.topic && (
        <p className="text-xs text-gray-600 mt-1">{channel.topic}</p>
      )}
    </div>
  );
}
