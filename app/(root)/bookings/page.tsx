import { getAllBookings } from "@/lib/api";
import { columns} from "./columns"
import { DataTable } from "./data-table"



export default async function Bookings() {

  const bookings = await getAllBookings()
  const allBookings = bookings.data
  

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-xl font-medium">Bookings</h1>
      <DataTable columns={columns} data={allBookings} />
    </div>
  )
}