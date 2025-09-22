import type { SlackChannel } from "@/types/slack";

interface ChannelsListProps {
  channels: SlackChannel[];
}

export function ChannelsList({ channels }: ChannelsListProps) {
  if (channels.length === 0) return null;

  return (
    <div className="mt-4 max-h-60 overflow-y-auto">
      <h3 className="font-semibold mb-2">Meus Canais ({channels.length})</h3>

      <div className="space-y-2">
        {channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}

interface ChannelItemProps {
  channel: SlackChannel;
}

function ChannelItem({ channel }: ChannelItemProps) {
  return (
    <div className="p-2 border rounded">
      <div className="flex items-center gap-2">
        <span>{channel.is_private ? "🔒" : "#"}</span>
        <strong>{channel.name}</strong>
        <span className="text-sm text-gray-500">
          ({channel.num_members} membros)
        </span>
      </div>

      {channel.topic && (
        <p className="text-xs text-gray-600 mt-1">{channel.topic}</p>
      )}
    </div>
  );
}
