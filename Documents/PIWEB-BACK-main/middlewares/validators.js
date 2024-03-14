const yup = require('yup');

const TeamValidator = async (req,res,next) => {
    console.log(req.body);
    try{
        const schema = yup.object().shape({
            name: yup.string().min(3).required(),
            nameAbbreviation: yup.string().min(3).max(3).required(),
            foundedIn: yup.date().required(),
            country: yup.string().required(),
            state: yup.string().required(),
            city: yup.string().required(),
            wins: yup.number(),
            losses: yup.number(),
            draws: yup.number(),
            ranking: yup.number(),
        })
        await schema.validate(req.body);
        next();
    }
    catch (error){

        res.status(400).send({ error: error.message });
    }
}


const userValidator = async (req, res, next) => {
    try {
        const schema = yup.object().shape({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            cin: yup.number().required(),
            email: yup.string().email().required(),
            birthDate: yup.date().required(),
            password: yup.string().required().min(8),
            // Add other fields as per your requirements
        });

        await schema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};


module.exports = {
    TeamValidator,
    userValidator
};