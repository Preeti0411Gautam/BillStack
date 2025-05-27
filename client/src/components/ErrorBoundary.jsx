
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="text-center mt-10 text-red-500">
      <p>Something went wrong:</p>
      <pre>{error?.message || "Unknown error occurred."}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

export default ErrorFallback;
