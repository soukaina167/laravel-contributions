export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="32" fill="#0F172A" />

      <path
        d="M20 22C20 18 23 16 27 16H42"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M36 10L48 16L36 22"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M44 42C44 46 41 48 37 48H22"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M28 54L16 48L28 42"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}