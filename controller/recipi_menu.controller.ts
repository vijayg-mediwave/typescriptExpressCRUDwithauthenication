import express from "express"
import db from "../models"
const router = express.Router()
const { checkForUser } = require('../middileware/auth.middleware')

router.post("/", checkForUser, async (req: any, res: any, next: any) => {
    try {
        const recipiPayload = {
            ...req.body,
            createdByUser: res.locals.user,
        }
        const newRecipi = await db.recipe_menu.create(recipiPayload)
        return res.status(200).send(newRecipi)
    } catch (error) {
        next(error)
    }
})

router.get("/", async (req: any, res: any, next: any) => {
    try {
        const getRecipi = await db.recipe_menu.findAll({})
        return res.status(200).send(getRecipi)
    } catch (error) {
        next(error)
    }
})

router.get("/:recipeid", checkForUser, async (req: any, res: any, next: any) => {

    const id = req.params.recipeid
    try {
        const getRecipe = await db.recipe_menu.findOne({
            where: {
                recipeId: id,
            },
            include: [
                {
                    model: db.User,
                    as: "createdUserInfo",
                    attributes: ["id", "name"],
                }
            ]
        })
        return res.status(200).send(getRecipe)
    } catch (error) {
        next(error)
    }
})

router.put("/:recipeid", checkForUser, async (req: any, res: any, next: any) => {
    const id = req.params.recipeid

    try {
        const getRecipe = await db.recipe_menu.findOne({
            where: {
                recipeId: id,
                createdByUser: res.locals.user
            }
        })

        if (!getRecipe) {
            return res.status(404).send("Recipe not found");
        }

        if (req.body.recipeName) {
            getRecipe.recipeName = req.body.recipeName

        }

        if (req.body.recipeImage) {
            getRecipe.recipeImage = req.body.recipeImage
        }

        if (req.body.recipePrice) {
            getRecipe.recipePrice = req.body.recipePrice
        }

        await getRecipe.save();

        return res.status(200).send(getRecipe)
    } catch (error) {
        next(error)
    }
})

router.delete("/:recipeid", checkForUser, async (req: any, res: any, next: any) => {
    const id = req.params.recipeid
    
    const deleteCount = await db.recipe_menu.destroy({
        where: {
            recipeId: id,
            createdByUser: res.locals.user
        }
    })

    if (deleteCount === 0) {
        return res.status(404).send({
            msg: "recipe not found",
        });
    }

    res.send({
        delete: deleteCount,
    });
})

module.exports = router