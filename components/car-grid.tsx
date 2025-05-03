import Image from "next/image"
import Link from "next/link"

const cars = [
  {
    id: 1,
    name: "Luxury Sedan",
    image: "/placeholder.svg?height=200&width=300",
    category: "Sedan",
  },
  {
    id: 2,
    name: "Vintage Camper",
    image: "/placeholder.svg?height=200&width=300",
    category: "Camper",
  },
  {
    id: 3,
    name: "Sports Car",
    image: "/placeholder.svg?height=200&width=300",
    category: "Sports",
  },
  {
    id: 4,
    name: "Off-Road SUV",
    image: "/placeholder.svg?height=200&width=300",
    category: "SUV",
  },
  {
    id: 5,
    name: "Electric Sedan",
    image: "/placeholder.svg?height=200&width=300",
    category: "Electric",
  },
  {
    id: 6,
    name: "Luxury SUV",
    image: "/placeholder.svg?height=200&width=300",
    category: "SUV",
  },
  {
    id: 7,
    name: "Sports Coupe",
    image: "/placeholder.svg?height=200&width=300",
    category: "Sports",
  },
  {
    id: 8,
    name: "Convertible",
    image: "/placeholder.svg?height=200&width=300",
    category: "Convertible",
  },
]

export function CarGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {cars.map((car) => (
        <Link key={car.id} href={`/cars/${car.id}`} className="group overflow-hidden rounded-lg">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={car.image || "/placeholder.svg"}
              alt={car.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </Link>
      ))}
    </div>
  )
}
