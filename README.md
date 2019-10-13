# WebApp Design

1. Store UserBooks as Blob containers in Azure Storage Account
2. Book's metadata (name, description etc.) will be stored as metadata of container
3. Each page of book is a blob inside a container (storage as image)
4. Anonymous access to blob is allowed but enumberation of all blobs of a container, or of all containers in Azure Storage account is not allowed

Sequence:
1. Upload image, rectangles, lines [done]
2. Edit one image (get rectangles, lines as well)
3. Save context and boxes change on service

https://svelte.dev/
https://sapper.svelte.dev/
https://tailwindcss.com/
https://docs.microsoft.com/en-us/rest/api/storageservices/operations-on-containers

Discussion:
1. Char not outlines: + button for both prepend and append
2. Cloud functions [frontend + backend]
3. Thumbnail in left: Only page number
4. Wall for entry

Previous Tasks:
1. view books [done] { scrapped }
2. create a new book [done] { scrapped }
3. upload pdf of a book [done] { scrapped }
4. Render 1 page of a book using pdf-js [done] { scrapped }
5. viewing all pages of a book : https://roopchoueditorapp.blob.core.windows.net/book-1/pdf { scrapped }
6. edit page of a page (which will allow mapping unicode text to a page)
7. Zoom levels: 50%, 100%, 200%, 400% [done]
8. Space and Shift+Space for navigation [done]
9. Padding of rectangles with 2px [done]
10. Total dynamic Dom with back linking
11. Library of 20 manuscripts (editor experience) [upload, save, load back]

# sapper-template

The default [Sapper](https://github.com/sveltejs/sapper) template, with branches for Rollup and webpack. To clone it and get started:

```bash
# for Rollup
npx degit "sveltejs/sapper-template#rollup" my-app
# for webpack
npx degit "sveltejs/sapper-template#webpack" my-app
cd my-app
npm install # or yarn!
npm run dev
```

Open up [localhost:3000](http://localhost:3000) and start clicking around.

Consult [sapper.svelte.dev](https://sapper.svelte.dev) for help getting started.


## Structure

Sapper expects to find two directories in the root of your project —  `src` and `static`.


### src

The [src](src) directory contains the entry points for your app — `client.js`, `server.js` and (optionally) a `service-worker.js` — along with a `template.html` file and a `routes` directory.


#### src/routes

This is the heart of your Sapper app. There are two kinds of routes — *pages*, and *server routes*.

**Pages** are Svelte components written in `.svelte` files. When a user first visits the application, they will be served a server-rendered version of the route in question, plus some JavaScript that 'hydrates' the page and initialises a client-side router. From that point forward, navigating to other pages is handled entirely on the client for a fast, app-like feel. (Sapper will preload and cache the code for these subsequent pages, so that navigation is instantaneous.)

**Server routes** are modules written in `.js` files, that export functions corresponding to HTTP methods. Each function receives Express `request` and `response` objects as arguments, plus a `next` function. This is useful for creating a JSON API, for example.

There are three simple rules for naming the files that define your routes:

* A file called `src/routes/about.svelte` corresponds to the `/about` route. A file called `src/routes/blog/[slug].svelte` corresponds to the `/blog/:slug` route, in which case `params.slug` is available to the route
* The file `src/routes/index.svelte` (or `src/routes/index.js`) corresponds to the root of your app. `src/routes/about/index.svelte` is treated the same as `src/routes/about.svelte`.
* Files and directories with a leading underscore do *not* create routes. This allows you to colocate helper modules and components with the routes that depend on them — for example you could have a file called `src/routes/_helpers/datetime.js` and it would *not* create a `/_helpers/datetime` route


### static

The [static](static) directory contains any static assets that should be available. These are served using [sirv](https://github.com/lukeed/sirv).

In your [service-worker.js](src/service-worker.js) file, you can import these as `files` from the generated manifest...

```js
import { files } from '@sapper/service-worker';
```

...so that you can cache them (though you can choose not to, for example if you don't want to cache very large files).


## Bundler config

Sapper uses Rollup or webpack to provide code-splitting and dynamic imports, as well as compiling your Svelte components. With webpack, it also provides hot module reloading. As long as you don't do anything daft, you can edit the configuration files to add whatever plugins you'd like.


## Production mode and deployment

To start a production version of your app, run `npm run build && npm start`. This will disable live reloading, and activate the appropriate bundler plugins.

You can deploy your application to any environment that supports Node 8 or above. As an example, to deploy to [Now](https://zeit.co/now), run these commands:

```bash
npm install -g now
now
```


## Using external components

When using Svelte components installed from npm, such as [@sveltejs/svelte-virtual-list](https://github.com/sveltejs/svelte-virtual-list), Svelte needs the original component source (rather than any precompiled JavaScript that ships with the component). This allows the component to be rendered server-side, and also keeps your client-side app smaller.

Because of that, it's essential that the bundler doesn't treat the package as an *external dependency*. You can either modify the `external` option under `server` in [rollup.config.js](rollup.config.js) or the `externals` option in [webpack.config.js](webpack.config.js), or simply install the package to `devDependencies` rather than `dependencies`, which will cause it to get bundled (and therefore compiled) with your app:

```bash
npm install -D @sveltejs/svelte-virtual-list
```


## Notes

[Setup tailwind for css](https://github.com/tailwindcss/setup-examples/tree/master/examples/sapper)
```
> yarn add tailwindcss postcss-cli -D
> yarn add @fullhuman/postcss-purgecss
> npx tailwind init tailwind.js
```

https://jvns.ca/blog/brag-documents/

Stack: FE[sapper + tailwindcss/bulmacss] + BE[google firebase] + Hosting[netlify]
https://adamwathan.me/uses/
https://github.com/ryanatkn/awesome-svelte-resources
https://forestry.io/pricing/
https://mozilla.github.io/pdf.js/
https://svgjs.com/docs/2.7/
http://svgtutorial.com/manipulating-svg-with-javascript/
https://keybase.io/ (slack / teams alternative)
https://internetingishard.com/html-and-css/advanced-positioning/
Zoom Lens in CSS: https://www.w3docs.com/snippets/javascript/how-to-create-an-image-zoom-using-css-and-javascript.html
http://usefulangle.com/post/24/pdf-to-jpeg-png-with-pdfjs
