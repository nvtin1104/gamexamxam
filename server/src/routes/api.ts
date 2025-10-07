import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesDir = path.join(__dirname, '..', 'modules');


export default async () => {
    const routes: { router: any; basePath: string }[] = [];

    if (fs.existsSync(modulesDir)) {
        const moduleNames = fs
            .readdirSync(modulesDir)
            .filter((name) =>
                fs.statSync(path.join(modulesDir, name)).isDirectory()
            );

        for (const name of moduleNames) {
            const routeFile = path.join(modulesDir, name, "routes.ts");
            if (fs.existsSync(routeFile)) {
                const { default: router, basePath } = await import(
                    `../modules/${name}/routes.js`
                );
                routes.push({ router, basePath });
            }
        }
    }
    return routes;
};
