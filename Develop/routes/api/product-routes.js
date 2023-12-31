const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // find all products
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: 'tags' },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    // find a single product by its `id`
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: 'tags' },
      ],
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    // create a new product
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      await product.setTags(req.body.tagIds);
    }
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    // update product data
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedProduct[0] === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    if (req.body.tagIds && req.body.tagIds.length) {
      const product = await Product.findByPk(req.params.id);
      await product.setTags(req.body.tagIds);
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // delete one product by its `id` value
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });
    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
