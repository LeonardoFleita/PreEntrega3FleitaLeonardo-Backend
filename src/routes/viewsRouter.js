const { Router } = require("express");
const { isNotLoggedIn, isLoggedIn } = require("../middlewares/auth.middleware");

const router = Router();

//Función que verifica y retorna si el usuario está logueado y los datos del usuario

async function userSession(req) {
  const userManager = req.app.get("userManager");
  const admin = req.app.get("admin");
  const superAdmin = req.app.get("superAdmin");
  const userData = req.session.user;
  let user;
  let isLoggedIn;
  if (userData) {
    if (userData.id === admin._id) {
      user = admin;
    } else if (userData.id === superAdmin._id) {
      user = superAdmin;
    } else {
      user = await userManager.getUserById(userData.id);
    }
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  return { user, isLoggedIn };
}

//Index, retorna la vista de productos. Si no hay una sesión iniciada, en el header se puede acceder al login y registro de usuario, en caso que sí haya una sesión iniciada se mostrarán los datos del usuario y se podrá cerrar sesión

router.get(`/`, async (req, res) => {
  const productManager = req.app.get("productManager");
  const limit = req.query.limit;
  const page = req.query.page;
  const sort = req.query.sort;
  const category = req.query.category;
  const avaiability = req.query.avaiability;
  const products = await productManager.getProducts(
    limit,
    page,
    sort,
    category,
    avaiability
  );
  const { user, isLoggedIn } = await userSession(req);

  res.render(`index`, {
    title: "Productos",
    products: products.docs,
    ws: true,
    scripts: ["index.js"],
    css: ["styles.css"],
    endPoint: "Home",
    login: true,
    isLoggedIn,
    user,
  });
});

//Devuelve la vista del carrito seleccionado. Si el usuario no está logueado esta vista es inaccesible

router.get("/carts/:cId", isLoggedIn, async (req, res) => {
  const cartManager = req.app.get("cartManager");
  const cId = req.params.cId;
  const cart = await cartManager.getCartByIdPopulate(cId);
  const products = cart[0].products.map((p) => {
    return { ...p, totalPrice: p.product.price * p.quantity };
  });
  const { user, isLoggedIn } = await userSession(req);
  res.render("cart", {
    title: "Carrito",
    products: products,
    ws: true,
    scripts: ["cart.js"],
    css: ["styles.css"],
    endPoint: "Cart",
    login: true,
    user,
    isLoggedIn,
  });
});

//Retorna la vista de login. Si hay una sessión iniciada no se podrá acceder a esta sección

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login", {
    title: "Login",
    ws: false,
    css: ["styles.css"],
    endPoint: "Login",
    login: false,
  });
});

//Retorna la vista de registro. Si hay una sessión iniciada no se podrá acceder a esta sección

router.get("/register", isNotLoggedIn, (req, res) => {
  res.render("register", {
    title: "Registro",
    ws: false,
    css: ["styles.css"],
    endPoint: "Registro",
    login: false,
  });
});

module.exports = router;
