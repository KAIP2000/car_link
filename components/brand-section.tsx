import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const brands = [
  {
    id: 1,
    name: "Mercedes-Benz",
    image: "/placeholder.svg?height=200&width=300",
    slug: "mercedes-benz",
  },
  {
    id: 2,
    name: "Tesla",
    image: "/placeholder.svg?height=200&width=300",
    slug: "tesla",
  },
  {
    id: 3,
    name: "Volkswagen",
    image: "/placeholder.svg?height=200&width=300",
    slug: "volkswagen",
  },
  {
    id: 4,
    name: "Porsche",
    image: "/placeholder.svg?height=200&width=300",
    slug: "porsche",
  },
  {
    id: 5,
    name: "BMW",
    image: "/placeholder.svg?height=200&width=300",
    slug: "bmw",
  },
]

export function BrandSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {brands.map((brand) => (
        <Link key={brand.id} href={`/brands/${brand.slug}`}>
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-48">
                <Image src={brand.image || "/placeholder.svg"} alt={brand.name} fill className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-medium">{brand.name}</h3>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
