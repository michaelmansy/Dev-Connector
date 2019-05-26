const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');


//validation
const { check, validationResult } = require('express-validator/check');

//@route     POST api/users
//@desc      Register Users
//@access    public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
    async (req, res) => {
        //handle the response of validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //now...no errors so we handle user registration
        const { name, email, password } = req.body;

        try {
            //check if user already exists
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }
            //get user gravatar
            const avatar = gravatar.url(email, {
                s: '200',  //size
                r: 'pg',  //rating
                d: 'mm'  //default
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //Encypt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);    //hash pw

            await user.save();   //save user to db

            //return jsonwebtoken

            res.send('User registered');

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Started but there is an issue');
        }

    });

module.exports = router;