import { Clock, MapPin, Phone } from "lucide-react";
import { outlets } from "@/lib/data";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function StoreLocatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Outlets" }]} />
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
        Find Our Outlets
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-500 sm:text-base">
        Visit any of our stores across Bangladesh to try on the full collection
        and shop in person.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {outlets.map((outlet) => (
          <div
            key={outlet.name}
            className="rounded-2xl border border-neutral-200 p-6 transition-colors hover:border-neutral-900"
          >
            <h2 className="text-base font-bold text-neutral-900">
              {outlet.name}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="shrink-0 text-neutral-400" />
                {outlet.area}
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="shrink-0 text-neutral-400" />
                {outlet.hours}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-neutral-400" />
                {outlet.phone}
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
        <div className="flex aspect-[16/7] w-full items-center justify-center bg-neutral-200">
          <div className="text-center">
            <MapPin size={32} className="mx-auto text-neutral-400" />
            <p className="mt-2 text-sm font-medium text-neutral-500">
              Interactive map coming soon
            </p>
            <p className="text-xs text-neutral-400">
              Embed Google Maps here for your store locations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
