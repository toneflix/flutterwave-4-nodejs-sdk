export interface RouterConfig {
    routes: RouteDefinition[]
}

export interface RouteDefinition {
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    name?: string,
    params?: Record<string, string | number | boolean>,
    query?: Record<string, string | number | boolean>,
}