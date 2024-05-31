class ProductController {
  constructor(productService) {
    this.service = productService;
  }

  #handleError(res, err) {
    if (err.message === "not found") {
      return res.status(404).json({ error: "Not found" });
    }

    if (err.message === "invalid parameters") {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    return res.status(500).json({ error: err.message });
  }

  //Trae los productos

  getProducts = async (req, res) => {
    try {
      const limit = req.query.limit;
      const page = req.query.page;
      const sort = req.query.sort;
      const category = req.query.category;
      const avaiability = req.query.avaiability;
      const products = await this.service.getProducts(
        limit,
        page,
        sort,
        category,
        avaiability
      );

      let data = {
        status: products ? "succcess" : "error",
        payload: products.docs,
        totalPages: products.totalPages,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        prevLink: products.prevPage
          ? `/api/products?limit=${products.limit}&page=${products.prevPage}${
              category ? `&category=${category}` : ""
            }${avaiability ? `&avaiability=${avaiability}` : ""}${
              sort ? `&sort=${sort}` : ""
            }`
          : null,
        nextLink: products.nextPage
          ? `/api/products?limit=${products.limit}&page=${products.nextPage}${
              category ? `&category=${category}` : ""
            }${avaiability ? `&avaiability=${avaiability}` : ""}${
              sort ? `&sort=${sort}` : ""
            }`
          : null,
      };
      res.status(200).json(data);
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Trae el producto buscado

  getProductById = async (req, res) => {
    try {
      const pId = req.params.pId;
      const product = await this.service.getProductById(pId);
      res.status(200).json({ product });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Crea un producto

  addProduct = async (req, res) => {
    try {
      const product = req.body;
      await this.service.addProduct(
        product.title,
        product.description,
        product.price,
        product.thumbnail,
        product.code,
        product.stock,
        product.category,
        product.status
      );
      res.status(200).send({ "Producto agregado": product });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Modifica un producto

  updateProduct = async (req, res) => {
    try {
      const pId = req.params.pId;
      const newData = req.body;
      await this.service.updateProduct({ ...newData, id: pId });
      const updatedProduct = await this.service.getProductById(pId);
      res.status(200).send({ "Producto actualizado": updatedProduct });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Elimina un producto

  deleteProduct = async (req, res) => {
    try {
      const pId = req.params.pId;
      await this.service.deleteProduct(pId);
      res.status(200).send("Producto eliminado exitosamente");
    } catch (err) {
      return this.#handleError(res, err);
    }
  };
}

module.exports = { ProductController };
