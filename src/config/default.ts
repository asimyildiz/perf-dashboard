export default {
  HOST: "localhost",
  PORT: 3000,
  API_URL: "http://localhost:8080",
  APP: {
    htmlAttributes: { lang: "en" },
    title: "Perf Dashboard",
    titleTemplate: "Perf Dashboard - %s",
    meta: [
      {
        name: "description",
        content: "Performance metrics dashboard to display charts of ttfb, fcp and other metrics for web-pages which collected the data using perf-lib.",
      },
    ],
  },
};
