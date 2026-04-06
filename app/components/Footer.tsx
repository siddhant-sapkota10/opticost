export default function Footer() {
  return (
    <footer
      className="mt-auto border-t px-4 py-4 text-center text-sm sm:px-6"
      style={{
        backgroundColor: "#0A1628",
        borderColor: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.72)",
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <p>
          OptiCost Consulting
          <span style={{ color: "rgba(255,255,255,0.34)" }}> | </span>
          ABN: 24 686 989 364
        </p>
        <p>
          © 2026 OptiCost
          <span style={{ color: "rgba(255,255,255,0.34)" }}> | </span>
          Email:{" "}
          <a
            href="mailto:admin@opticost.com.au"
            className="transition-opacity hover:opacity-80"
            style={{ color: "#ffffff" }}
          >
            admin@opticost.com.au
          </a>
        </p>
      </div>
    </footer>
  );
}
