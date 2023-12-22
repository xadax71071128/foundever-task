import { TCryptoData } from "@/stores/crypto.types"

type TSortCharacter = {
  [key: string]: string
}

export const sorter = (order: string) => {
  switch (order) {
    case "id_asc":
      return sorterCharacters("name")
    case "id_desc":
      return sorterCharacters("name")
    case "market_cap_asc":
      return sorterPrices("eur", "market_cap")
    case "market_cap_desc":
      return sorterPrices("eur", "market_cap")
    case "volume_asc":
      return sorterPrices("eur", "total_volume")
    case "volume_desc":
      return sorterPrices("eur", "total_volume")
    default:
      return sorterCharacters("name")
  }
}

export const sorterCharacters = (index: string) => {
  return (a: TSortCharacter, b: TSortCharacter): number => {
    if (a[index] < b[index]) {
      return -1
    } else if (a[index] > b[index]) {
      return 1
    }
    return 0
  }
}

export const sorterPrices = (currency: string, index: string) => {
  return (a: TCryptoData, b: TCryptoData): number => {
    if (a.pricesByCurrencies[currency] && !b.pricesByCurrencies[currency]) return -1
    else if (b.pricesByCurrencies[currency] && !a.pricesByCurrencies[currency]) return 1
    else if (!b.pricesByCurrencies[currency] && !a.pricesByCurrencies[currency]) return 0
    else if (
      a.pricesByCurrencies[currency][index as keyof (typeof a.pricesByCurrencies)[typeof currency]] <
      b.pricesByCurrencies[currency][index as keyof (typeof a.pricesByCurrencies)[typeof currency]]
    ) {
      return -1
    } else if (
      a.pricesByCurrencies[currency][index as keyof (typeof a.pricesByCurrencies)[typeof currency]] >
      b.pricesByCurrencies[currency][index as keyof (typeof a.pricesByCurrencies)[typeof currency]]
    ) {
      return 1
    }
    return 0
  }
}

export const sorterSparkline7days = () => {
  return (a: TCryptoData, b: TCryptoData): number => {
    const A: any = a?.sparkline_in_7d
    const B: any = b?.sparkline_in_7d

    if (A && !B) return -1
    else if (!A && B) return 1

    try {
      const ALength = Object.keys(A).length
      const BLength = Object.keys(B).length

      if (ALength && !BLength) return -1
      else if (!ALength && BLength) return 1

      const Awin = isWinning(A)
      const Bwin = isWinning(B)
      if (Awin && !Bwin) return -1
      else if (!Awin && Bwin) return 1

      const sumA = A.reduce((acc: number, val: number) => acc + val, 0)
      const sumB = B.reduce((acc: number, val: number) => acc + val, 0)
      return sumB - sumA
    } catch (e) {
      return -1
    }
  }
}

const isWinning = (array: number[]) => array[0] < array[array.length - 1]
