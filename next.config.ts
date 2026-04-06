import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to be accessed from LAN IPs (e.g. 192.168.x.x)
  // so that auth flows and hot-reload work when testing on other devices.
  allowedDevOrigins: ["192.168.86.23"],
};

export default nextConfig;
