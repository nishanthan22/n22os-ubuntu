import Head from 'next/head';

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
}

const Meta = ({
  title = "My Portfolio - Full Stack Developer",
  description = "Welcome to my portfolio website built with Next.js and Tailwind CSS.",
  keywords = "portfolio, n22os, nishanthan os, n22 ubuntu os, ubuntu portfolio, linux, nishanthan, nishanthan m ravichandran, nishanthan ravichandran, nishanthanmr, software engineer, nishanthan ubuntu, full stack developer, nextjs, tailwind, react",
  url = "https://nishanthanmr.com",
  image = ""
}: MetaProps) => {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Nishanthan Ravichandran" />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#E95420" />

      {/* Open Graph Meta Tags (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Nishanthan's UbuntuOS Portfolio" />
      <meta property="og:type" content="website" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicons & Fonts */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/images/logo.png" />
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" as="style" />
      <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet" />
    </Head>
  );
};

export default Meta;
