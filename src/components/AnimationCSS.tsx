'use client';

export default function AnimationCSS() {
  return (
    <>
      <link
        rel="stylesheet"
        href="/tw-animate.css"
        media="print"
        onLoad={(e) => {
          (e.currentTarget as HTMLLinkElement).media = 'all';
        }}
      />
      <noscript>
        <link rel="stylesheet" href="/tw-animate.css" />
      </noscript>
    </>
  );
}