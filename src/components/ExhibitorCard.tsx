import Link from "next/link";

export function ExhibitorCard({ exhibitor }: { exhibitor: { _id:string; logo_url:string; company_name:string; country:string; sponsor_level:string; description?:string } }) {
  return (
    <div className="rounded-xl bg-gray-100 p-4 shadow-sm">
      <img src={exhibitor.logo_url} alt={exhibitor.company_name} className="h-24 w-full object-contain bg-white rounded" />
      <h3 className="mt-3 text-lg font-semibold">{exhibitor.company_name}</h3>
      <p className="text-sm text-gray-500">{exhibitor.country} · {exhibitor.sponsor_level}</p>
      <p className="mt-2 text-sm">{(exhibitor.description || "").slice(0, 150)}</p>
      <Link className="mt-3 inline-block text-blue-600" href={`/exhibitor/${exhibitor._id}`}>View Profile</Link>
    </div>
  );
}
