import { BookingsByCountryChart } from '@/components/tour-chart';
import { getAnalytics } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Award,
  XCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define types for analytics data
type BookingStatus = {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  count: string;
}

type MonthlyBooking = {
  month: string;
  count: string;
}

type TopJourney = {
  journey: string;
  bookings: string;
}

type BookingByCountry = {
  country: string;
  count: string;
}

type AnalyticsData = {
  totalJourneys: string;
  totals: {
    totalBookings: string;
    totalRevenue: string;
    avgGuests: string;
  };
  bookingsByStatus: BookingStatus[];
  monthlyBookings: MonthlyBooking[];
  topJourneys: TopJourney[];
  bookingsByCountry: BookingByCountry[];
  cancellationRate: number;
}

const Analytics = async () => {
  const analyticsData: AnalyticsData = await getAnalytics();
  const [analytics] = await Promise.all([analyticsData]);

  return (
    <section className='space-y-3 font-sans pb-10'>
      <div>
        <h1 className='font-bold text-2xl'>Analytics</h1>
        <p className='text-muted-foreground text-sm'>Tour performance insights and metrics</p>
      </div>

      {/* Top KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
        <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl">
          <CardContent className="py-3">
            <div className="flex items-center gap-x-3.5">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardDescription className="text-xs">Total Bookings</CardDescription>
                <h1 className="text-3xl font-bold">{analytics.totals.totalBookings}</h1>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl">
          <CardContent className="py-3">
            <div className="flex items-center gap-x-3.5">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <Users className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <CardDescription className="text-xs">Avg Guests</CardDescription>
                <h1 className="text-3xl font-bold">
                  {Math.round(parseFloat(analytics.totals.avgGuests))}
                </h1>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl">
          <CardContent className="py-3">
            <div className="flex items-center gap-x-3.5">
              <div className="p-3 bg-amber-500/10 rounded-2xl">
                <DollarSign className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <CardDescription className="text-xs">Total Revenue</CardDescription>
                <h1 className="text-3xl font-bold">
                  ${parseFloat(analytics.totals.totalRevenue).toFixed(0)}
                </h1>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl">
          <CardContent className="py-3">
            <div className="flex items-center gap-x-3.5">
              <div className="p-3 bg-red-500/10 rounded-2xl">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <CardDescription className="text-xs">Cancellation Rate</CardDescription>
                <h1 className="text-3xl font-bold">
                  {analytics.cancellationRate.toFixed(1)}%
                </h1>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid lg:grid-cols-3 gap-3'>
        {/* Bookings by Country Chart */}
        <div className="lg:col-span-1">
          <BookingsByCountryChart bookingsByCountry={analytics.bookingsByCountry}/>
        </div>

        {/* Booking Status */}
        <div className="lg:col-span-1 gap-3 flex flex-col">
          <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Booking Status
              </CardTitle>
              <CardDescription>Current booking distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.bookingsByStatus.map((status: BookingStatus) => (
                <div key={status.status} className="flex items-center justify-between p-3 rounded-2xl bg-accent/50">
                  <div className="flex items-center gap-2">
                    {status.status === 'CONFIRMED' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {status.status === 'PENDING' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {status.status === 'CANCELLED' && <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="font-medium text-sm capitalize">{status.status.toLowerCase()}</span>
                  </div>
                  <Badge variant="outline" className="font-bold">
                    {status.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bookings by Country List */}
          <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Bookings by Country
              </CardTitle>
              <CardDescription>Distribution across destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.bookingsByCountry.map((country: BookingByCountry) => {
                  const total = analytics.bookingsByCountry.reduce(
                    (sum: number, c: BookingByCountry) => sum + parseInt(c.count), 
                    0
                  );
                  const percentage = ((parseInt(country.count) / total) * 100).toFixed(1);
                  
                  return (
                    <div key={country.country} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm capitalize">{country.country}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{percentage}%</span>
                          <Badge variant="outline" className="font-bold">
                            {country.count}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-accent rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Bookings */}
        <div className="lg:col-span-1">
          <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Bookings
              </CardTitle>
              <CardDescription>Bookings by month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.monthlyBookings.map((month: MonthlyBooking) => {
                const date = new Date(month.month + '-01');
                const monthName = date.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                });
                return (
                  <div key={month.month} className="flex items-center justify-between p-3 rounded-2xl bg-accent/50">
                    <span className="font-medium text-sm">{monthName}</span>
                    <Badge variant="outline" className="font-bold">
                      {month.count} bookings
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Journeys */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Journeys
            </CardTitle>
            <CardDescription>Most popular destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topJourneys.map((journey: TopJourney, index: number) => (
                <div key={journey.journey} className="flex items-center gap-3 p-3 rounded-2xl bg-accent/50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{journey.journey}</p>
                  </div>
                  <Badge variant="outline" className="font-bold">
                    {journey.bookings} bookings
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Analytics