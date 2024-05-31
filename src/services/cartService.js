class CartService {
  constructor(cartManager) {
    this.manager = cartManager;
  }

  //Trae todos los carritos

  getCarts = async () => {
    try {
      return await this.manager.getCarts();
    } catch (err) {
      return [];
    }
  };

  //Crea un nuevo carrito

  addCart = async () => {
    try {
      return await this.manager.addCart();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  //Busca un carrito por su id

  getCartById = async (cartId) => {
    try {
      if (cartId === ":cId") {
        throw new Error("invalid parameters");
      }
      return await this.manager.getCartByIdPopulate(cartId);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Agrega un producto al carrito

  addProductToCart = async (cartId, productId) => {
    try {
      if (cartId === ":cId" || productId === ":pId") {
        throw new Error("invalid parameters");
      }
      return await this.manager.addProductToCart(cartId, productId);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Limpiar carrito

  cleanCart = async (cartId) => {
    try {
      try {
        if (cartId === ":cId") {
          throw new Error("invalid parameters");
        }
        await this.manager.getCartById(cartId);
      } catch (err) {
        throw Error(err.message);
      }
      return await this.manager.cleanCart(cartId);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Eliminar producto del carrito

  deleteProductFromCart = async (cartId, productId) => {
    try {
      if (cartId === ":cId" || productId === ":pId") {
        throw new Error("invalid parameters");
      }
      await this.manager.deleteProductFromCart(cartId, productId);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Actualiza productos del carrito

  updateProductsFromCart = async (cartId, data) => {
    try {
      if (cartId === ":cId" || Object.keys(data).length === 0) {
        throw new Error("invalid parameters");
      }
      let formatedData = data.map((p) => {
        if (!p.product || !p.quantity || typeof p.quantity !== "number") {
          throw new Error("invalid parameters");
        }
        return { product: p.product, quantity: p.quantity };
      });
      await this.manager.updateProductsFromCart(cartId, formatedData);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Actualiza la cantidad de un producto del carrito

  updateQuantityProductFromCart = async (cartId, prodId, data) => {
    try {
      if (
        !data.quantity ||
        typeof data.quantity !== "number" ||
        cartId === ":cId" ||
        prodId === ":cId"
      ) {
        throw new Error("invalid parameters");
      }
      return await this.manager.updateQuantityProductFromCart(
        cartId,
        prodId,
        data
      );
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Finaliza la compra

  purchase = async (cartId, userEmail, productManager) => {
    try {
      if (cartId === ":cId") {
        throw new Error("invalid parameters");
      }
      return await this.manager.purchase(cartId, userEmail, productManager);
    } catch (err) {
      throw Error(err.message);
    }
  };
}

module.exports = { CartService };
