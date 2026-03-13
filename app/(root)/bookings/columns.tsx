"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, X, SignatureIcon, CheckCircle2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
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
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { approveBooking, cancelBooking, completeBooking } from "@/lib/api"
import { deleteBookingAction } from "@/lib/actions"

// Define the shape of your booking data
export type Booking = {
  booking: {
    id: string
    fullName: string
    email: string
    phone: string
    journeyId: string
    travelDate: string
    numberOfGuests: number
    status: "PENDING" | "CONFIRMED" | "CANCELLED"
    totalAmount: string
    currency: string
    createdAt: string
    updatedAt: string
  }
  journey: {
    id: string
    name: string
    slug: string
    imgUrl: string
    location: string
    numberOfDays: number
    country: string
    rating: number
  }
}
// Actions cell component with state
function BookingActions({ booking }: { booking: Booking['booking'] }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showDeleteBookingDialog, setShowDeleteBookingDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancelBooking = async () => {
    try {
      setIsLoading(true);
      toast.loading("Cancelling booking...");
      
      await cancelBooking(booking.id);
      
      toast.dismiss();
      toast.success("Booking cancelled successfully");
      setShowDeleteDialog(false);
      router.refresh(); // Refresh the page data
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to cancel booking");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveBooking = async () => {
    try {
      setIsLoading(true);
      toast.loading("Approving booking...");
      
      await approveBooking(booking.id);
      
      toast.dismiss();
      toast.success("Booking approved successfully");
      setShowConfirmDialog(false);
      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to approve booking");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteBooking = async () => {
    try {
      setIsLoading(true);
      toast.loading("Completing booking...");
      
      await completeBooking(booking.id);
      
      toast.dismiss();
      toast.success("Booking completed successfully");
      setShowCompleteDialog(false);
      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to complete booking");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

const handleDeleteBooking = async () => {
  try {
    setIsLoading(true);
    toast.loading("Deleting booking...");
    
    const result = await deleteBookingAction(booking.id);
    
    toast.dismiss();
    
    // ✅ Check if deletion was successful
    if (!result.success) {
      toast.error(result.error || "Failed to delete booking");
      setIsLoading(false);
      return;
    }
    
    toast.success("Booking deleted successfully");
    setShowDeleteDialog(false);
    router.refresh();
    
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to delete booking");
    console.error(error);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-3xl bg-accent/45 backdrop-blur-2xl">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(booking.id);
              toast.success("Booking ID copied to clipboard");
            }}
          >
            Copy booking ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Contact customer</DropdownMenuItem>
          <DropdownMenuItem 
            className="text-green-600"
            onSelect={(e) => {
              e.preventDefault()
              setShowConfirmDialog(true)
            }}
          >
            Approve booking
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-amber-600"
            onSelect={(e) => {
              e.preventDefault()
              setShowCompleteDialog(true)
            }}
          >
            Complete booking
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600"
            onSelect={(e) => {
              e.preventDefault()
              setShowDeleteDialog(true)
            }}
          >
            Cancel booking
          </DropdownMenuItem>
          <DropdownMenuSeparator />
           <DropdownMenuItem  variant="destructive"
            onSelect={(e)=> {
              e.preventDefault()
              setShowDeleteBookingDialog(true)
            }}
           >
          <Trash2 />
           Delete booking
        </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cancel Booking Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-100 dark:bg-red-900/20">
              <X className="text-red-600 dark:text-red-400" />
            </AlertDialogMedia>
            <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently cancel the booking for {booking.fullName}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" className="rounded-3xl" disabled={isLoading}>
              Go back
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelBooking}
              disabled={isLoading}
              className="rounded-3xl bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Cancelling..." : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Booking Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-green-100 dark:bg-green-900/20">
              <SignatureIcon className="text-green-600 dark:text-green-400" />
            </AlertDialogMedia>
            <AlertDialogTitle>Approve booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will approve the booking for {booking.fullName} and send them a confirmation email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" className="rounded-3xl" disabled={isLoading}>
              Go back
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApproveBooking}
              disabled={isLoading}
            >
              {isLoading ? "Approving..." : "Approve Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Booking Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent  className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-amber-100 dark:bg-amber-900/20">
              <CheckCircle2 className="text-amber-600 dark:text-amber-400" />
            </AlertDialogMedia>
            <AlertDialogTitle>Complete booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this booking as completed for {booking.fullName}. This indicates the tour has been successfully delivered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" className="rounded-3xl" disabled={isLoading}>
              Go back
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCompleteBooking}
              disabled={isLoading}
            >
              {isLoading ? "Completing..." : "Complete Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Delete Booking Dialog */}
      <AlertDialog open={showDeleteBookingDialog} onOpenChange={setShowDeleteBookingDialog}>
        <AlertDialogContent  className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-100 dark:bg-red-900/20">
              <Trash2 className="text-red-600 dark:text-red-400" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking for {booking.fullName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" className="rounded-3xl" disabled={isLoading}>
              Go back
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBooking}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const columns: ColumnDef<Booking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "journey.name",
    header: "Journey",
    cell: ({ row }) => {
      const journey = row.original.journey
      return (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
            <Image
              src={journey.imgUrl}
              alt={journey.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-sm">{journey.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{journey.country}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "booking.fullName",
    id: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const booking = row.original.booking
      return (
        <div>
          <p className="font-medium">{booking.fullName}</p>
          <p className="text-xs text-muted-foreground">{booking.email}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "booking.phone",
    header: "Phone",
  },
  {
    accessorKey: "booking.numberOfGuests",
    header: () => <div className="text-center">Guests</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center text-[15px] font-medium">
          {row.original.booking.numberOfGuests}
        </div>
      )
    },
  },
  {
    accessorKey: "booking.travelDate",
    header: "Travel Date",
    cell: ({ row }) => {
      const date = new Date(row.original.booking.travelDate)
      return (
        <div className="text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      )
    },
  },
  {
    accessorKey: "journey.numberOfDays",
    header: () => <div className="text-center">Duration</div>,
    cell: ({ row }) => {
      const days = row.original.journey.numberOfDays
      return (
        <div className="text-center">
          <Badge variant="outline" className="font-medium">
            {days === 1 ? "1 day": `${days} days`}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "booking.status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.booking.status
      const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      }
      return (
        <Badge className={statusColors[status]} variant="outline">
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "booking.totalAmount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.booking.totalAmount)
      const currency = row.original.booking.currency
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <BookingActions booking={row.original.booking} />
    },
  },
]