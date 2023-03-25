module.exports={
    routes:[
        { 
            method: 'POST',
            path: '/dummy-users/signup/otp', 
            handler: 'dummy-user.loginWithOtp',
            config: {
                auth: false,
            }
        },
        {
            method: 'POST',
            path: '/dummy-users/signup/verifyotp', 
            handler: 'dummy-user.verifyotp',
            config: {
                auth: false,
            }
        }
    ]
}