import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DocVault",
    short_name: "DocVault",
    description:
      "A secure and simple place to store, organize, and access your family's important documents.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F766E",
    orientation: "portrait",
    icons: [
  {
    src: "/icons/icon-192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/icons/icon-512.png",
    sizes: "512x512",
    type: "image/png",
  },
],
  };
}