import express from 'express'

const router = express.Router()

router.get('/', async(req, res, next) => {
    console.log('order get method accessed');
    
})

router.post('/', async(req, res, next) => {
    console.log('order post method accessed');
    
})

router.put('/', async(req, res, next) => {
    console.log('order put method accessed');
    
})

router.delete('/', async(req, res, next) => {
    console.log('order delete method accessed');
    
})

export default router