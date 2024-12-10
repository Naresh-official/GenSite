import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack: (config, { dev, isServer }) => {
		if (dev && !isServer) {
			config.devtool = "source-map";
		}

		if (!dev) {
			config.devtool = false;
		}

		return config;
	},
};

export default nextConfig;
