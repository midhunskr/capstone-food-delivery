import express from 'express'

const router = express.Router()

router.get('/', async(req, res, next) => {
    console.log('payment item get method accessed');
    
})

router.post('/', async(req, res, next) => {
    console.log('payment item post method accessed');
    
})

router.put('/', async(req, res, next) => {
    console.log('payment item put method accessed');
    
})

router.delete('/', async(req, res, next) => {
    console.log('payment item delete method accessed');
    
})

export default router