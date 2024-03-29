const express = require("express");
const router = express.Router();

const { Tag } = require("../models");
const { createTagForm, bootstrapField } = require("../forms");
const { checkIfAuthenticated } = require("../middlewares/auth");

router.get("/add", checkIfAuthenticated, async (req, res) => {
  try {
    const tagForm = createTagForm();
    res.render("tags/add", { form: tagForm.toHTML(bootstrapField) });
  } catch (err) {
    req.flash("error_messages", "Something went wrong!");
    res.redirect("/");
  }
});

router.post("/add", checkIfAuthenticated, async (req, res) => {
  try {
    const tagForm = createTagForm();

    tagForm.handle(req, {
      success: async (form) => {
        const newTag = new Tag();
        newTag.set({ ...form.data });
        await newTag.save();
        res.redirect("/");
      },
      error: (form) => {
        res.render("tags/add", { form: form.toHTML(bootstrapField) });
      },
      empty: (form) => {
        res.render("tags/add", { form: form.toHTML(bootstrapField) });
      },
    });
  } catch (err) {
    req.flash("error_messages", "Something went wrong!");
    res.redirect("/");
  }
});

module.exports = router;
