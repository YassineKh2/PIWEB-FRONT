const yup = require('yup');

const validate = async (req, res, next) => {
    try {
        const schema = yup.object().shape({
            name: yup.string().required().matches(/^[A-Za-z]+$/),
            description: yup.string().required(),
            contact: yup.number().required().test('len', 'Contact must be exactly 8 digits', val => String(val).length === 8),
            adresse: yup.string().required()
        });

        await schema.validate(req.body);
        next();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = validate;
