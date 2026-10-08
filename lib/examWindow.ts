// Exam scheduling helpers. A datetime-local input value has no timezone, so it
// must be converted to an absolute ISO instant on the client before being sent
// to the server — otherwise the server (UTC) would parse it in the wrong zone.

// Client side: "2026-09-21T09:00" (local) → ISO instant string, or null if invalid.
export function localInputToIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// Client side: ISO instant → "YYYY-MM-DDTHH:mm" in local time, for prefilling inputs.
export function isoToLocalInput(iso?: string | Date | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Client side: current moment as a datetime-local input value.
export function nowLocalInput(): string {
  return isoToLocalInput(new Date());
}

// Server side: validate a window pair sent as ISO strings.
export function validateExamWindow(
  windowStart: unknown,
  windowEnd: unknown
): { error?: string; start?: Date; end?: Date } {
  if (!windowStart) return { error: 'A start date & time is required' };
  const start = new Date(String(windowStart));
  if (Number.isNaN(start.getTime())) return { error: 'Start date & time is invalid' };

  let end: Date | undefined;
  if (windowEnd) {
    end = new Date(String(windowEnd));
    if (Number.isNaN(end.getTime())) return { error: 'End date & time is invalid' };
    if (end <= start) return { error: 'End date & time must be after the start' };
  }

  return { start, end };
}
