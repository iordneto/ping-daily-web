import type { SlackUser } from "@/types";

interface UserProfileProps {
  user: SlackUser;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <>
      {/* Avatar e boas-vindas */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="#666"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Bem-vindo!</h2>
      </div>

      {/* Informações do usuário */}
      <div className="space-y-3 mb-6">
        <UserInfoRow label="Nome" value={user.name} />
        <UserInfoRow label="Email" value={user.email} />
        <UserInfoRow
          label="User ID"
          value={user["https://slack.com/user_id"]}
          mono
        />
        <UserInfoRow
          label="Team ID"
          value={user["https://slack.com/team_id"]}
          mono
        />
      </div>
    </>
  );
}

interface UserInfoRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

function UserInfoRow({ label, value, mono = false }: UserInfoRowProps) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span className={mono ? "font-mono text-sm" : ""}>{value}</span>
    </div>
  );
}
