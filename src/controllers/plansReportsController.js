const plansReportsModel = require("../models/plansReportsModel");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    const {
      startMoth_uz,
      startMoth_ru,
      startMoth_oz,
      endMoth_uz,
      endMoth_ru,
      endMoth_oz,
      title_uz,
      title_ru,
      title_oz,
      description_uz,
      description_ru,
      description_oz,
      participantsCount,
      category_uz,
      category_ru,
      category_oz,
    } = req.body;

    const emptyFields = [];

    if (!startMoth_uz) emptyFields.push("Boshlanish oyi (UZ)");
    if (!endMoth_uz) emptyFields.push("Tugash oyi (UZ)");
    if (!title_uz) emptyFields.push("Sarlavha (UZ)");
    if (!description_uz) emptyFields.push("Tavsif (UZ)");
    if (!category_uz) emptyFields.push("Kategoriya (UZ)");

    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Quyidagi maydonlar to'ldirilmagan:",
        missingFields: emptyFields,
      });
    }

    const validMonthsUz = [
        "Январ", "Феврал", "Март", "Апрел", "Май", "Июн",
        "Июл", "Август", "Сентабр", "Октябр", "Ноябр", "Декабр",
      ];
      const validMonthsOz = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
      ];
      const validMonthsRu = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
      ];
  
      const validCategoriesUz = ["Режа", "Хисобот"];
      const validCategoriesOz = ["Reja", "Hisobot"];
      const validCategoriesRu = ["План", "Отчет"];
  
      // ❌ Oy nomlari noto‘g‘ri kiritilganini aniqlash
      const invalidMonths = [];
      if (startMoth_uz && !validMonthsUz.includes(startMoth_uz))
        invalidMonths.push("Boshlanish oyi (UZ)");
      if (endMoth_uz && !validMonthsUz.includes(endMoth_uz))
        invalidMonths.push("Tugash oyi (UZ)");
      if (startMoth_oz && !validMonthsOz.includes(startMoth_oz))
        invalidMonths.push("Boshlanish oyi (OZ)");
      if (endMoth_oz && !validMonthsOz.includes(endMoth_oz))
        invalidMonths.push("Tugash oyi (OZ)");
      if (startMoth_ru && !validMonthsRu.includes(startMoth_ru))
        invalidMonths.push("Boshlanish oyi (RU)");
      if (endMoth_ru && !validMonthsRu.includes(endMoth_ru))
        invalidMonths.push("Tugash oyi (RU)");
  
      if (invalidMonths.length > 0) {
        return res.status(400).json({
          message: " Noto'g'ri ma'lumot kiritildi: Oy nomi xato kiritilgan.",
          invalidFields: invalidMonths,
        });
      }
  
      const invalidCategories = [];
      if (category_uz && !validCategoriesUz.includes(category_uz))
        invalidCategories.push("Kategoriya (UZ)");
      if (category_oz && !validCategoriesOz.includes(category_oz))
        invalidCategories.push("Kategoriya (OZ)");
      if (category_ru && !validCategoriesRu.includes(category_ru))
        invalidCategories.push("Kategoriya (RU)");
  
      if (invalidCategories.length > 0) {
        return res.status(400).json({
          message: "Noto'g'ri ma'lumot kiritildi: Kategoriya xato kiritilgan.",
          invalidFields: invalidCategories,
        });
      }
    const plans = new plansReportsModel({
      startMonth: {
        uz: startMoth_uz,
        ru: startMoth_ru,
        oz: startMoth_oz,
      },
      endMonth: {
        uz: endMoth_uz,
        ru: endMoth_ru,
        oz: endMoth_oz,
      },
      title: {
        uz: title_uz,
        ru: title_ru,
        oz: title_oz,
      },
      description: {
        uz: description_uz,
        ru: description_ru,
        oz: description_oz,
      },
      participantsCount,
      category: {
        uz: category_uz,
        ru: category_ru,
        oz: category_oz,
      },
    });

    await plans.save();

    res.status(201).json({
      message: `${category_oz} bo'yicha ma'lumot muvaffaqiyatli yaratildi!`,
      plans,
    });
  } catch (e) {
    res.status(500).json({
      message: "Serverda xatolik",
      error: e.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const plans = await plansReportsModel.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha rejalar va hisobotlar", plans });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID formati!" });
    }

    const plans = await plansReportsModel.findById(id);
    if (!plans)
      return res
        .status(404)
        .json({ message: "Rejalar va hisobotlar topilmadi" });
    res
      .status(200)
      .json({ message: `${plans.category.oz} bo'yicha ma'lumot`, plans });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        startMoth_uz,
        startMoth_ru,
        startMoth_oz,
        endMoth_uz,
        endMoth_ru,
        endMoth_oz,
        title_uz,
        title_ru,
        title_oz,
        description_uz,
        description_ru,
        description_oz,
        participantsCount,
        category_uz,
        category_ru,
        category_oz,
      } = req.body;
  
      // ✅ ID tekshiruvi
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Noto'g'ri ID format" });
      }
  
      const plans = await plansReportsModel.findById(id);
      if (!plans) {
        return res
          .status(404)
          .json({ message: "Rejalar va hisobotlar topilmadi" });
      }
  
      const validMonthsUz = ["Январ", "Феврал", "Март", "Апрел", "Май", "Июн", "Июл", "Август", "Сентабр", "Октябр", "Ноябр", "Декабр"];
      const validMonthsOz = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
      const validMonthsRu = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  
      const validCategoriesUz = ["Режа", "Хисобот"];
      const validCategoriesOz = ["Reja", "Hisobot"];
      const validCategoriesRu = ["План", "Отчет"];
  
      const invalidFields = [];
  
      if (startMoth_uz && !validMonthsUz.includes(startMoth_uz)) invalidFields.push("Boshlanish oyi (UZ)");
      if (startMoth_oz && !validMonthsOz.includes(startMoth_oz)) invalidFields.push("Boshlanish oyi (OZ)");
      if (startMoth_ru && !validMonthsRu.includes(startMoth_ru)) invalidFields.push("Boshlanish oyi (RU)");
  
      if (endMoth_uz && !validMonthsUz.includes(endMoth_uz)) invalidFields.push("Tugash oyi (UZ)");
      if (endMoth_oz && !validMonthsOz.includes(endMoth_oz)) invalidFields.push("Tugash oyi (OZ)");
      if (endMoth_ru && !validMonthsRu.includes(endMoth_ru)) invalidFields.push("Tugash oyi (RU)");
  
      if (category_uz && !validCategoriesUz.includes(category_uz)) invalidFields.push("Kategoriya (UZ)");
      if (category_oz && !validCategoriesOz.includes(category_oz)) invalidFields.push("Kategoriya (OZ)");
      if (category_ru && !validCategoriesRu.includes(category_ru)) invalidFields.push("Kategoriya (RU)");
  
      if (invalidFields.length > 0) {
        return res.status(400).json({
          message: " Noto'g'ri ma'lumot kiritildi. Quyidagi maydonlar xato:",
          invalidFields,
        });
      }
  
      // ✅ Ma’lumotlarni yangilash (faqat yuborilganlarini)
      if (startMoth_uz) plans.startMonth.uz = startMoth_uz;
      if (startMoth_ru) plans.startMonth.ru = startMoth_ru;
      if (startMoth_oz) plans.startMonth.oz = startMoth_oz;
  
      if (endMoth_uz) plans.endMonth.uz = endMoth_uz;
      if (endMoth_ru) plans.endMonth.ru = endMoth_ru;
      if (endMoth_oz) plans.endMonth.oz = endMoth_oz;
  
      if (title_uz) plans.title.uz = title_uz;
      if (title_ru) plans.title.ru = title_ru;
      if (title_oz) plans.title.oz = title_oz;
  
      if (description_uz) plans.description.uz = description_uz;
      if (description_ru) plans.description.ru = description_ru;
      if (description_oz) plans.description.oz = description_oz;
  
      if (participantsCount !== undefined)
        plans.participantsCount = participantsCount;
  
      if (category_uz) plans.category.uz = category_uz;
      if (category_ru) plans.category.ru = category_ru;
      if (category_oz) plans.category.oz = category_oz;
  
      await plans.save();
  
      res.status(200).json({
        message: `✅ ${plans.category.oz} bo'yicha ma'lumot muvaffaqiyatli yangilandi!`,
        plans,
      });
    } catch (e) {
      res.status(500).json({
        message: "❌ Serverda xatolik",
        error: e.message,
      });
    }
  };

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }
    const plans = await plansReportsModel.findByIdAndDelete(id);
    if (!plans) {
      return res
        .status(404)
        .json({ message: "Rejalar yoki hisobot topilmadi!" });
    }

    res.status(200).json({
      message: `${plans.category.oz} bo'yicha ma'lumot muvaffaqiyatli o'chirildi!`,
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};
