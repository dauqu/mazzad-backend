const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const favRef = db.collection("favorites");
const prodRef = db.collection("products");

const { getAuthUser } = require("../functions/getauth");

//Get all favorites
router.get("/my",getAuthUser, async (req, res) => {
    try {
        const allFavProducts = [];
        const user = req.user;
        const favSnapshot = await favRef.where("user", "==", user.id).get();

        const favPromise = favSnapshot.docs.map(async (favDoc) => {
            try {
                const productRef = prodRef.doc(favDoc.data().product)
                const productDoc = await productRef.get();

                const productData = productDoc.data();
                const favdata = favDoc.data();

                allFavProducts.push({
                    id: favDoc.id,
                    ...favdata,
                    product: {
                        id: productDoc.id,
                        ...productData
                    },
                });
            } catch (error) {
                console.log(error.message);
            }
        });

        await Promise.all(favPromise);

        return res.status(200).json(allFavProducts);
    } catch (error) {
        return res.json({
            message: error.message,
            error: error.code
        });
    }
});


//Get all favorites
router.get("/product/:id",getAuthUser, async (req, res) => {
    try {
        const { id }= req.params;
        const user = req.user;
        
        const products = [];

        let favSnapshot = favRef.where("product", "==", id);
        favSnapshot = await favSnapshot.where("user", "==", user.id).get();

        favSnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        if (products.length === 1) {
            return res.status(200).json(true);
        }
        return res.status(200).json(false);
    } catch (error) {
        return res.json(false);
    }
});


//Add favorite
router.post("/",getAuthUser, async (req, res) => {
    try {
        const { product_id } = req.body;
        const user = req.user;

        const checkProd = await prodRef.doc(product_id).get();
        if (!checkProd.exists) {
            return res.status(404).json({ message: "Product not found" });
        }

        const favDoc = await favRef.add({
            product: product_id,
            user: user.id,
            type: req.body.type || "product",
            createdAt: new Date().toISOString()
        });

        return res.status(201).json({
            message: "Product added to favorites successfully",
            favorites: {
                id: favDoc.id,
                ...(await favRef.doc(favDoc.id).get()).data()
            }
        });
        
    } catch (error) {
        return res.json({
            message: error.message,
            error: error.code
        });
    }
});

//Add favorite
router.delete("/",getAuthUser, async (req, res) => {
    try {
        const { product_id } = req.body;
        const user = req.user;

        const checkProd = await prodRef.doc(product_id).get();
        if (!checkProd.exists) {
            return res.status(404).json({ message: "Product not found" });
        }

        let favDoc = favRef.where("product", "==", product_id)
        favDoc = await favDoc.where("user", "==", user.id).get();

        favDoc.forEach((doc) => {
            doc.ref.delete();
        });


        return res.status(200).json({
            message: "Product removed from favorites successfully",
        });
        
    } catch (error) {
        return res.json({
            message: error.message,
            error: error.code
        });
    }
});


module.exports = router;