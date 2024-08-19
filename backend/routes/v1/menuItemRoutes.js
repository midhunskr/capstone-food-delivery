import express from 'express'

const router = express.Router()

router.get('/', async(req, res, next) => {
    console.log('menu item get method accessed');
    
})

router.post('/', async(req, res, next) => {
    console.log('menu item post method accessed');
    
})

router.put('/', async(req, res, next) => {
    console.log('menu item put method accessed');
    
})

router.delete('/', async(req, res, next) => {
    console.log('menu item delete method accessed');
    
})

export default router