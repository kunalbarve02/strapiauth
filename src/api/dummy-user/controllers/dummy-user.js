'use strict';
const { v4: uuidv4 } = require('uuid');
const axios = require('axios')
/**
 * dummy-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::dummy-user.dummy-user',()=>({

    async loginWithOtp(ctx){

        var number = ctx.request.body.phoneNumber 
        var password = ctx.request.body.password

        var otp = await Math.floor((Math.random() * 1000) + 1000)
        var token = await uuidv4()

        const otpApi = `http://www.sms.mairaads.com/api/mt/SendSMS?APIKey=8fa9b9573b02491e9cbe1963d17d333e&senderid=TCHMDA&channel=Trans&DCS=0&flashsms=0&number=${number}&text=Your one time password for login is ${otp}. The OTP is valid for 03 minutes. From TM&route=4`

        if(number.length!==10)
        {
            return ctx.send({error:"Phone number is not Valid"},400)
        } 
        
        let isUserExist = await strapi.db.query("plugin::users-permissions.user").findMany(
            {
              where: {
                username:number
              },
            }
          );
        if(isUserExist)
        {
            console.log("user exists")
            return ctx.send("User already exsist",400)
        }

        await strapi.query('api::dummy-user.dummy-user').delete({
            where: { phoneNumber:number }
        })
        
        await strapi.db.query('api::dummy-user.dummy-user').create({
            data:{
                username:number,
                token,
                otp,
                password
            }
        })
        try {
            await axios.get(otpApi)
            ctx.send({token},201)
        }
        catch(err){
            ctx.send(err,500)
        }

    },
    
    async verifyotp(ctx){
        var otp = ctx.request.body.otp
        var token = ctx.request.body.token

        var isValid = await strapi.db.query('api::dummy-user.dummy-user').findOne({
            where: { token },
        }
        )
        if(isValid.otp===otp)
        {
            await strapi.db.query('api::dummy-user.dummy-user').update({
                where: { token, otp },
                data:{
                    timesSubmitted:isValid.timesSubmitted+1
                }
            })
            await strapi.db.query('plugin::users-permissions.user').create({
                data:{
                    username:isValid.username,
                    password:isValid.password,
                }
            })
            ctx.send("Account created successfully",201)
        }
        else if(!isValid)
        {
            ctx.send("Token is invalid",400)
        }
        else if(isValid.otp!==otp)
        {
            ctx.send("OTP is invalid",400)
        }
    }
})  
);
