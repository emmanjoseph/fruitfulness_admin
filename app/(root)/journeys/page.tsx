import Pagination from '@/components/Pagination';
import TripsGrid from '@/components/TripsGrid'
import { Button } from '@/components/ui/button';
import { getAllTrips } from '@/lib/api';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{
    page?: string;
    tags?: string;
    country?: string;
    q?: string;
  }>;
};

const Journeys =async ({searchParams}:Props) => {
   const params = await searchParams;
   const page = Number(params.page) || 1;

  const trips = await getAllTrips({
    page,
    limit: 10,
    tags: params.tags,
    country: params.country,
    search: params.q,
  });
  // console.log("trips", trips.data);
  
  return (
    <section className='font-sans'>
      <div className="flex justify-between">
         <div className="flex items-center">
        <h1 className="text-xl font-bold">Journeys</h1>
        <span className="ml-2 text-sm">({trips.meta.total} journeys)</span>
      </div>

      <Button asChild>
        <Link href={'/journeys/add-new'}>
          Create New Journey        
        </Link>
      </Button>
      </div>
     
      
      <TripsGrid trips={trips.data}/>
      <Pagination
        currentPage={page}
        totalPages={trips.meta.totalPages}
        basePath="/journeys"
      />
    </section>
  )
}

export default Journeys