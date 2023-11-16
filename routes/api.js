const express = require("express");
const https = require("https");
const path = require("path");
const router = express.Router();

const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uri =
    "mongodb+srv://aliba:aliba@cluster1.wfqyfpl.mongodb.net/skillcheck";

const JWT_SECRET =
    "@ALIBEK@SLAVE@fleksml13EC3k2mk@#mlkl@ALIBEK@SLAVE@fmeSM2f4mk2m4@#Krn2k#@ALIBEK@SLAVE@";

router.route("/signup").post(async (req, res) => {
    const client = new MongoClient(uri);
    console.log(req.body);
    const { username, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);

    try {
        await client.connect();
        const database = client.db("skillcheck");
        const users = database.collection("users");

        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(409).send("User with such email already exists!");
        }

        const sanitizedEmail = email.toLowerCase();

        const data = {
            username,
            email: sanitizedEmail,
            hashed_password: hashedpassword,
            subscription: false,
        };
        const insertedUser = await users.insertOne(data);

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24,
        });
        res.status(201).json({ token, username, email: sanitizedEmail });
    } catch (err) {
        console.log(err);
    }
});

router.route("/login").post(async (req, res) => {
    const client = new MongoClient(uri);
    const { email, password } = req.body;

    try {
        await client.connect();
        const database = client.db("skillcheck");
        const users = database.collection("users");

        const user = await users.findOne({ email });
        // console.log(user._id);

        if (!user) {
            console.log("no such user");
            return res
                .status(401)
                .send("Invalid username/password or user does not exist!");
        }

        if (await bcrypt.compare(password, user.hashed_password)) {
            // the username, password combination is successful

            const token = jwt.sign({
                id: user._id,
                email: user.email,
            },
                JWT_SECRET
            );

            return res.status(201).json({ data: token });
        } else {
            console(res.status);
        }
    } catch (err) {
        res.status(401).send("Invalid username/password or user does not exist!");
    }
});

router.route("/subscribe").post(async (req, res) => {
    const client = new MongoClient(uri);
    const { token } = req.body;

    try {
        const user = jwt.verify(token, JWT_SECRET);
        await client.connect();
        const database = client.db("skillcheck");
        const users = database.collection("users");
        const id = new ObjectId(user.id);
        const hasSubscription = await users.findOne({ _id: id, subscription: true });
        if (hasSubscription) {
            return res.status(201).send("You already have relevant subscription!");
        }
        const filter = { _id: id };
        console.log(id);

        const updateDoc = {
            $set: {
                subscription: true,
            },
        };

        const result = await users.updateOne(filter, updateDoc);
        console.log(result);

        res.status(201).send("Your subscription has been successfully completed!");
    } catch (error) {
        res.status(401).send("Unauthorized users can't get subscription!");
    }
});

module.exports = router;