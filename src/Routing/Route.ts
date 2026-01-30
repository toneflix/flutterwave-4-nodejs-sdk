import { Builder } from '../Builder'
import { RouteDefinition } from '../Contracts/Router'

export class Route {
    public path: string
    public method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    public name?: string
    public params: Record<string, string | number | boolean>
    public query: Record<string, string | number | boolean>

    constructor(config: RouteDefinition) {
        this.path = config.path
        this.method = config.method
        this.name = config.name ?? config.path.toSnakeCase()
        this.params = config.params ?? {}
        this.query = config.query ?? {}
    }

    /**
     * Generates a unique key for the route
     * 
     * @returns 
     */
    key (): string {
        return `${this.method}-${(this.path + '_' + this.name).toSlug('_')}`
    }

    static keyFromConfig (config: RouteDefinition): string {
        const name = config.name ?? config.path.toSnakeCase()

        return `${config.method}-${(config.path + '_' + name).toSlug('_')}`
    }

    /**
     * Builds the full route path with parameters, query strings, and hash
     * @returns 
     */
    build (): string {
        return Builder.buildTargetUrl(this.path, this.params, this.query)
    }

    /**
     * Returns a string representation of the Route
     * @returns string
     */
    toString (): string {
        return `${this.method} ${this.build()}`
    }
}