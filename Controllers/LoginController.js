const ServiceProviderModel = require("../Models/ServiceProviderModel");
const UserModel = require("../Models/UserModel")


let consumerLogin = async (req,res)=>{
    let {email,password} = req.body
    let user = await UserModel.findOne({ email: email });

    if (!user) {
        return res.status(404).json("User Not Found");
    }

    if(user.password == password)
        return res.status(200).json(user);

    return res.status(400).json("invalid password")

}

let ProviderLogin = async (req,res)=>{
    let {email,password} = req.body
    let user = await ServiceProviderModel.findOne({ email: email });

    if (!user) {
        return res.status(404).json("User Not Found");
    }

    if(user.password == password)
        return res.status(200).json(user);

    return res.status(400).json("invalid password")

}

module.exports = {
    consumerLogin,
    ProviderLogin
}