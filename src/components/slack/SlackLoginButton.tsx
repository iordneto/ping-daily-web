/**
 * Props for the SlackLoginButton component
 */
interface SlackLoginButtonProps {
  /** Function to call when login button is clicked */
  onLogin: () => void;
  /** Whether the button should be disabled */
  disabled?: boolean;
}

/**
 * Slack login button component following Slack's design guidelines
 * @param {SlackLoginButtonProps} props - The component props
 * @returns {JSX.Element} The Slack login button component
 */
export function SlackLoginButton({
  onLogin,
  disabled = false,
}: SlackLoginButtonProps) {
  return (
    <button
      onClick={onLogin}
      disabled={disabled}
      className="w-full bg-white text-black border border-gray-300 rounded-md py-3 px-4 font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3 transition-colors"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523c0-1.395 1.125-2.528 2.52-2.528h2.52v2.528c0 1.395-1.125 2.523-2.52 2.523zM6.313 15.165c0-1.395 1.125-2.523 2.52-2.523s2.52 1.128 2.52 2.523v6.312c0 1.395-1.125 2.523-2.52 2.523s-2.52-1.128-2.52-2.523v-6.312zM8.833 5.042a2.528 2.528 0 0 1-2.52-2.52c0-1.395 1.125-2.522 2.52-2.522s2.52 1.127 2.52 2.522v2.52H8.833zM8.833 6.313c1.395 0 2.52 1.125 2.52 2.52s-1.125 2.52-2.52 2.52H2.522c-1.395 0-2.522-1.125-2.522-2.52s1.127-2.52 2.522-2.52h6.311zM18.958 8.833c1.395 0 2.523 1.125 2.523 2.52s-1.128 2.52-2.523 2.52h-2.52V8.833h2.52zM17.687 8.833c0 1.395-1.125 2.52-2.52 2.52s-2.52-1.125-2.52-2.52V2.522c0-1.395 1.125-2.522 2.52-2.522s2.52 1.127 2.52 2.522v6.311zM15.167 18.958c1.395 0 2.523 1.128 2.523 2.523S16.562 24 15.167 24s-2.52-1.119-2.52-2.519v-2.523h2.52zM15.167 17.687c-1.395 0-2.52-1.125-2.52-2.52s1.125-2.52 2.52-2.52h6.311c1.395 0 2.523 1.125 2.523 2.52s-1.128 2.52-2.523 2.52h-6.311z"
          fill="#E01E5A"
        />
      </svg>
      Sign in with Slack
    </button>
  );
}
