export default function MeasurementIcon({ id }) {
  switch (id) {
    case "temp":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M21 10a3 3 0 1 1 6 0v16.6a8 8 0 1 1-6 0z" fill="currentColor" opacity="0.2" />
          <path
            d="M24 6a5 5 0 0 1 5 5v14.7a10 10 0 1 1-10 0V11a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v15.8l-.7.6A8 8 0 1 0 28 27.4l-.7-.6V11a3 3 0 0 0-3-3zm-1 9h2v13h-2z"
            fill="currentColor"
          />
        </svg>
      );
    case "bp":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 42s-11-7.4-14.6-13.1C5 22.3 9 14 17.1 14c2.8 0 5.2 1.1 6.9 3.1 1.7-2 4.1-3.1 6.9-3.1C39 14 43 22.3 38.6 28.9 35 34.6 24 42 24 42z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M31.9 12c8.9 0 13.6 9.9 8.3 17.9-3.7 5.6-14.1 12.8-14.5 13l-1.1.8-1.1-.8c-.4-.3-10.8-7.4-14.5-13C3.8 21.9 8.4 12 17.3 12c2.9 0 5.4 1 7.3 2.9 1.9-1.9 4.4-2.9 7.3-2.9zm0 2c-2.6 0-4.7 1.1-6.2 3.1l-1.1 1.5-1.1-1.5c-1.5-2-3.6-3.1-6.2-3.1-7.2 0-10.9 8.1-6.8 14.3 2.8 4.2 10.2 9.9 13.1 12 2.9-2.1 10.3-7.8 13.1-12C42.8 22.1 39.1 14 31.9 14zm-16 12h6l2-3.7 2.6 9.2 1.5-3.5h5v2h-3.7l-2.2 5.3-2.8-9.7-1.2 2.4h-7.1z"
            fill="currentColor"
          />
        </svg>
      );
    case "height":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M14 8h6v32h-6z" fill="currentColor" opacity="0.2" />
          <path
            d="M13 6h8a1 1 0 0 1 1 1v34a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm1 2v32h6V8zM27 12h9v2h-9zm4 6h5v2h-5zm-4 6h9v2h-9zm4 6h5v2h-5z"
            fill="currentColor"
          />
        </svg>
      );
    case "weight":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12 14h24a4 4 0 0 1 4 4v18a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8V18a4 4 0 0 1 4-4z" fill="currentColor" opacity="0.2" />
          <path
            d="M16 12h16a10 10 0 0 1 10 10v12a12 12 0 0 1-12 12H18A12 12 0 0 1 6 34V22a10 10 0 0 1 10-10zm0 2a8 8 0 0 0-8 8v12a10 10 0 0 0 10 10h12a10 10 0 0 0 10-10V22a8 8 0 0 0-8-8zm8 4a7 7 0 0 1 7 7h-2a5 5 0 0 0-10 0h-2a7 7 0 0 1 7-7zm0 2 3.5 4.5-1.6 1.3L24 23l-1.9 2.8-1.6-1.3z"
            fill="currentColor"
          />
        </svg>
      );
    case "bmi":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M9 10h30v28H9z" fill="currentColor" opacity="0.2" />
          <path
            d="M8 8h32a1 1 0 0 1 1 1v30a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zm1 2v28h30V10zm4 6h8a4 4 0 0 1 0 8h-6v6h-2zm2 2v4h6a2 2 0 0 0 0-4zm12-2h2v14h-2zm6 0h2v14h-2z"
            fill="currentColor"
          />
        </svg>
      );
    case "oxygen":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 6c8.5 0 14 7 14 15.3 0 8.5-6.8 16.7-14 21.7-7.2-5-14-13.2-14-21.7C10 13 15.5 6 24 6z" fill="currentColor" opacity="0.2" />
          <path
            d="M24 4c9.7 0 16 7.9 16 17.3 0 9.7-7.5 18.6-15.2 23.8l-.8.5-.8-.5C15.5 39.9 8 31 8 21.3 8 11.9 14.3 4 24 4zm0 2c-8.3 0-14 6.9-14 15.3 0 8.7 6.9 16.9 14 21.8 7.1-4.9 14-13.1 14-21.8C38 12.9 32.3 6 24 6zm-4 14h2a2 2 0 0 1 0 4h-2zm6 0h2a2 2 0 0 1 0 4h-2z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
}

