if (!self.define) {
  const e = (e) => {
      "require" !== e && (e += ".js");
      let c = Promise.resolve();
      return (
        s[e] ||
          (c = new Promise(async (c) => {
            if ("document" in self) {
              const s = document.createElement("script");
              (s.src = e), document.head.appendChild(s), (s.onload = c);
            } else importScripts(e), c();
          })),
        c.then(() => {
          if (!s[e]) throw new Error(`Module ${e} didn’t register its module`);
          return s[e];
        })
      );
    },
    c = (c, s) => {
      Promise.all(c.map(e)).then((e) => s(1 === e.length ? e[0] : e));
    },
    s = { require: Promise.resolve(c) };
  self.define = (c, a, n) => {
    s[c] ||
      (s[c] = Promise.resolve().then(() => {
        let s = {};
        const i = { uri: location.origin + c.slice(1) };
        return Promise.all(
          a.map((c) => {
            switch (c) {
              case "exports":
                return s;
              case "module":
                return i;
              default:
                return e(c);
            }
          })
        ).then((e) => {
          const c = n(...e);
          return s.default || (s.default = c), s;
        });
      }));
  };
}
define("./sw.js", ["./workbox-c2b5e142"], function (e) {
  "use strict";
  importScripts(),
    e.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/_next/static/bg8ogWGq3FFg0MzPQv0Yc/_buildManifest.js", revision: "b81f7fb5b7abcbcc933c44ccf870a49d" },
        {
          url: "/_next/static/bg8ogWGq3FFg0MzPQv0Yc/_middlewareManifest.js",
          revision: "fb2823d66b3e778e04a3f681d0d2fb19",
        },
        { url: "/_next/static/bg8ogWGq3FFg0MzPQv0Yc/_ssgManifest.js", revision: "b6652df95db52feb4daf4eca35380933" },
        { url: "/_next/static/chunks/0a2f8ba0-c0c5ae462b951118.js", revision: "36850df53a48a8c6c0e4310077d5ca11" },
        { url: "/_next/static/chunks/175-e7adfec051e7ac55.js", revision: "4f1c9b0b1e1b94ced6a01a10c3c10a6b" },
        { url: "/_next/static/chunks/231-04092a480944c98c.js", revision: "4581d82b82e7a730827e6da77ac283bb" },
        { url: "/_next/static/chunks/29107295-fbcfe2172188e46f.js", revision: "f624310e2238ffb6669f475421f19547" },
        { url: "/_next/static/chunks/297-b5a7f0086a6aee44.js", revision: "6b1dc40fafc2efd91c5682f261a39079" },
        { url: "/_next/static/chunks/framework-5f4595e5518b5600.js", revision: "623da2092ab9e81400d81fad9017f0ba" },
        { url: "/_next/static/chunks/main-246dd4ea7cd31bec.js", revision: "20f8282e219837d53f8b121e09ed5a07" },
        { url: "/_next/static/chunks/pages/_app-a72ccee9bd664d04.js", revision: "a7f0ae61c744a2a0f8bd8d9299e710a2" },
        { url: "/_next/static/chunks/pages/_error-0a004b8b8498208d.js", revision: "0329dd53635ec270db459e54e29d5086" },
        {
          url: "/_next/static/chunks/pages/auth/sign-in-a0d35ba5bac2a17e.js",
          revision: "c908eb1405b3a60799c28f1cef552d3d",
        },
        {
          url: "/_next/static/chunks/pages/auth/sign-out-d2e2b0f76f8f9c26.js",
          revision: "28f7e3112720263854f6afc668c3c8ff",
        },
        {
          url: "/_next/static/chunks/pages/auth/sign-up-f68962f0777ca687.js",
          revision: "91c0626cfec86f9285b6ca51e2511044",
        },
        { url: "/_next/static/chunks/pages/catalog-835e7429ba4328ec.js", revision: "0179242ecb48be6334fabcef2a22bff4" },
        {
          url: "/_next/static/chunks/pages/course/%5Bid%5D-d6f79c547a0c0f75.js",
          revision: "b7cee203011121ad3da220499a509504",
        },
        {
          url: "/_next/static/chunks/pages/error/%5Bid%5D-1bdff728622d1108.js",
          revision: "80d027df25306039303d46f5d517bb7c",
        },
        { url: "/_next/static/chunks/pages/index-dc8e1b9098c38b32.js", revision: "207ccea295b241eca97854c207c4c75e" },
        { url: "/_next/static/chunks/pages/planner-8df862b4ea76192d.js", revision: "180d5360d36256d0e79d3eaf78fd2300" },
        { url: "/_next/static/chunks/pages/profile-d1695995043e1d72.js", revision: "e33e44400c4f9b29e29c3c3e76849ac1" },
        {
          url: "/_next/static/chunks/pages/programs/%5BprogramId%5D-63cf71550f6c0474.js",
          revision: "bbc34eb7fc2ba17c9aef655f08df2a96",
        },
        {
          url: "/_next/static/chunks/pages/school/%5Bid%5D-1d396fcae94eed7a.js",
          revision: "da58b8022efcbeeb4082001cbdc24c20",
        },
        { url: "/_next/static/chunks/polyfills-5cd94c89d3acac5f.js", revision: "99442aec5788bccac9b2f0ead2afdd6b" },
        { url: "/_next/static/chunks/webpack-cb7634a8b6194820.js", revision: "1fd72a66e4bc2658bbca0754def47fc5" },
        { url: "/_next/static/css/d8810901d1950edf.css", revision: "9184836ea792a4aa0915e4f7a33b9e66" },
        { url: "/assets/contact_images/Ben.jpg", revision: "cde6c6d6ee996c7eedfe054fe5aba904" },
        { url: "/assets/contact_images/Conor.jpg", revision: "ec3e13f3c36061dc3075f3667599aa24" },
        { url: "/assets/contact_images/Dylan.jpg", revision: "b223d8269db52987c6edc17d8c62d711" },
        { url: "/assets/contact_images/Greg.jpg", revision: "e9b305a66abf0c6cbe50bd38ede60d2e" },
        { url: "/assets/contact_images/Karan.jpeg", revision: "a234d4d1575f978cc05e425ec778ee6d" },
        { url: "/assets/contact_images/Noah.png", revision: "fe15f632a9dbb574908d438e55d7d088" },
        { url: "/assets/contact_images/bender.jpg", revision: "06cd0447576f528e34034e3a9b42ac8c" },
        { url: "/assets/graph-example-1.png", revision: "bf6aea71f15906caec23537832d1da15" },
        { url: "/favicon.ico", revision: "11943ca75ae85dc12a0fea058c39b2e4" },
        { url: "/icons/Logo-no-bg.svg", revision: "6ac0d779321462ac9899ec2a44f6e6bc" },
        { url: "/icons/Logo.svg", revision: "b781987750b58b10749b3d35127c50da" },
        { url: "/icons/icon-128x128.png", revision: "5229855cdf3295384c1d576eb064c132" },
        { url: "/icons/icon-144x144.png", revision: "1c1b5977f186be245488dd74764702a6" },
        { url: "/icons/icon-152x152.png", revision: "6a7423f7e66fd63d67dc011a36c2b4bf" },
        { url: "/icons/icon-16x16.png", revision: "d030150ed9cea1c878845c220cce9d9a" },
        { url: "/icons/icon-180x180.png", revision: "a1430e24f6026733b96218eb37ef605f" },
        { url: "/icons/icon-192x192.png", revision: "3f77c7742c8323190250b385bbacb0dc" },
        { url: "/icons/icon-32x32.png", revision: "061bcf043f8c017413d5ccf613f95acd" },
        { url: "/icons/icon-384x384.png", revision: "755dd5b6462a192ef4e759c72b9e23c5" },
        { url: "/icons/icon-512x512.png", revision: "9e34884b5402f12e720573ee07c9813d" },
        { url: "/icons/icon-72x72.png", revision: "f399bc99b0719f9069bbee8570635104" },
        { url: "/icons/icon-96x96.png", revision: "f0adaf564e9d0a0b0a0661ec1b26cc16" },
        { url: "/manifest.json", revision: "4c7251f2f42045e378aceb0f9ebc3655" },
        { url: "/vercel.svg", revision: "26bf2d0adaf1028a4d4c6ee77005e819" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [new e.ExpirationPlugin({ maxEntries: 1, maxAgeSeconds: 86400, purgeOnQuotaError: !0 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3, purgeOnQuotaError: !0 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800, purgeOnQuotaError: !0 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400, purgeOnQuotaError: !0 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400, purgeOnQuotaError: !0 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400, purgeOnQuotaError: !0 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400, purgeOnQuotaError: !0 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/api\/.*$/i,
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400, purgeOnQuotaError: !0 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /.*/i,
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400, purgeOnQuotaError: !0 })],
      }),
      "GET"
    );
});
