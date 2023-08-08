import express from "express";
import db from "../models";
const router = express.Router()
const argon2 = require("argon2")
const {makeToken}= require("../utils")
const {checkForUser} = require('../middileware/auth.middleware')




 router.post("/login",async(req:any,res:any,next:any)=>{
    
    try {
        const user = await db.User.findOne({
            where:{
                email:req.body.email
            },
            attributes: ["id", "password", "name"],
        })

        if(!user){
           return res.status(403).send({
            "msg":"user not exist"
        })
        }

        const passwordOk = await argon2.verify(user.password, req.body.password)
        
        if (!passwordOk) {
            return res.status(403).send({
              msg: "user credntials invalid",
            });
        }

        // let payload = {
        //   email:req.body.email,
        //   password:req.body.password
        // }

        // const data = await db.User.create({
        //     ...req.body
        // })
        const token = makeToken({
          user:user.id
        })
        return res.send({
          token
        })
        
    } catch (error) {
        next(error);   
    }
 })
 
 router.post("/signup",async(req:any,res:any,next:any)=>{
    console.log(req.body);
    
    
    try {
        //check if the userName is taken
        const userNameTaken = await db.User.findOne({
          where: {
            name: req.body.name,
          },
        });
        if (userNameTaken) {
          return res.status(201).send({
            msg: "username already exist",
          });
        }
        //PASSWORD HASH
        const passwordHash = await argon2.hash(req.body.password);
    
        //PASSWORD VERIFICATION
        const passwordSame = await argon2.verify(passwordHash, req.body.password);
    
        const userPaylad = {
          name: req.body.name,
          email:req.body.email,
          password: passwordHash,
        };
    
        const newUser = await db.User.create(userPaylad);
        return res.status(200).send({
          id: newUser.id,
        });
     } catch (error) {
         next(error);   
     }
  })

  router.get("/info", checkForUser, async(req:any,res:any,next:any)=> {
    try {
      const userInfo = await db.User.findOne({
        where: {
          id: res.locals.user,
        },
        attributes: ["id", "name"],
      });
      const json = JSON.parse(JSON.stringify(userInfo));
      return res.status(200).send({ ...json });
    } catch (error) {
      return next(error);
    }
  })

  

module.exports = router