function notFound() {
  return (
    <div className="w-full h-screen flex justify-center items-center text-center">
      <div>
        <h3>Ups,</h3>
        <h1 className="animate-blink">404</h1>
        <h2>Seite nicht gefunden...</h2>
        <p>Die gesuchte Seite wurde gelöscht oder verschoben.</p>
      </div>
    </div>
  );
}

export default notFound;
