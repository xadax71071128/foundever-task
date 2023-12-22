<script setup lang="ts">
import { ref, computed, watch, inject } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { IAppProvider, TLangs } from "@/providers/app"
import { Flag } from "@/app.organizer"
import { ROUTE_CRYPTO_OVERVIEW, ROUTE_CRYPTO_FAVORITES } from "@/app.routes"

const App = inject("App") as IAppProvider

const router = useRouter()
const { t: print, locale } = useI18n()
const isMobileMenuOpen = ref(false)
const currentRouteName = computed(() => router.currentRoute.value.name)

const setMobileMenuOpen = (value: boolean) => {
  isMobileMenuOpen.value = value
}

const goHome = () => {
  router.push({ name: ROUTE_CRYPTO_OVERVIEW.name })
}

const changeLanguage = (value: TLangs) => {
  locale.value = value
  App.setLanguage(value)
}

watch(currentRouteName, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <div class="flex items-center cursor-pointer" @click="goHome">
          <svg
            width="100%"
            height="100%"
            class="mr-3 h-6 sm:h-9 dark:invert"
            viewBox="0 0 209 209"
            xmlns="http://www.w3.org/2000/svg"
            style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
          >
            <g>
              <path
                d="M93.994,13.184c-16.032,1.871 -31.413,7.934 -44.23,17.456c-5.575,4.15 -14.893,13.427 -19.084,19.124c-17.578,23.478 -22.664,54.565 -13.631,82.397c3.133,9.603 7.731,18.514 13.591,26.408c4.15,5.575 13.427,14.893 19.124,19.084c23.478,17.578 54.565,22.664 82.397,13.631c9.644,-3.174 18.596,-7.772 26.408,-13.631c5.697,-4.191 14.974,-13.509 19.125,-19.084c18.839,-25.39 23.193,-58.797 11.474,-88.297c-3.092,-7.691 -7.812,-16.113 -9.521,-16.887c-1.831,-0.854 -3.418,-0.61 -4.72,0.692c-1.709,1.75 -1.546,3.133 0.854,7.365c8.382,14.689 12.329,30.273 11.638,45.98c-0.285,7.161 -0.692,10.05 -2.32,16.683c-7.283,29.744 -30.761,53.345 -60.547,60.872c-7.812,1.953 -11.434,2.401 -20.385,2.401c-8.952,-0 -12.574,-0.448 -20.386,-2.401c-23.316,-5.9 -43.254,-21.85 -54.037,-43.294c-3.865,-7.731 -7.039,-17.7 -8.26,-26.082c-0.651,-4.517 -0.651,-18.352 0,-22.868c2.645,-18.148 11.475,-35.523 24.414,-48.055c11.15,-10.783 23.397,-17.66 37.883,-21.322c8.057,-2.034 11.434,-2.401 20.996,-2.36c6.877,0.041 9.481,0.204 13.387,0.936c6.104,1.099 11.882,2.767 17.131,4.923c6.713,2.808 7.69,3.052 9.033,2.483c1.302,-0.529 2.563,-2.32 2.563,-3.663c0,-1.993 -0.936,-2.929 -4.72,-4.72c-7.08,-3.377 -15.543,-5.94 -24.373,-7.324c-5.575,-0.895 -17.944,-1.098 -23.804,-0.447Z"
                style="fill: #fece46; fill-rule: nonzero"
              />
              <path
                d="M162.76,25.106c-1.383,0.407 -2.4,1.098 -2.685,1.709c-0.163,0.366 -0.407,2.278 -0.529,4.313l-0.244,3.662l-3.744,0.203c-3.418,0.204 -3.865,0.326 -4.842,1.303c-0.814,0.813 -1.098,1.464 -1.098,2.726c-0,2.929 1.953,4.11 6.795,4.11l3.011,-0l0.163,3.906c0.122,3.703 0.203,3.947 1.261,4.883c1.221,1.058 3.377,1.302 4.842,0.529c1.261,-0.692 1.953,-2.889 1.953,-6.267l0,-3.051l3.052,-0c3.377,-0 5.575,-0.692 6.266,-1.954c0.773,-1.424 0.529,-3.621 -0.529,-4.842c-0.895,-1.058 -1.261,-1.139 -4.76,-1.343l-3.825,-0.203l-0.204,-3.459c-0.244,-4.394 -0.936,-5.737 -3.255,-6.225c-0.57,-0.122 -1.302,-0.122 -1.628,-0Z"
                style="fill: #fece46; fill-rule: nonzero"
              />
              <path
                d="M80.77,38.656c-4.028,1.383 -12.777,5.94 -16.887,8.87c-4.679,3.296 -12.369,10.864 -15.665,15.462c-3.255,4.517 -6.267,9.847 -7.894,13.916c-1.139,2.889 -1.261,3.5 -0.855,4.68c0.245,0.732 0.896,1.627 1.425,1.993c1.261,0.814 3.418,0.855 4.557,0.041c0.488,-0.325 2.034,-3.052 3.499,-5.981c3.215,-6.592 6.551,-11.312 11.434,-16.358c6.266,-6.388 14.16,-11.556 22.502,-14.689c3.336,-1.221 4.598,-2.482 4.598,-4.516c-0,-1.628 -1.669,-3.663 -3.255,-4.029c-0.57,-0.081 -2.116,0.163 -3.459,0.611Z"
                style="fill: #fece46; fill-rule: nonzero"
              />
              <path
                d="M102.01,61.076c-1.424,0.854 -1.912,2.604 -1.912,6.999l-0,4.231l-5.168,0.244c-3.337,0.123 -5.859,0.448 -7.039,0.855c-4.476,1.668 -8.057,5.127 -9.847,9.521c-0.936,2.32 -0.936,2.483 -0.936,21.037c-0,16.968 0.081,18.921 0.732,20.793c1.058,3.052 2.971,5.696 5.412,7.528c3.418,2.604 5.697,3.295 11.637,3.54l5.127,0.203l0.163,4.842c0.122,4.761 0.163,4.883 1.261,5.86c1.547,1.342 3.907,1.342 5.453,-0c1.099,-0.977 1.139,-1.099 1.261,-5.901l0.163,-4.923l3.744,-0c6.917,-0 10.823,-1.302 14.526,-4.924c3.499,-3.377 5.574,-9.643 4.272,-12.776c-0.854,-2.035 -2.929,-2.889 -4.882,-2.075c-1.709,0.732 -2.523,1.912 -2.889,4.313c-0.448,3.011 -1.994,5.208 -4.395,6.347c-2.075,0.936 -2.279,0.977 -14.526,0.977c-12.248,-0 -12.452,-0.041 -14.527,-0.977c-1.587,-0.773 -2.36,-1.424 -3.255,-2.97l-1.139,-1.953l-0,-35.401l1.017,-1.831c0.732,-1.302 1.587,-2.075 3.215,-2.929l2.156,-1.14l25.065,0l2.157,1.14c2.523,1.302 3.784,3.174 4.232,6.144c0.366,2.401 1.139,3.621 2.889,4.354c1.953,0.814 4.028,-0.041 4.882,-2.075c1.262,-3.093 -0.691,-9.074 -4.15,-12.655c-3.54,-3.621 -7.65,-5.046 -14.648,-5.046l-3.825,0l-0,-4.272c-0,-4.557 -0.489,-6.307 -1.994,-7.121c-1.017,-0.529 -3.296,-0.488 -4.232,0.041Z"
                style="fill: #0e3145"
              />
              <path
                d="M168.172,100.708c-1.831,0.773 -2.197,1.75 -2.563,7.039c-1.099,15.503 -6.755,28.361 -17.253,39.063c-8.138,8.382 -17.171,13.712 -28.076,16.724c-3.947,1.098 -10.498,2.075 -13.672,2.075c-1.343,-0 -3.092,0.285 -3.906,0.61c-2.971,1.221 -3.255,5.534 -0.448,6.999c1.058,0.529 2.157,0.61 6.592,0.407c14.933,-0.692 29.744,-6.918 41.707,-17.456c13.672,-12.085 22.258,-29.826 23.072,-47.567c0.285,-6.185 -0.041,-7.243 -2.401,-8.057c-1.546,-0.529 -1.465,-0.529 -3.052,0.163Z"
                style="fill: #fece46; fill-rule: nonzero"
              />
            </g>
          </svg>
          <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Cryptoleet</span>
        </div>
        <div class="flex items-center xs:order-4 md:none">
          <button
            @click="() => setMobileMenuOpen(!isMobileMenuOpen)"
            type="button"
            class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <svg
              :class="{ hidden: isMobileMenuOpen }"
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <svg
              :class="{ hidden: !isMobileMenuOpen }"
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          :class="{ hidden: !isMobileMenuOpen }"
          class="justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
          id="mobile-menu-2"
        >
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <router-link :to="{ name: ROUTE_CRYPTO_OVERVIEW.name }">
                <span
                  :class="
                    currentRouteName === ROUTE_CRYPTO_OVERVIEW.name
                      ? 'dark:text-white light:text-black'
                      : 'text-gray-400 dark:hover:text-white light:hover:text-black'
                  "
                  class="block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 capitalize"
                >
                  {{ print("home") }}
                </span>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: ROUTE_CRYPTO_FAVORITES.name }">
                <span
                  :class="
                    currentRouteName === ROUTE_CRYPTO_FAVORITES.name
                      ? 'dark:text-white light:text-black'
                      : 'text-gray-400 dark:hover:text-white light:hover:text-black'
                  "
                  class="block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 capitalize"
                >
                  {{ print("favorites") }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="xs:w-full xs:text-center hidden lg:flex lg:order-1">
          <Flag
            :type="'fr'"
            class="flag"
            width="40px"
            @click="() => changeLanguage('fr')"
            :is-active="App.lang.value === 'fr'"
          />
          <Flag
            :type="'en'"
            class="flag"
            width="40px"
            @click="() => changeLanguage('en')"
            :is-active="App.lang.value === 'en'"
          />
        </div>
        <div class="hidden lg:flex lg:order-3">
          <label class="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="App.theme.value === 'light'"
              @input="() => App.setTheme(App.theme.value === 'light' ? 'dark' : 'light')"
              class="sr-only peer"
            />
            <span
              class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></span>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 capitalize">
              {{ App.theme.value }} Mode</span
            >
          </label>
        </div>
      </div>
    </nav>
  </header>
</template>

<style lang="scss"></style>
