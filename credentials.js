/**
 * Created by William Gu on 2016/5/3.
 */

module.exports = {
    cookieSecret: 'cookie secret',
    gmail: {
        user: 'imochaus@gmail.com',
        password: 'test'
    },
    mongo: {
        development: {
            connectionString: 'mongodb://ywgu:guyiwen@ds011870.mlab.com:11870/guyiwen'
        },
        production: {
            connectionString: 'mongodb://ywgu:guyiwen3@ds011870.mlab.com:11870/guyiwen'
        }
    },
    authProviders: {
        facebook: {
            development: {
                appId: 'uprint',
                appSecret: 'test'
            }
        }
    },
    twitter: {
        consumerKey: 'abc',
        consumerSecret: 'secret'
    }
}
