import React from "react";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        padding: "24px",
      }}
    >
      <section
        style={{
          maxWidth: 760,
          width: "100%",
          textAlign: "center",
          background: "#ffffff",
          padding: "48px 32px",
          borderRadius: 12,
          boxShadow: "0 8px 30px rgba(2,6,23,0.08)",
        }}
      >
        <div
          aria-hidden
          style={{
            display: "inline-block",
            padding: 16,
            borderRadius: 12,
            background: "#eef2ff",
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 7V3M16 7V3"
              stroke="#4f46e5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3"
              y="7"
              width="18"
              height="14"
              rx="2"
              stroke="#4f46e5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 13h4l2 2"
              stroke="#4f46e5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          style={{
            marginTop: 18,
            fontSize: 22,
            lineHeight: 1.2,
            color: "#0f172a",
          }}
          className="font-custom"
        >
          Payroll — Coming Soon
        </h1>

        <p
          style={{ marginTop: 10, color: "#475569", fontSize: 15 }}
          className="font-custom"
        >
          We're working on payroll functionality for the admin overview. Check
          back soon — this page will show employee pay runs, deductions, and
          reporting when available.
        </p>
      </section>
    </main>
  );
}
