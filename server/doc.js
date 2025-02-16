const fs = require('fs');
const path = require('path');
const readline = require('readline');
const packageJson = require('./package.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

(async () => {
    console.log("🔹 Generating documentation for your Express backend...\n");

    const projectName = packageJson.name || await askQuestion("Project name: ");
    const projectDescription = packageJson.description || await askQuestion("Project description: ");
    const nodeVersion = process.version;
    const expressVersion = packageJson.dependencies?.express || await askQuestion("Express version: ");
    const database = await askQuestion("Database used (MongoDB, PostgreSQL, etc.): ");
    const authMethod = await askQuestion("Authentication method (JWT, OAuth, etc.): ");
    const realTimeTech = await askQuestion("Real-time communication (WebSockets, Socket.io, etc.): ");

    console.log("\n📌 Now, enter API endpoints (type 'done' when finished):");
    let endpoints = [];
    while (true) {
        let route = await askQuestion("Route (e.g., /api/messages): ");
        if (route.toLowerCase() === 'done') break;
        let method = await askQuestion("Method (GET, POST, PUT, DELETE): ");
        let description = await askQuestion("Description: ");
        let requestBody = await askQuestion("Request Body (JSON or leave empty): ");
        let responseBody = await askQuestion("Response Body (JSON or leave empty): ");

        endpoints.push({
            route, method, description,
            requestBody: requestBody ? JSON.parse(requestBody) : null,
            responseBody: responseBody ? JSON.parse(responseBody) : null
        });
    }

    const middleware = await askQuestion("Custom middlewares used (comma separated, or 'none'): ");
    const envVariables = await askQuestion("Environment variables used (comma separated): ");
    const hosting = await askQuestion("Hosting provider (e.g., AWS, Vercel, Heroku, etc.): ");
    const security = await askQuestion("Security considerations (CORS, rate limiting, etc.): ");

    const documentation = {
        projectName, projectDescription,
        techStack: {
            nodeVersion, expressVersion, database, authMethod, realTimeTech
        },
        apiEndpoints: endpoints,
        middleware: middleware.split(',').map(m => m.trim()).filter(m => m !== 'none'),
        environmentVariables: envVariables.split(',').map(e => e.trim()),
        hosting,
        security
    };

    const filePath = path.join(__dirname, 'backend-docs.json');
    fs.writeFileSync(filePath, JSON.stringify(documentation, null, 2));

    console.log(`\n✅ Documentation data saved to ${filePath}`);
    rl.close();
})();
