import { defineStore } from "pinia"
import useStorage from "@/composables/useStorage"
import { LOCALSTORAGE_CRYPTO_CURRENCY, LOCALSTORAGE_CRYPTO_FAVORITES } from "@/app.storages"
import type { TCryptoDefaultStates, TCryptoData, TEntryCryptoData } from "./crypto.types"
import useLocalStorage from "@/composables/useLocalStorage"
import useHttpService from "@/composables/useHttpService"

const URL_API = "https://api.coingecko.com/api/v3"
const PER_PAGE = 250

export const useCryptoStore = defineStore({
  id: "crypto",

  state: () =>
    ({
      cryptoList: new Map<string, TCryptoData>(),
      currenciesList: [],
      currentList: [],
      currencyActive: useLocalStorage.get(LOCALSTORAGE_CRYPTO_CURRENCY) || "eur",
      categoryActive: null,
      cryptoFavorites: _loadFavorites(),
      filterIds: [],
      isReadyCryptoStore: 0,
      currentOrder: "market_cap_desc",
      currentPage: 1
    }) as TCryptoDefaultStates,

  actions: {
    setSort(order: string, direction: string) {
      console.log("set sort: ", order, direction)
      // market_cap_asc, market_cap_desc, volume_asc, volume_desc, id_asc, id_desc
      if (order !== "market_cap" && order !== "volume" && order !== "id") return
      if (direction !== "asc" && direction !== "desc") return
      this.currentOrder = `${order}_${direction}`
      this.currentPage = 1
    },
    filterByName(name: string) {
      if (!name) {
        this.filterIds = []
        return
      }
      const ids: string[] = []
      this.cryptoList.forEach((value, id) => {
        if (value.name.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
          ids.push(id)
        }
      })
      this.filterIds = ids
    },
    filterByIds(ids: string[]) {
      if (ids.length === 0) {
        this.filterIds = []
        return
      }
      const tmp: string[] = []
      ids.forEach((id) => {
        if (this.cryptoList.has(id)) {
          tmp.push(id)
        }
      })
      this.filterIds = tmp
    },
    setPage(page: number) {
      this.currentPage = page
    },
    nextPage() {
      this.currentPage += 1
    },
    async fetchCurrenciesList(): Promise<void> {
      const cacheCurrencies = await useStorage.get("crypto", "currencies_cache")
      if (cacheCurrencies && cacheCurrencies.length) {
        console.log("data from cache: currencies")
        this.currenciesList = cacheCurrencies
      } else {
        const data = await useHttpService.get(`${URL_API}/simple/supported_vs_currencies`)
        if (data && data.length) this.currenciesList = data
        await useStorage.set("crypto","currencies_cache", data)
      }
      this.isReadyCryptoStore += 1
    },

    async fetchCryptoList(): Promise<void> {
      const cacheCryptoList = await useStorage.get("crypto", "crypto_cache")
      if (cacheCryptoList && cacheCryptoList.length) {
        console.log("data from cache: crypto")
        cacheCryptoList.forEach(([index, e]: [index: string, e: TCryptoData]) => {
          this.cryptoList.set(index, e)
        })
      } else {
        const data = await useHttpService.get(`${URL_API}/coins/list`)
        if (data && data.length)
          for (const e of data) {
            this.cryptoList.set(e.id, { ...e, pricesByCurrencies: {} })
          }
        await useStorage.set("crypto", "crypto_cache", Array.from(this.cryptoList))
      }
      this.isReadyCryptoStore += 1
    },

    async fetchCryptosInfos(ids: string[] = []): Promise<boolean> {

      const query: any = {
        vs_currency: this.currencyActive,
        per_page: PER_PAGE,
        page: this.currentPage,
        include_24h_vol: true,
        include_24hr_change: true,
        include_last_updated_at: true,
        sparkline: true,
        order: this.currentOrder
      }
      const idsToFetch = [...this.filterIds, ...ids]
      if (idsToFetch.length > 0) {
        query.ids = idsToFetch.join(",")
      }

      if (idsToFetch.length > 0 && idsToFetch.length <= 250) {
        let hasError = false
        const items = idsToFetch.map((id) => {
          const item = this.cryptoList.get(id)
          if (!item || !item.image) {
            hasError = true
          }
          return item
        })
        if (!hasError) {
          console.log('cache fetch cryptos')
          this.currentList = items
          return true
        }
      }

      const cacheKey = `markets_${this.currencyActive}_${this.currentOrder}_${this.currentPage}${query.ids ? `_${query.ids}` : ""}`
      const cacheData = await useStorage.get("crypto", cacheKey)
      let data = null

      if (cacheData) {
        console.log("data from cache: markets")
        data = cacheData
      } else {
        data = await useHttpService.get(`${URL_API}/coins/markets`, query)
        if (data) {
          await useStorage.set("crypto", cacheKey, data)
        } else {
          return false
        }
      }

      if (data) {
        this.currentList = this.currentPage === 1 ? data : [...this.currentList, ...data]
        const responseArray: TEntryCryptoData[] = Object.values(data)
        if (responseArray.length) {
          responseArray.map((value) => {
            const key = value.id
            const item = this.cryptoList.get(key)
            if (item) {
              item.image = value.image
              item.sparkline_in_7d = value.sparkline_in_7d.price
              item.pricesByCurrencies[this.currencyActive] = {
                current_price: value.current_price,
                market_cap: value.market_cap,
                total_volume: value.total_volume,
                price_change_24h: value.price_change_24h
              }
              this.cryptoList.set(key, item)
              if (this.cryptoFavorites.get(key)) this.cryptoFavorites.set(key, item)
            }
          })
          console.log('wtf', JSON.stringify(Array.from(this.cryptoList)).length)
          await useStorage.set("crypto","crypto_cache", Array.from(this.cryptoList))
        }
      }

      return true
    },

    async setCurrencyActive(currency: string) {
      this.currencyActive = currency
      useLocalStorage.set(LOCALSTORAGE_CRYPTO_CURRENCY, this.currencyActive)
    },

    async addFavorite(crypto: TCryptoData) {
      this.cryptoFavorites.set(crypto.id, {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.name,
        pricesByCurrencies: {}
      })
      useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, Array.from(this.cryptoFavorites))
    },

    async removeFavorite(crypto: TCryptoData) {
      this.cryptoFavorites.delete(crypto.id)
      useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, Array.from(this.cryptoFavorites))
    }
  }
})

const _loadFavorites = (): Map<string, TCryptoData> => {
  const favorites: [string, TCryptoData][] = useLocalStorage.get(LOCALSTORAGE_CRYPTO_FAVORITES)
  if (!favorites || favorites.length == 0) {
    return new Map()
  }
  const map = new Map<string, TCryptoData>()
  for (const [key, value] of Object.values(favorites)) map.set(key, value)
  return map
}
