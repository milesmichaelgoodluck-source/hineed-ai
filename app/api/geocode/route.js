import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Turns GPS coordinates (from the browser) into a human address.
// Uses the Google Maps Geocoding API when GOOGLE_MAPS_API_KEY is set,
// otherwise falls back to OpenStreetMap (free, no key) so location works
// out of the box. The API key stays on the server and is never exposed.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat"));
  const lng = parseFloat(searchParams.get("lng"));
  if (!isFinite(lat) || !isFinite(lng)) {
    return NextResponse.json({ error: "Missing coordinates." }, { status: 400 });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY;
  try {
    if (key) {
      const r = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`,
        { cache: "no-store" }
      );
      const j = await r.json();
      const best = j.results && j.results[0];
      if (best) {
        const comp = best.address_components || [];
        const pick = (type) => {
          const c = comp.find((x) => (x.types || []).includes(type));
          return c ? c.long_name : "";
        };
        const city = pick("locality") || pick("administrative_area_level_2") || pick("administrative_area_level_1");
        const country = pick("country");
        const label = [city, country].filter(Boolean).join(", ") || best.formatted_address;
        return NextResponse.json({ label, city, country, full: best.formatted_address, source: "google" });
      }
    }
    // Keyless fallback — OpenStreetMap Nominatim.
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=12`,
      { cache: "no-store", headers: { "User-Agent": "Hineed.AI/1.0 (location)" } }
    );
    const j = await r.json();
    const a = j.address || {};
    const city = a.city || a.town || a.village || a.county || a.state || "";
    const country = a.country || "";
    const label = [city, country].filter(Boolean).join(", ") || j.display_name || "";
    return NextResponse.json({ label, city, country, full: j.display_name || label, source: "osm" });
  } catch {
    return NextResponse.json({ error: "Could not resolve location." }, { status: 502 });
  }
}
