/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-main";
    }

    return config;
  },
  images: {
    domains: ["backtrack-media.s3.eu-west-2.amazonaws.com"],
  },
  output: "export",
};

if (process.env.NODE_ENV === "production") {
  nextConfig.output = "export";
  nextConfig.distDir = "../app";
  nextConfig.images = {
    loader: "custom",
    loaderFile: "./image-loader.js",
  };
}

module.exports = nextConfig;
