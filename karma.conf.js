// Karma configuration
module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "karma-typescript"],
    files: [
      "dist/space-bg.js",
      "test/*.spec.ts"
    ],
    preprocessors: {
        "**/*.ts": "karma-typescript",
        "**/*.spec.ts": "karma-typescript"
    },
    client: {
      clearContext: false,
      karmaHTML: {
        auto: false,
        width: "300px",
        height: "15vw",
        source: [{ src: "./test/index.html", tag: "index" }]
      }
    },
    reporters: ["karmaHTML", "progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false
  })
}
