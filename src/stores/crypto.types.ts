export type TCryptoDefaultStates = {
  categoryActive: string | null
  cryptoFavorites: Map<string, TCryptoData>
  cryptoList: Map<string, TCryptoData>
  currenciesList: string[]
  currentList: any[]
  currentOrder: string
  currentPage: number
  currencyActive: string
  isReadyCryptoStore: number,
  filterIds: string[]
}
export type TCryptoList = {
  [key: string]: TCryptoData
}

export type TEntryCryptoData = {
  id: string
  image: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_24h: number
  sparkline_in_7d: {
    price: number[]
  }
}

export type TCryptoData = {
  id: string
  name: string
  symbol: string
  image?: string
  category?: string
  sparkline_in_7d?: number[]
  pricesByCurrencies: {
    [key: string]: {
      current_price: number
      market_cap: number
      total_volume: number
      price_change_24h: number
    }
  }
}

export type TEntryCategoryData = {
  category_id: string
  name: string
}

export type TCategoryData = {
  id: string
  name: string
}
