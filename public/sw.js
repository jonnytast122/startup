if (!self.define) {
  let e,
    s = {};
  const i = (i, n) => (
    (i = new URL(i + ".js", n).href),
    s[i] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = s), document.head.appendChild(e);
        } else (e = i), importScripts(i), s();
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, c) => {
    const a =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[a]) return;
    let t = {};
    const u = (e) => i(e, a),
      r = { module: { uri: a }, exports: t, require: u };
    s[a] = Promise.all(n.map((e) => r[e] || u(e))).then((e) => (c(...e), t));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "40c2d85c8815053455ad97efc1da7e3a",
        },
        {
          url: "/_next/static/ZBcMlpAzie8oZlenKqQku/_buildManifest.js",
          revision: "c1b23a671a50fb2d87418e1292292a2f",
        },
        {
          url: "/_next/static/ZBcMlpAzie8oZlenKqQku/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/1046-00bd3a5e05a71053.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/1453-3a2ca25efb98aa63.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/164f4fb6-a2ea4b01149dcf6c.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/1684-eed85165c847d889.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/2105.12545ef01df6751e.js",
          revision: "12545ef01df6751e",
        },
        {
          url: "/_next/static/chunks/2121.71b56d4fafa9be5a.js",
          revision: "71b56d4fafa9be5a",
        },
        {
          url: "/_next/static/chunks/2170a4aa-8be2e1de3df20b60.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/2271-afbc7d186c2ad40a.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/2549-7d7a7cb943b1f0b5.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/2751-465fac3e07dd29a3.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/2806-402adcbe91b5c9d1.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/2960-141262aecd9e4c1c.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/2f0b94e8-c7cbb08fcaccaeb5.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3008-efec55309d0b5eb4.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3097-925a9a70246e2fa2.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3220-8ff01215530e708a.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3249-096b2faba73f0386.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3352-2f47f474db898b90.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3361-8e914f63d29dbe26.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3649-8c78e7906c38a2ae.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3650-c02c1b5a5b2577de.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3796-5d21dfb9606773d8.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/3840-ce7843bdb58370a1.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/4330-058f223736e23275.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/4615-7515609bf123f46e.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/4714-1f26c120b040d6b8.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/4921-7ff8f3b479f753a9.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/4bd1b696-0a53c28a7f263579.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/5061-96679d79d5c15568.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/5819-61d763c528a996b4.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/5994-1e8dbd29de1ebd76.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/6252-763dd53f7a0e4423.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/6268-95f52c51a749ba46.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/6605-aab7694c8af3ae3a.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/6766-87c164e2b3f95a9f.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/6900-32498ff05395cd4b.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/6967-6be6ba1522078cd6.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/7240-cb55e9d094d20444.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/7612-4423db1395e7a487.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/7741-838997035ee57a42.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/7890-0bb3f30694a69eba.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/795d4814-23156cdea5227432.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/822.0dc8e704d9f0c49e.js",
          revision: "0dc8e704d9f0c49e",
        },
        {
          url: "/_next/static/chunks/8410-6c7557b8aac0b449.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/8488-57dceaec94cc62f7.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/8866-0de9866d6c8a6517.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/8920.8294566ce69be3bd.js",
          revision: "8294566ce69be3bd",
        },
        {
          url: "/_next/static/chunks/8e1d74a4-a9e037c18ad4fb53.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/9284-871d5a801054a26a.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/94-7fc750ed7e71f22c.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/9742-fefa02d256eb7660.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/9968-2148f2f8651a47b2.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/ad2866b8.a559fc6296e7719c.js",
          revision: "a559fc6296e7719c",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-6a4a2c6eaddc7166.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/activity/page-93fe12688f05c35b.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/attendence/page-6f12227480b7be7a.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/company/page-46cb1585dbc9f0f4.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/groups/page-bc86bf44acda1dee.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/help/page-0e373cf7875ee878.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/job-schedule/page-4bb5d336b4cd0d2c.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/layout-82fab0539748e684.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/leaves/page-73fc231b567c4f2b.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/overtime/page-0c397d07fe7d2116.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/page-f17e9fe9382e12b0.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/payroll/page-7cd7cf53f8ef0bf6.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/policy/page-ccd81cddbcf3f135.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/timeclock/page-1f9118dbef086c1b.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/users-admin/page-8e54a4344408803c.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/users-admin/profile/%5Bid%5D/page-f8535d2bb02b0f11.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/admin/overview/workshift/page-2b0c39a2ef8805f8.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/layout-02a139397cabf585.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/page-a75edfe0d975a699.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/signin/page-83050178f81e5177.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/signup/page-aa32635fde270c42.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/user/attendance/page-62177c6f043064de.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/user/help/page-714b147fa77c7fea.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/user/layout-40bf16a090fcee39.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/user/leaves/page-3268eb031d8c8d7e.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/user/overtime/page-8ce5917e7b49d6d1.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/user/page-d732aa20c70201b7.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/user/payroll/page-2979fa78d05bb73f.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/app/user/profile/page-d28819f152daa137.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/bc98253f.d21a5b1e2e1a8f86.js",
          revision: "d21a5b1e2e1a8f86",
        },
        {
          url: "/_next/static/chunks/ee560e2c-a186281bc33da7aa.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/eec3d76d-5f31fc1bf4175f86.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/framework-c054b661e612b06c.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/main-06e45cc1352898fb.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/main-app-653eff207b9cf7f7.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/pages/_app-5d1abe03d322390c.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/pages/_error-3b2a1d523de49635.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-a83c3fec9d289e0a.js",
          revision: "ZBcMlpAzie8oZlenKqQku",
        },
        {
          url: "/_next/static/css/21d09b810cd9140e.css",
          revision: "21d09b810cd9140e",
        },
        {
          url: "/_next/static/css/4aadb537e50b167c.css",
          revision: "4aadb537e50b167c",
        },
        {
          url: "/_next/static/css/7c81f1e1351f6790.css",
          revision: "7c81f1e1351f6790",
        },
        {
          url: "/_next/static/css/a7beacf2e0c35a93.css",
          revision: "a7beacf2e0c35a93",
        },
        {
          url: "/_next/static/css/cb8544a4ef612ecd.css",
          revision: "cb8544a4ef612ecd",
        },
        {
          url: "/avatars/cameron.png",
          revision: "d15340909adf30b8ff39da7e02ae48ff",
        },
        {
          url: "/avatars/jenny.png",
          revision: "1d89bd0ff94524d8b67ffe13343c8ca2",
        },
        {
          url: "/avatars/ralph.png",
          revision: "6709055ab94804bf67fbd8b6cb0bb25c",
        },
        {
          url: "/avatars/theresa.png",
          revision: "bd48f5e4c1a62eb2525b035375d4800c",
        },
        { url: "/favicon.png", revision: "114a122a79970cb3f7b0fd568ef0961b" },
        {
          url: "/icon512_maskable.png",
          revision: "0c41b7f14bc8905ffc8f5f0efeff7829",
        },
        {
          url: "/icon512_rounded.png",
          revision: "ae3f37a063cf25d31e0786a13bbf015f",
        },
        {
          url: "/images/Invoice_logo.png",
          revision: "48a5906254438e3374b15caf4c8b1215",
        },
        {
          url: "/images/LeaveLine.png",
          revision: "6f669e330419834c12edc9c7e554df5a",
        },
        {
          url: "/images/Logo.png",
          revision: "de053e607bb60680548e7fde711143ef",
        },
        {
          url: "/images/Logo_2.png",
          revision: "b94007b254b52091c6609e502ad224fc",
        },
        {
          url: "/images/OTLine.png",
          revision: "1243bfdf0af762ca3720a76b53ef3662",
        },
        {
          url: "/images/Pdf_icon.png",
          revision: "f85ac13760e0d11c0b32159e8baf130b",
        },
        {
          url: "/images/aba_logo.png",
          revision: "a56e57d1fe26d4eb4f23a09b2d38a7a7",
        },
        {
          url: "/images/account_create.png",
          revision: "c4e98d951f7ee89f6077b3d59bea1f64",
        },
        {
          url: "/images/activity.png",
          revision: "c31c07e06933f318cc0939a2dba8437d",
        },
        {
          url: "/images/attachment.png",
          revision: "ae49cf02c656329e5a654281b383e0d6",
        },
        {
          url: "/images/dashboard.png",
          revision: "ba6f176ab2399dfbadeaea5711737a2e",
        },
        {
          url: "/images/feature.png",
          revision: "109338b6a56ff3e361db85ae1f7d71c7",
        },
        {
          url: "/images/feature2.png",
          revision: "d81cbbc2129868424ed28657b105688b",
        },
        {
          url: "/images/feature3.png",
          revision: "42e232bfdcfcf04cac701051b28ad171",
        },
        {
          url: "/images/feature4.png",
          revision: "539bfb8b6e072298ce2c2f2e1fde9719",
        },
        {
          url: "/images/overview_icon.png",
          revision: "9445da127a592f3ce8ae4f8aef2f721e",
        },
        {
          url: "/images/setting.png",
          revision: "7366ca6b5fa27872cb2f6da1bd386da3",
        },
        {
          url: "/images/solution.png",
          revision: "d6f046b7b6bb145982c576ae088b4d09",
        },
        {
          url: "/images/solution2.png",
          revision: "efd9baf308a133bea2b9620d90302fff",
        },
        {
          url: "/images/support.png",
          revision: "0a285bb236bd0af7f62235a47989f618",
        },
        {
          url: "/images/user.png",
          revision: "a1c88eb67e6463038d41ceeb2b306969",
        },
        {
          url: "/images/white_logo.png",
          revision: "3943ab281526b559983d24434d09cd3e",
        },
        { url: "/manifest.json", revision: "9d8c5215988255e1753ff61fc5d47d0a" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: i,
              state: n,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
