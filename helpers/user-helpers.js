var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const collections = require('../config/collections')

module.exports = {
    doSignup: (userData) => {
        console.log(userData)
        return new Promise(async (resolve, reject) => {
            let response = {}
            let email = await db.get().collection(collections.USER_COLLECTION).findOne({ email_2: userData.email_2 });
            if (email) {
                console.log('same email');
                response.status = true
                resolve(response)

            } else {
                userData.password_in_2 = await bcrypt.hash(userData.password_in_2, 10)
                db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                    resolve(data.insertedId)
                })
                console.log('no same email');
                resolve({ status: false })
            }


        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("login success")
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login faild");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("login faild");
                resolve({ status: false })
            }
        })
    }
}
