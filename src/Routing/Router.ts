import '../utilities/global'

import { Route } from './Route'
import { RouterConfig } from '../Contracts/Router'

export class Router {
    /**
     * Map of routes keyed by their unique identifiers
     */
    private routes: Map<string, Route> = new Map()

    /**
     * Configuration for the router
     */
    #config: RouterConfig

    /**
     * Creates an instance of Router.
     * 
     * @param config 
     */
    constructor(config: RouterConfig) {
        this.#config = config
        this.initialize()
    }

    /**
     * Initializes the router by loading routes from config
     */
    initialize () {
        for (const rte of this.#config.routes) {
            const route = new Route(rte)
            this.routes.set(route.key(), route)
        }
    }

    /**
     * Gets the path for a given route name
     * @param name 
     * @returns 
     */
    getRoutePath (name: string): string | undefined {
        return this.getRoute(name)?.build()
    }

    /**
     * Retrieves a route by its key, name or configuration
     * 
     * @param key 
     */
    getRoute<K extends string> (key: K): Route | undefined
    getRoute<K extends RouterConfig> (key: K): Route | undefined
    getRoute (key: any): Route | undefined {
        if (typeof key === 'string') {
            return this.routes.get(key) ?? this.getRoutes().find(r => r.name === key)
        } else if (typeof key === 'object' && 'method' in key && 'path' in key) {
            const routeKey = Route.keyFromConfig(key)

            return this.routes.get(routeKey)
        }

        return undefined
    }

    /**
     * Converts the routes map to an array
     * 
     * @returns 
     */
    getRoutes (): Route[] {
        return Array.from(this.routes.values())
    }
}