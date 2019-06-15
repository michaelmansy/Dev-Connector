const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//validation
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

//REGISTRATION
//@route     GET api/auth
//@desc      Test route
//@access    public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//LOGIN
//@route     POST api/auth 
//@desc      Authenticate user & get token 
//@access    public
router.post('/', [
    check('password', 'Password is required').exists()
],
    async (req, res) => {
        //handle the response of validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //now...no errors so we handle user registration
        const { email, password } = req.body;

        try {
            //check if user already exists
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            //compare passwords and see if they match
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }


            //return jsonwebtoken
            const payload = {
                user: {
                    id: user.id,
                    email: user.email
                }
            };

            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });

            // res.send('User registered');

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Started but there is an issue ya7mar');
        }

    });



module.exports = router;