import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [route("/:from?/:to?", "routes/home.tsx")] satisfies RouteConfig;
