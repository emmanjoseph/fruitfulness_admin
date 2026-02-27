/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { getAllBookings, getAllTrips, getAnalytics } from "@/lib/api";
import { Banknote, BellIcon, BookMarked, PalmtreeIcon, Users2 } from "lucide-react";
import { TourChart } from "@/components/tour-chart";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export default async function Home() {
  const greeting = Date().includes("AM")? "Good Morning" : "Good Evening";
  const analyticsData = await getAnalytics();
  const recentBookingsData = await getAllBookings();
  const tripsData = await getAllTrips({
    page:1,
    limit:5
  })
  // console.log(recentBookingsData.data);

  const [analytics,recentBookings,trips]= await Promise.all([analyticsData,recentBookingsData.data,tripsData.data]);

 

  return (
    <div className=" min-h-screen font-sans">
      <div className="flex flex-col space-y-3">
          <div className="flex flex-row justify-between">
             <div>
                <h1 className="font-medium text-sm">{greeting} &#128075;</h1>
                <h2 className="text-xl font-bold">Welcome back, Admin</h2>
             </div>

             <div className="flex gap-x-4">
              <Button variant={'secondary'} size={'icon-lg'} className="rounded-full">
               <BellIcon/>
             </Button>

             <ModeToggle/>
             </div>
             
          </div>

           {/* kpi cards */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-3">
        <Card className="rounded-4xl bg-violet-200/15 dark:bg-orange-200/15 backdrop-blur-lg shadow">
              <CardContent>
                   <div className="flex items-center gap-x-3.5">
                    <PalmtreeIcon size={40} className="text-green-400"/>
                    <div>
                       <CardDescription className="font-semibold"> Total destinations</CardDescription>
                       <h1 className="text-4xl font-extrabold">{analytics.totalJourneys}</h1>
                    </div>
                         
            </div>

          </CardContent>
          
        </Card>
        <Card className="rounded-4xl bg-indigo-200/15 dark:bg-teal-200/15 backdrop-blur-lg shadow">
           <CardContent>
                   <div className="flex items-center gap-x-3.5">
                    <BookMarked className="text-red-500" size={40}/>
                    <div>
                       <CardDescription className="font-semibold"> Total bookings</CardDescription>
                       <h1 className="text-4xl font-extrabold">{analytics.totals.totalBookings}</h1>
                    </div>
                         
            </div>

          </CardContent>
        </Card>
        <Card className="rounded-4xl bg-rose-200/15 dark:bg-cyan-200/15 backdrop-blur-lg shadow">
          <CardContent>
                   <div className="flex items-center gap-x-3.5">
                    <Users2 className="text-indigo-500" size={40}/>
                    <div>
                       <CardDescription> Average guests</CardDescription>
                       <h1 className="text-4xl font-extrabold">{Math.round(analytics.totals.avgGuests)}</h1>
                    </div>
                         
            </div>

          </CardContent>
        </Card>
        <Card className="rounded-4xl bg-amber-200/15 dark:bg-fuchsia-200/15 backdrop-blur-lg shadow">
           <CardContent>
                   <div className="flex items-center gap-x-3.5">
                    <Banknote className="text-amber-500" size={40}/>
                    <div>
                       <CardDescription> Average guests</CardDescription>
                       <h1 className="text-4xl font-extrabold">${Math.round(analytics.totals.totalRevenue)}</h1>
                    </div>
                         
            </div>

          </CardContent>
        </Card>
      </div>


      <div className="flex flex-col lg:flex-row gap-2 ">
        <div className="lg:w-3/7">
          <TourChart monthlyBookings={analytics.monthlyBookings} />
        </div>

        <div className="lg:w-4/7">
        
<Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl">
  <CardContent className="space-y-2 py-2">
    <div className="flex flex-row items-center justify-between px-3 py-1">
      <h1 className="font-semibold">Recent bookings</h1>
      <Link href={"/bookings"}>
        <Button size={'sm'} variant={'secondary'} className="font-semibold cursor-pointer">
          View all bookings
        </Button>
      </Link>
    </div>
    
    {recentBookings.slice(0, 3).map((item: any) => (
      <div 
        key={item.booking.id} 
        className="flex items-center gap-3 p-4 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
      >
        {/* Journey Image - Smaller */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
          <Image 
            src={item.journey.imgUrl} 
            alt={item.journey.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate leading-tight">
            {item.journey.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {item.booking.fullName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {item.booking.email}
          </p>
        </div>

        {/* Badges - Horizontal Layout */}
        <div className="shrink-0 flex flex-col items-center
         gap-2">
          <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            <p className="text-xs font-semibold whitespace-nowrap">
              {item.journey.numberOfDays}days
            </p>
          </div>
          <div className={`px-2.5 py-1 rounded-full ${item.booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : item.booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
            <p className="text-xs font-semibold uppercase">
              {item.booking.status}
            </p>
          </div>
        </div>
      </div>
    ))}
  </CardContent>
</Card>
</div>
      </div>

   

     <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl p-0">
     
  <div className="p-6">
     <div className="flex flex-row items-center justify-between px-2 pb-2">   
      <h1 className="font-semibold">Recent destinations</h1>

    <Link href={"/journeys"} className="text-sm font-semibold text-accent-foreground">
       <Button size={'sm'} variant={'secondary'} className="font-semibold cursor-pointer">
         View all destinations
       </Button>
    </Link>
  </div>
     <Table >
    <TableHeader>
      <TableRow>
        <TableHead>Destination</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Country</TableHead>
        <TableHead className="text-right">Duration</TableHead>
        <TableHead className="text-right">Rating</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {trips.map((trip: any) => (
        <TableRow key={trip.id} className="hover:bg-accent/30">
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 ring-2 ring-background">
                <Image 
                  src={trip.imgUrl} 
                  alt={trip.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-sm">{trip.name}</p>
                <p className="text-xs text-muted-foreground">{trip.slug}</p>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-sm">{trip.location}</TableCell>
          <TableCell>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
              {trip.country}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold">
              {trip.numberOfDays} days
            </span>
          </TableCell>
          <TableCell className="text-right">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <span className="font-semibold text-sm text-amber-700 dark:text-amber-300">
                {trip.rating}
              </span>
              <span className="text-amber-500">★</span>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  </div>
 
</Card>
      </div>

     
    </div>
  );
}
