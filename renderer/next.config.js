module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
  images: {
    domains: ["backtrack-media.s3.eu-west-2.amazonaws.com"],
  },
};
