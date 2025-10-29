const leaderShipModel = require("../models/leaderModel")


exports.create = async (req, res) => {
    try{
        const {fullName, grade, phone, email, avatar, workDays, workHours, description} = req.body;

        if(!fullName || !grade || !phone || !workDays || !workHours) {
            return res.status(400).json({message: "Barcha maydonlarni to'ldirish shart!"})
        }

        const leader = new leaderShipModel({
            fullName,
            grade,
            phone,
            email,
            avatar,
            workDays,
            workHours,
            description
        });

        await leader.save();
        res.status(201).json({message: "Rahbar muvafaqiyatli qo'shildi.", leader});
    }catch(e) {
        console.error(e);
        res.status(500).json({message: "Serverda xatolik", error: e.message})
    }
}

exports.getAllLeader = async (req, res) => {
    try{
        const leader = await leaderShipModel.find()
        res.status(200).json({message: "Barcha rahbarlar", leader})
    }catch(e) {
        console.log(e)
    }
}

exports.remove = async (req, res) => {
    try{
        const leader = await leaderShipModel.findById(req.params.id);
        if(!leader) {
            return res.status(404).json({message: "Rahbar topilmadi."})
        }
        await leaderShipModel.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "Rahbar muvafaqiyatli o'chirildi"})
    } catch(e){
        res.status(500).json({message: "Serverda xatolik"})
    }
}

exports.update = async (req, res) => {
    try{
        const {fullName, grade, phone, email, avatar, workDays, workHours, description} = req.body;

        const leader = await leaderShipModel.findById(req.params.id);
        if(!leader) {
            return res.status(404).json({message: "Rahbar topilmadi!"})
        }
        if(fullName) leader.fullName = fullName;
        if(grade) leader.grade = grade;
        if(phone) leader.phone = phone;
        if(email) leader.email = email;
        if(avatar) leader.avatar = avatar;
        if(workDays) leader.workDays = workDays;
        if(workHours) leader.workHours = workHours;
        if(description) leader.description = description;

        await leader.save();

        res.status(200).json({message: "Rahbar muvafaqaiyatli yangilandi,", leader})
    }catch(e) {
        console.log(e)
        res.status(500).json({message: "Serverda xatolik", error: e.message})
    }
}