import React, { useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAILS = 20;

const inputClass =
  "w-full box-border rounded-[7px] border border-gray-300 bg-white px-2.5 py-[9px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600";

// Splits typed / pasted text into emails. Accepts commas, semicolons,
// spaces and new lines as separators. Duplicates are skipped.
const parseEmails = (text, existingEmails) => {
  const tokens = text
    .split(/[\s,;]+/)
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  const valid = [];
  const invalid = [];

  tokens.forEach((token) => {
    if (!EMAIL_PATTERN.test(token)) {
      invalid.push(token);
    } else if (!existingEmails.includes(token) && !valid.includes(token)) {
      valid.push(token);
    }
  });

  return { valid, invalid };
};

function InvitePisModal({ entityName, demoMode = false, onSend, onClose }) {
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(null);

  // Adds whatever is typed in the box to the list.
  // Returns the full list of emails, or null if something is invalid.
  const commitInput = () => {
    const { valid, invalid } = parseEmails(inputValue, emails);

    if (invalid.length > 0) {
      setError(`Not a valid email address: ${invalid.join(", ")}`);
      return null;
    }

    const updated = [...emails, ...valid];

    if (updated.length > MAX_EMAILS) {
      setError(`You can invite at most ${MAX_EMAILS} people at once`);
      return null;
    }

    setEmails(updated);
    setInputValue("");
    setError("");

    return updated;
  };

  const handleKeyDown = (event) => {
    if (["Enter", ",", ";"].includes(event.key)) {
      event.preventDefault();
      commitInput();
    }
  };

  const handleRemove = (email) => {
    setEmails((previous) => previous.filter((existing) => existing !== email));
    setError("");
  };

  const handleSend = async () => {
    const finalEmails = commitInput();

    if (finalEmails === null) {
      return;
    }

    if (finalEmails.length === 0) {
      setError("Add at least one email address");
      return;
    }

    try {
      setSending(true);
      setError("");

      await onSend(finalEmails);

      setSentCount(finalEmails.length);
    } catch (err) {
      setError(err?.message || "Failed to send invitations");
    } finally {
      setSending(false);
    }
  };

  const plural = (count) => (count === 1 ? "invitation" : "invitations");

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-5">
      <div className="box-border max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[10px] border border-gray-200 bg-white p-[22px]">
        {/* HEADER */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="m-0 text-[21px] font-semibold text-gray-900">
              Invite PIs
            </h2>
            <p className="m-0 mt-0.5 text-sm text-gray-500">{entityName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="cursor-pointer border-none bg-transparent text-xl text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        {sentCount !== null ? (
          /* ---------------- SUCCESS ---------------- */
          <div>
            <div
              className={`rounded-[7px] border px-3 py-3 text-sm ${
                demoMode
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {demoMode
                ? `Preview only: ${sentCount} ${plural(sentCount)} were NOT sent because sending isn't connected yet.`
                : `${sentCount} ${plural(sentCount)} sent.`}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-[7px] border border-emerald-600 bg-emerald-600 px-4 py-[9px] text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* ---------------- FORM ---------------- */
          <div>
            <p className="m-0 mb-3.5 text-sm text-gray-600">
              Enter the email address of each Principal Investigator. Each
              person receives a one-time link to add their project. The link
              stops working once they submit.
            </p>

            {demoMode && (
              <div className="mb-3.5 rounded-[7px] border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
                Preview only: sending isn't connected yet, so no emails will
                actually be sent.
              </div>
            )}

            {error && (
              <div className="mb-3.5 rounded-[7px] border border-red-200 bg-red-100 px-3 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* EMAIL INPUT */}
            <label className="mb-[5px] block text-xs font-semibold text-gray-600">
              Email addresses
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="name@example.com, then press Enter"
                disabled={sending}
                className={inputClass}
              />

              <button
                type="button"
                onClick={commitInput}
                disabled={sending || inputValue.trim() === ""}
                className="cursor-pointer whitespace-nowrap rounded-[7px] border border-gray-300 bg-gray-100 px-4 py-[9px] text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <p className="m-0 mt-1.5 text-xs text-gray-500">
              You can paste several addresses separated by commas, spaces or
              new lines.
            </p>

            {/* ADDED EMAILS */}
            <div className="mt-3.5 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="mb-2 text-xs font-semibold text-gray-600">
                {emails.length} email address
                {emails.length !== 1 ? "es" : ""} added
              </div>

              {emails.length === 0 ? (
                <div className="text-sm text-gray-400">
                  No email addresses added yet.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {emails.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 py-1 pl-3 pr-1.5 text-sm text-emerald-800"
                    >
                      {email}

                      <button
                        type="button"
                        onClick={() => handleRemove(email)}
                        disabled={sending}
                        aria-label={`Remove ${email}`}
                        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-emerald-700 hover:bg-emerald-200 disabled:cursor-not-allowed"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="cursor-pointer rounded-[7px] border border-gray-300 bg-white px-4 py-[9px] text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="cursor-pointer rounded-[7px] border border-emerald-600 bg-emerald-600 px-4 py-[9px] text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending
                  ? "Sending..."
                  : `Send Invitations${
                      emails.length > 0 ? ` (${emails.length})` : ""
                    }`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitePisModal;