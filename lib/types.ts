export interface ServerType {
  id: string
  name: string
  description: string
  longDescription?: string
  category: string
  downloads: number
  rating: number
  reviews: number
  author: string
  version: string
  lastUpdated: string
  requirements: string[]
  features: string[]
  image?: string
  featured?: boolean
  serverCode?: {
    main: string
    package: string
    client: string
    types?: string
  }
}

