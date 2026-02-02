/*
 Error Page will be displayed for undefined routes or errors
 */
export default function ErrorPage() {
  return (
    <div className="page">
      <div className="card w-96 space-y-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Oops! Something went wrong
        </h1>

        <p className="text-gray-600">
          The page you are looking for does not exist or an unexpected error
          occurred.
        </p>
      </div>
    </div>
  );
}
