import nodeCache from "node-cache";

const cache = new nodeCache({stdTTL : 300});

const cacheability = (duration) =>{
    return (req,res,next) =>{
        if(req.method !== "GET"){
            return next();
        }

        const key = req.originalUrl;
        console.log(key);
        const cacheResponse = cache.get(key)

        if(cacheResponse){
            res.send(cacheResponse);
            return;
        }

        const originalSend = res.send;
        res.send = function(body){
            cache.set(key,body,duration)
            originalSend.call(this,body)
        }
        next()

    }
}
export default cacheability;