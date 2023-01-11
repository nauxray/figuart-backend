const express = require("express");
const router = express.Router();

const { CartItem } = require("../models");
const { checkIfAuthenticated } = require("../middlewares");

router.get("/:id", checkIfAuthenticated, async (req, res) => {
  try {
    const cart = await CartItem.query({
      where: { user_id: req.params.id },
    }).fetchAll({
      withRelated: {
        product: (query) => {
          query
            .join("shop", "shop.id", "=", "products.shop_id")
            .join("users", "users.id", "=", "shop.user_id")
            .select(
              "shop.shop_bio",
              "products.*",
              "users.username as shop_name",
              "users.pfp",
              "users.role",
              "users.email"
            );
        },
      },
      require: false,
    });
    res.send(cart.toJSON());
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;