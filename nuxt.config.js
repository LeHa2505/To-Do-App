export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  //Access with: http://127.0.0.1:5500
  // server: {
  //   host: '127.0.0.1', // thay your-hostname bằng tên miền hoặc địa chỉ IP của server mới
  //   port: '5500' // thay your-port bằng cổng mà bạn muốn server lắng nghe, ví dụ: 3000
  // },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "to-do-app",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["ant-design-vue/dist/antd.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/antd-ui",  
    { src: "~/plugins/Vuelidate" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/i18n"],
  i18n: {
    /* module options */
    // skipSettingLocaleOnNavigate: true,
    locales: [
      {
        code: "en",
        name: "English",
        iso: "en",
        file: "en.json",
      },
      {
        code: "vi",
        name: "Vietnamese",
        iso: "vi",
        file: "vi.json",
      },
    ],
    langDir: 'lang',
    defaultLocale: 'en',
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
