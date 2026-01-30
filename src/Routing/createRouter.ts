import { Router } from '../Routing/Router'
import { RouterConfig } from '../Contracts/Router'

export const createRouter = ({ routes = [] }: RouterConfig) => {
    return new Router({ routes })
}