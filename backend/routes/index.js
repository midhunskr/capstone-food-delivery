import e from "express"
import v1Router from "./v1/index.js"
import v2Router from "./v2/index.js"

const apiRouter = e.Router()

//Import 'v1Router' from 'v1/index.js' — legacy API, kept for the old frontend
apiRouter.use('/v1', v1Router)

//Import 'v2Router' from 'v2/index.js' — new customer-facing API
apiRouter.use('/v2', v2Router)

export default apiRouter