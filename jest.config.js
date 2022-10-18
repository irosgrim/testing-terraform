module.exports = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
	testPathIgnorePatterns: ["\\\\node_modules\\\\", "\\\\temp\\\\"],
	testEnvironment: "node",
	preset: "ts-jest",
	setupFiles: ["dotenv/config"],
};