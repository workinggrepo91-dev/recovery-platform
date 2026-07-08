'use client';

export default function CookieSettingsButton() {
  const handleClick = () => {
    localStorage.removeItem('cookiesAccepted');
    window.location.reload();
  };

  return (
    <button
      onClick={handleClick}
      className="hover:text-blue-400 transition"
    >
      Cookie Settings
    </button>
  );
}
