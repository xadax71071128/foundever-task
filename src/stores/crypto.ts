import { reactive } from "vue"
import useHttpService from "@/composables/useHttpService"
import useLocalStorage from "@/composables/useLocalStorage"
import useStorage from "@/composables/useStorage"
import type { TCryptoData, TCryptoDefaultStates, TEntryCryptoData } from "@/stores/crypto.types"
import { sorter } from "@/utils/sorters"
import { LOCALSTORAGE_CRYPTO_CURRENCY, LOCALSTORAGE_CRYPTO_FAVORITES } from "@/app.storages"

const URL_API = "https://api.coingecko.com/api/v3"
const PER_PAGE = 250

const state: TCryptoDefaultStates = reactive({
  cryptoList: new Map(),
  currenciesList: [],
  currentList: [],
  currencyActive: useLocalStorage.get("currency") || "eur",
  categoryActive: null,
  cryptoFavorites: new Map(),
  filterIds: [],
  isReadyCryptoStore: 0,
  currentOrder: "market_cap_desc",
  currentPage: 1,
})

export const useCryptoStore = () => {
  const fetchCurrenciesList = async () => {
    console.log("state", state)
    const cacheCurrencies = await useStorage.get("crypto", "currencies_cache")
    if (cacheCurrencies && cacheCurrencies.length) {
      console.log("data from cache: currencies")
      state.currenciesList = cacheCurrencies
    } else {
      const data = await useHttpService.get(`${URL_API}/simple/supported_vs_currencies`)
      if (data && data.length) state.currenciesList = data
      await useStorage.set("crypto", "currencies_cache", data)
    }
    state.isReadyCryptoStore += 1
  }

  const fetchCryptoList = async () => {
    console.log("state", state)
    const cacheCryptoList = await useStorage.get("crypto", "crypto_cache")
    if (cacheCryptoList && cacheCryptoList.length) {
      console.log("data from cache: crypto")
      cacheCryptoList.forEach(([index, e]: [index: string, e: TCryptoData]) => {
        state.cryptoList.set(index, e)
      })
    } else {
      const data = await useHttpService.get(`${URL_API}/coins/list`)
      if (data && data.length)
        for (const e of data) {
          state.cryptoList.set(e.id, { ...e, pricesByCurrencies: {} })
        }
      await useStorage.set("crypto", "crypto_cache", Array.from(state.cryptoList))
    }
    state.isReadyCryptoStore += 1
  }

  const fetchCryptosInfos = async (ids: string[] = []) => {
    console.log("state", state)

    const query: any = {
      vs_currency: state.currencyActive,
      per_page: PER_PAGE,
      page: state.currentPage,
      include_24h_vol: true,
      include_24hr_change: true,
      include_last_updated_at: true,
      sparkline: true,
      order: state.currentOrder,
    }
    const idsToFetch = [...state.filterIds, ...ids]
    if (idsToFetch.length > 0) {
      query.ids = idsToFetch.join(",")
    }

    if (idsToFetch.length > 0 && idsToFetch.length <= 250) {
      let hasError = false
      const items: any[] = idsToFetch.map((id) => {
        const item = state.cryptoList.get(id)
        if (!item || !item.image) {
          hasError = true
        }
        return item
      })
      if (!hasError) {
        items.sort(sorter(state.currentOrder))
        if (state.currentOrder.indexOf("desc") !== -1) items.reverse()
        state.currentList = items
        return true
      }
    }

    const cacheKey = `markets_${state.currencyActive}_${state.currentOrder}_${state.currentPage}${
      query.ids ? `_${query.ids}` : ""
    }`
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
      state.currentList = state.currentPage === 1 ? data : [...state.currentList, ...data]
      const responseArray: TEntryCryptoData[] = Object.values(data)
      if (responseArray.length) {
        responseArray.map((value) => {
          const key = value.id
          const item = state.cryptoList.get(key)
          if (item) {
            item.image = value.image
            item.sparkline_in_7d = value.sparkline_in_7d.price
            item.pricesByCurrencies[state.currencyActive] = {
              current_price: value.current_price,
              market_cap: value.market_cap,
              total_volume: value.total_volume,
              price_change_24h: value.price_change_24h,
            }
            state.cryptoList.set(key, item)
            if (state.cryptoFavorites.get(key)) state.cryptoFavorites.set(key, item)
          }
        })
        console.log("wtf", JSON.stringify(Array.from(state.cryptoList)).length)
        await useStorage.set("crypto", "crypto_cache", Array.from(state.cryptoList))
      }
    }

    return true
  }

  const setSort = (order: string, direction: string) => {
    console.log("set sort: ", order, direction)
    // market_cap_asc, market_cap_desc, volume_asc, volume_desc, id_asc, id_desc
    if (order !== "market_cap" && order !== "volume" && order !== "id") return
    if (direction !== "asc" && direction !== "desc") return
    state.currentOrder = `${order}_${direction}`
    state.currentPage = 1
  }

  const filterByName = (name: string) => {
    if (!name) {
      state.filterIds = []
      return
    }
    const ids: string[] = []
    state.cryptoList.forEach((value, id) => {
      if (value.name.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
        ids.push(id)
      }
    })
    state.filterIds = ids
  }

  const filterByIds = (ids: string[]) => {
    if (ids.length === 0) {
      state.filterIds = []
      return
    }
    const tmp: string[] = []
    ids.forEach((id) => {
      if (state.cryptoList.has(id)) {
        tmp.push(id)
      }
    })
    state.filterIds = tmp
  }

  const setPage = (page: number) => {
    state.currentPage = page
  }

  const nextPage = () => {
    state.currentPage += 1
  }

  const setCurrencyActive = async (currency: string) => {
    state.currencyActive = currency
    useLocalStorage.set(LOCALSTORAGE_CRYPTO_CURRENCY, state.currencyActive)
  }

  const getFavorites = async () => {
    const favourites = useLocalStorage.get(LOCALSTORAGE_CRYPTO_FAVORITES)
    if (favourites && favourites.length) {
      favourites.forEach(([index, e]: [index: string, e: TCryptoData]) => {
        state.cryptoFavorites.set(index, e)
      })
    }
  }

  const addFavorite = async (crypto: any) => {
    state.cryptoFavorites.set(crypto.id, {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.name,
      pricesByCurrencies: {},
    })
    useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, Array.from(state.cryptoFavorites))
  }

  const removeFavorite = async (crypto: any) => {
    state.cryptoFavorites.delete(crypto.id)
    useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, Array.from(state.cryptoFavorites))
  }

  return {
    state,
    fetchCurrenciesList,
    fetchCryptoList,
    fetchCryptosInfos,
    setSort,
    filterByName,
    filterByIds,
    setPage,
    nextPage,
    setCurrencyActive,
    getFavorites,
    addFavorite,
    removeFavorite,
  }
}
