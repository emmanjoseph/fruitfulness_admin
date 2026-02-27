import Link from "next/link";
import Image from "next/image";
import { Pen, StarIcon } from "lucide-react";

const shortenText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TripsGrid({ trips }: { trips: any[] }) {
  if (!trips?.length) return <p className="mt-10">No journeys found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
      {trips.map((trip) => (
         <Link key={trip.id} href={`/details/${trip.id}`} className="rounded-[40px]">
      {/* images */}
      <div className="relative w-full h-60 rounded-[40px]">
         <Image src={trip.imgUrl} alt={trip.id} width={500} height={500} className='w-full h-full object-cover rounded-[40px]'/>
      </div>
       

      <div className="p-4">
        <h3 className="font-semibold text-sm">
           {shortenText(trip.name, 20)}
        </h3>
        <p className="text-sm text-gray-500 font-medium">{trip.location}</p>
        <p className="text-sm mt-1 flex items-center gap-x-1.5 font-semibold"><StarIcon size={16} className="font-semibold text-amber-500 fill-amber-500"/> {trip.rating} | {trip.numberOfDays} days</p>
      </div>
    </Link>
      ))}
    </div>
  );
}
