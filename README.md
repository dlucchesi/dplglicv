# DPL Glic

  A simple Nodejs + Svelte + Skeleton application

## What do you need to this project...
An environment file (profile):
- where?:
  - project root folder
- pattern?:
  - `.env`
- structure:
  - `key`=`value`
- vars need to project:
  - `DATA_PATH` => path to cvs files (`;` separator)
  - `COUNT_TO_SHOW` => number of ocurrences to show in graphs

## About glic.csv
- structure
  - `year;month;day;hour;minute;glucose;obs`
- examples
  - `2025;1;1;9;0;120;Before breakfast`
  - `2025;12;10;23;55;110;`

## About weight.csv
- structure
  - `year;month;day;weight`
- examples
  - `2025;1;1;109.90`
  - `2025;12;10;99`

## About SVELTE
Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## About SKELETON
Skeleton is an adaptive design system powered by Tailwind CSS. You can run it with: 
  - React
  - Svelte
  - Vue
  - Solid
  - Astro
  - and more ...


### Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.


---
by [dlucchesi](https://github.com/dlucchesi)