const crypto=require('crypto')
// hash creation functions
const hash=async(password)=>{
        return new Promise((resolve,reject)=>{
        const salt=crypto.randomBytes(12).toString("hex")

        crypto.scrypt(password,salt,10,(err,derivedKey)=>{
            if(err) 
            reject(err)
            resolve(salt+":"+derivedKey.toString('hex'))
        })
    })
}

// password verification function
const verify=async(password,hash)=>{
    return new Promise((resolve,reject)=>{
        const [salt,key]=hash.split(":")
        crypto.scrypt(password,salt,10,(err,derivedKey)=>{
            if(err)reject
            resolve(key==derivedKey.toString('hex'))
        })
    })
}

// create hash using different algorithms
const generatehash=async(data)=>{
    const hash_data=crypto.createHash('sha256').update(data).digest('hex')
    return hash_data
}

module.exports={
    hash:hash,
    verify:verify,
    generatehash:generatehash
}