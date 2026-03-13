/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchJourneyById } from '@/lib/api'
import { IconClock, IconPlayVolleyball } from '@tabler/icons-react'
import { ArrowLeft, Calendar1, MapPin,Pen,Shield,StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"
import { deleteJourneyAction } from '@/lib/actions'
import { toast } from 'sonner'

const DetailsPage = () => { 
  const { id } = useParams()
  const idParam = Array.isArray(id) ? id[0] : id
  const [journeyDetails, setJourneyDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter()

const handleDelete = async () => {
  if (!idParam) return;
  
  setIsDeleting(true);
  
  try {
    const result = await deleteJourneyAction(idParam);
    
    // ✅ Check if deletion was successful
    if (!result.success) {
      toast.error(result.error || "Failed to delete journey");
      return;
    }
    
    toast.success("Journey deleted successfully");
    router.push('/journeys');
    router.refresh(); // ✅ Force refresh to update the list
    
  } catch (err) {
    console.error('Delete failed:', err);
    toast.error("An error occurred while deleting");
  } finally {
    setIsDeleting(false);
  }
}


  useEffect(() => {
    const getJourneyDetails = async () => {
      if (idParam) {
        try {
          const details = await fetchJourneyById(idParam);
          console.log("Journey details", details);
          setJourneyDetails(details)
        } catch (error) {
          console.error("Error fetching details:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    getJourneyDetails()
  }, [idParam]);

  if (loading) return (
  <div className='max-w-3xl mx-auto px-4 md:px-0 py-20 text-center flex items-center flex-col space-y-3'>
    <Skeleton className="h-12 w-3/4 rounded-xl" />
    <Skeleton className="h-[225px] w-9/10 rounded-[30px]" />
    <Skeleton className="h-[125px] w-9/10  rounded-[30px]" />
    <Skeleton className="h-12 w-1/2 rounded-[30px]" />
    <Skeleton className="h-12 w-1/2 rounded-[30px]" />
  </div>
)
  if (!journeyDetails) return <div className='py-20 text-center'>Journey not found</div>

  const details = journeyDetails.data || journeyDetails;

  return (
    <section className='py-5 max-w-3xl mx-auto px-4 md:px-0 space-y-3.5 font-sans'>
      <div className="flex items-center justify-between pb-4">
          <Button className='flex items-center gap-x-1.5 px-7 py-2 cursor-pointer shadow-md rounded-[10px] hover:shadow-lg transition' onClick={router.back}>
        <ArrowLeft size={16}/>
        <p className="text-gray-600 font-semibold text-sm">Go back</p>
      </Button>

      <Link href={`/journeys/edit/${journeyDetails.id}`} className='flex items-center gap-x-1.5 font-semibold text-[15px]'>
      <Pen size={15}/>
        <span>Edit Journey</span>
      </Link>
      </div>
    

      <h1 className="text-xl font-bold">{details.name}</h1>
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-6">
        <p className="font-medium flex items-center gap-x-1.5 text-sm"><Calendar1 size={16}/>{details.numberOfDays} day plan</p>

        <p className="font-medium flex items-center gap-x-1.5 text-sm"><MapPin size={16}/>{details.location}</p>
      </div>

        {/* stars and rating */}
        <div className="flex items-center gap-x-2">
          {Array.from({ length: Math.round(details.rating) }).map((_, index) => (
           <StarIcon key={index} size={16} className='text-yellow-500 fill-yellow-500'/>
          ))}
          <Badge className="text-sm bg-amber-500 text-white font-bold">
            {details.rating} / 5.0 
          </Badge>
        </div>
      </div>
      

      {/* image */}
      <Image
                 src={details.imgUrl || "https://images.unsplash.com/photo-1716404211069-dc368a7247fd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGtpbGltYW5qYXJvJTIwbW91bnRhaW58ZW58MHx8MHx8fDA%3D"}
                 alt={details.name}
                 width={700}
                 height={700}
                 className='w-full h-60 md:h-80 rounded-[30px] object-cover'
              />
      
     

      <h1 className='text-lg font-semibold'>Overview</h1>

      <p className='text-[15px]'>{details.description}</p>

      {/* Tags */}
{details.tags?.length > 0 && (
  <div className="flex gap-2 overflow-x-auto py-3">
    {details.tags.map((tag: string, index: number) => (
      <Badge key={index} className="px-3 py-1.5">
        {tag}
      </Badge>
    ))}
  </div>
)}

{/* Itinerary */}
{details.itineraries?.length > 0 && (
  <div>
    <h2 className="text-lg font-semibold mb-2">Itinerary</h2>

    {details.itineraries.map((item: any) => (
      <Card
        key={item.id}
        className="mb-5 p-4 rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Day {item.day}: {item.title}
          </h3>
          <span className="text-xs bg-emerald-600 text-white px-3 py-2 rounded-full">
            Day {item.day}
          </span>
        </div>

        <p className="text-sm mt-2">{item.details}</p>
      </Card>
    ))}
  </div>
)}

{/* Activities */}
{details.activities?.length > 0 && (
  <div>
    <h2 className="text-lg font-semibold mb-3 flex items-center gap-x-1.5"><IconPlayVolleyball/> Activities</h2>
    <div className="space-y-2">
      {details.activities.map((activity: string, index: number) => (
        <Card
          key={index}
          className="mb-5 p-4 rounded-3xl"
        >
          {activity}
        </Card>
      ))}
    </div>
  </div>
)}

{/* Best Time */}
{details.bestTimeToVisit && (
  <div>
    <h2 className="text-lg font-semibold mb-3 flex items-center gap-x-1.5"><IconClock/>Best Time to Visit</h2>
    <p className="text-[15px]">{details.bestTimeToVisit}</p>
  </div>
)}

{/* Pricing */}
{details.pricing?.length > 0 && (
  <div>
    <h2 className="text-lg font-semibold mb-3">Pricing</h2>

    <div className="space-y-4">
      {details.pricing.map((price: any, index: number) => (
        <Card
          key={index}
          className="mb-5 p-6 rounded-4xl border-none"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {price.tier}
            </h3>
            <Badge className="bg-emerald-600 text-white">
              {price.currency}
            </Badge>
          </div>

          <div className="mt-2 text-sm space-y-1">
            <p>
              <strong>Citizen:</strong> {price.citizenPrice}
            </p>
            <p>
              <strong>Non-Resident:</strong> {price.nonResidentPrice}
            </p>
            <p>
              <strong>Accommodation:</strong> {price.accommodation}
            </p>

            {price.transportation && (
              <p>
                <strong>Transport:</strong>{" "}
                {price.transportation.type} –{" "}
                {price.transportation.description}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  </div>
)}

{/* Transportation (top-level, if exists) */}
{details.transportation && (
  <div>
    <h2 className="text-lg font-semibold mb-2">Transportation</h2>
    <div className="p-4 border-l-4 border-emerald-500 bg-gray-50 rounded">
      {details.transportation}
    </div>
  </div>
)}


      {/* Danger Zone */}
      <Card className="rounded-3xl border-red-200 dark:border-red-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </div>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-2xl">
            <div>
              <h4 className="font-semibold text-sm">Delete Journey</h4>
              <p className="text-sm text-muted-foreground">Permanently delete this journey</p>
            </div>
            <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Journey</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='rounded-4xl'>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete journey?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this journey and all associated data. This action cannot be undone. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" className='cursor-pointer
            text-white' onClick={handleDelete}>
              {isDeleting ?"Deleting .... " : "Yes, delete journey"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
          </div>
        </CardContent>
      </Card>




    </section>
  )
}

export default DetailsPage