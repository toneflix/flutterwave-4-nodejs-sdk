import { beforeAll, describe, expect, it } from 'vitest'

import { Route } from '../src/Routing/Route'
import { Router } from '../src/Routing/Router'
import { createRouter } from '../src/Routing/createRouter'

let router: Router

describe('Routing Spec', () => {
    beforeAll(() => {
        process.env.ENVIRONMENT = 'test'
        router = createRouter({
            routes: [
                {
                    method: 'GET',
                    path: '/test-path',
                    name: 'get_test_path',
                },
                {
                    method: 'POST',
                    path: '/test-path-post/:id',
                    name: 'post_test_path',
                    params: {
                        id: 123,
                    },
                    query: {
                        verbose: true,
                    },
                }
            ],
        })
    })

    describe('Router', () => {
        it('should create a router instance', () => {
            expect(router).toBeInstanceOf(Router)
        })

        it('should get all routes', () => {
            const routes = router.getRoutes()

            expect(routes.length).toBe(2)
            expect(routes[0]).toBeInstanceOf(Route)
            expect(routes[1]).toBeInstanceOf(Route)
        })

        it('should get route by key, name or config', () => {
            const getRouteByName = router.getRoute('get_test_path')
            const getRouteByKey = router.getRoute('GET-_test_path_get_test_path')
            const getRouteByConfig = router.getRoute({
                method: 'POST',
                path: '/test-path-post/:id',
                name: 'post_test_path',
            } as never)

            expect(getRouteByName).toBeDefined()
            expect(getRouteByKey).toBeDefined()
            expect(getRouteByConfig).toBeDefined()

            expect(getRouteByName?.build()).toBe('https://developersandbox-api.flutterwave.com/test-path')
            expect(getRouteByKey?.build()).toBe('https://developersandbox-api.flutterwave.com/test-path')
            expect(getRouteByConfig?.build()).toBe('https://developersandbox-api.flutterwave.com/test-path-post/123?verbose=true')
        })
    })
})