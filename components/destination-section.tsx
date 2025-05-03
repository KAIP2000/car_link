import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const destinations = [
  {
    id: 1,
    name: "New York",
    image: "/placeholder.svg?height=200&width=300",
    slug: "new-york",
  },
  {
    id: 2,
    name: "Los Angeles",
    image: "/placeholder.svg?height=200&width=300",
    slug: "los-angeles",
  },
  {
    id: 3,
    name: "Miami",
    image: "/placeholder.svg?height=200&width=300",
    slug: "miami",
  },
  {
    id: 4,
    name: "Chicago",
    image: "/placeholder.svg?height=200&width=300",
    slug: "chicago",
  },
  {
    id: 5,
    name: "San Francisco",
    image: "/placeholder.svg?height=200&width=300",
    slug: "san-francisco",
  },
]

export function DestinationSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {destinations.map((destination) => (
        <Link key={destination.id} href={`/destinations/${destination.slug}`}>
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-48">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-medium">{destination.name}</h3>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
