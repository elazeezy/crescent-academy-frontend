"use client";

import { useEffect, useState } from "react";
import { SCHOOL, PRAYER_NAMES } from "@/lib/constants";

interface Timings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

function getCurrentPrayer(timings: Timings): string {
  const now = new Date();
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const cur = now.getHours() * 60 + now.getMinutes();
  const order: Array<keyof Timings> = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  let current = "Isha";
  for (const name of order) {
    if (cur >= toMinutes(timings[name])) current = name;
  }
  return current;
}

export default function PrayerTimes() {
  const [timings, setTimings] = useState<Timings | null>(null);
  const [hijri, setHijri] = useState("");
  const [currentPrayer, setCurrentPrayer] = useState("");

  useEffect(() => {
    fetch(SCHOOL.prayerApiUrl)
      .then((r) => r.json())
      .then((data) => {
        const t: Timings = {
          Fajr:    data.data.timings.Fajr,
          Dhuhr:   data.data.timings.Dhuhr,
          Asr:     data.data.timings.Asr,
          Maghrib: data.data.timings.Maghrib,
          Isha:    data.data.timings.Isha,
        };
        setTimings(t);
        setCurrentPrayer(getCurrentPrayer(t));
        const h = data.data.date.hijri;
        setHijri(`${h.day} ${h.month.en} ${h.year}H`);
      })
      .catch(() => {});
  }, []);

  if (!timings) return null;

  return (
    <div className="bg-ca-green text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <span className="text-xs text-ca-gold shrink-0 font-medium">{hijri}</span>
        <div className="flex items-center gap-4 flex-wrap">
          {PRAYER_NAMES.map((name) => {
            const isActive = currentPrayer === name;
            return (
              <div
                key={name}
                className={`flex items-center gap-1.5 text-xs font-medium ${
                  isActive ? "text-ca-gold" : "text-white/65"
                }`}
              >
                <span>{name}</span>
                <span className={isActive ? "text-ca-gold-light" : "text-white/50"}>
                  {timings[name]}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-ca-gold animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
