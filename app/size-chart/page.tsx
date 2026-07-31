import type { Metadata } from "next";
import SimplePage from "@/components/pages/SimplePage";

export const metadata: Metadata = {
  title: "Size Chart | tobarok",
  description: "Find your perfect fit with the tobarok size chart.",
};

const rows = [
  { size: "S", chest: '36"', length: '27"', shoulder: '17"', sleeve: '8"' },
  { size: "M", chest: '38"', length: '28"', shoulder: '18"', sleeve: '8.5"' },
  { size: "L", chest: '40"', length: '29"', shoulder: '19"', sleeve: '9"' },
  { size: "XL", chest: '42"', length: '30"', shoulder: '20"', sleeve: '9.5"' },
  { size: "XXL", chest: '44"', length: '31"', shoulder: '21"', sleeve: '10"' },
];

export default function SizeChart() {
  return (
    <SimplePage title="Size Chart" crumbs={[{ label: "Size Chart" }]}>
      <p className="max-w-2xl text-sm text-neutral-600">
        Measurements are in inches and refer to the garment laid flat. If
        you&apos;re between sizes, we recommend going one size up for a relaxed,
        oversized fit.
      </p>
      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left text-xs font-bold uppercase tracking-widest text-neutral-500">
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Chest</th>
              <th className="px-4 py-3">Length</th>
              <th className="px-4 py-3">Shoulder</th>
              <th className="px-4 py-3">Sleeve</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.size}
                className={i % 2 ? "bg-neutral-50" : "bg-white"}
              >
                <td className="px-4 py-3 font-bold text-neutral-900">
                  {row.size}
                </td>
                <td className="px-4 py-3 text-neutral-600">{row.chest}</td>
                <td className="px-4 py-3 text-neutral-600">{row.length}</td>
                <td className="px-4 py-3 text-neutral-600">{row.shoulder}</td>
                <td className="px-4 py-3 text-neutral-600">{row.sleeve}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="max-w-2xl text-sm text-neutral-600">
        Sizes may vary slightly between fits (drop shoulder runs roomier than
        regular half sleeve). Check the product description for fit notes.
      </p>
    </SimplePage>
  );
}
