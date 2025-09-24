import Product from "./product.model.js";
import Category from "../categories/category.model.js";

export const saveProduct = async (req, res) => {
    try {
        const data = req.body;

        const categoryUtil = await Category.findById(data.category);
        if (!categoryUtil) {
            return res.status(404).json({
                success: false,
                msg: 'Category not found'
            });
        }

        const product = new Product({
            ...data,
            category: categoryUtil
        });

        await product.save();

        res.status(200).json({
            success: true,
            msg: 'Product added successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error saving product',
            error: error.message
        });
    }
};

export const getProduct = async (req, res) => {
    const { stock, sales, name, category, entryDate } = req.query;

    let filters = { status: true };  

    if (stock === "0") filters.stock = 0;

    if (name) {
        filters.name = { $regex: name, $options: "i" }; 
    }

    if (category) {
        const categoryObj = await Category.findOne({ name: { $regex: category, $options: "i" }, status: true });
        if (categoryObj) {
            filters.category = categoryObj._id;
        } else {
            filters.category = null;
        }
    }

    if (entryDate) {
        const parts = entryDate.split("-");
        let entryDateStart = new Date(entryDate);
        let entryDateEnd = new Date(entryDateStart);

        if (parts.length === 1) {
            entryDateEnd.setFullYear(entryDateEnd.getFullYear() + 1);
        } else if (parts.length === 2) {
            entryDateEnd.setMonth(entryDateEnd.getMonth() + 1);
        } else if (parts.length === 3) {
            entryDateEnd.setDate(entryDateEnd.getDate() + 1);
        }

        filters.entryDate = {
            $gte: entryDateStart,
            $lt: entryDateEnd
        };
    }

    let query = Product.find(filters);

    if (sales === "masVendido") query = query.sort({ sales: -1 });

    try {
        const products = await query.populate({
            path: "category",
            select: "name",
            match: { status: true }
        });

        const generalCategory = await Category.findOne({ name: "General", status: true });
        const total = await Product.countDocuments(filters);

        const productsWithCategory = products.map(product => ({
            ...product.toObject(),
            category: product.category ? product.category.name : generalCategory ? generalCategory.name : "General"
        }));

        res.status(200).json({
            success: true,
            total,
            products: productsWithCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error getting products",
            error: error.message || error
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const product = await Product.findByIdAndUpdate(id, data, { new: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Product updated successfully',
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating product',
            error: error.message || error
        });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const { confirm } = req.body;
    const authenticatedUser = req.usuario;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found'
            })
        }

        if (!confirm || confirm.toUpperCase() !== "YES") {
            return res.status(400).json({
                success: false,
                msg: "Action not confirmed. Send { confirm: 'YES' } in the body to proceed."
            });
        }


        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: 'Product removed successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg : 'Error deleting product',
            error
        });
    }
};

export const getProductStats = async (req, res) => {
    try {
        const products = await Product.find({ status: true });

        const totalVentas = products.reduce((acc, prod) => acc + (prod.sales || 0), 0);
        const totalInventario = products.reduce((acc, prod) => acc + (prod.stock || 0), 0);

        res.status(200).json({
            success: true,
            totalVentas,
            totalInventario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting product stats',
            error: error.message || error
        });
    }
};

export const getProductSalesPercentage = async (req, res) => {
    try {
        const products = await Product.find({ status: true });
        const totalVentas = products.reduce((acc, product) => acc + (product.sales || 0), 0);

        if (totalVentas === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay ventas registradas',
                data: []
            });
        }

        const productsWithPercentage = products.map(product => {
            const sales = product.sales || 0;
            const percentage = (sales / totalVentas) * 100;
            return {
                name: product.name,
                salesPercentage: percentage.toFixed(2)
            };
        });

        res.status(200).json({
            success: true,
            data: productsWithPercentage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener el porcentaje de ventas",
            error: error.message || error
        });
    }
};

export const getEarnings = async (req, res) => {
    try {
        const products = await Product.find({ status: true });

        let totalEarnings = 0;

        for (const product of products) {
            const unitPrice = parseFloat(product.price?.toString() || 0);
            const totalSales = product.sales || 0;
            totalEarnings += unitPrice * totalSales;
        }

        res.status(200).json({
            success: true,
            msg: "Total earnings calculated successfully",
            totalEarnings: totalEarnings.toFixed(2),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error calculating total earnings",
            error: error.message || error,
        });
    }
};

export const getTopProduct = async (req, res) => {
    try {
        const topProduct = await Product.findOne({ status: true })
            .sort({ sales: -1 })
            .limit(1);

        if (!topProduct) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontró el producto más vendido'
            });
        }

        const category = await Category.findById(topProduct.category);

        res.status(200).json({
            success: true,
            msg: 'Producto más vendido obtenido correctamente',
            product: {
                name: topProduct.name,
                category: category ? category.name : 'Desconocida',
                sales: topProduct.sales,
                price: topProduct.price,
                entryDate: topProduct.entryDate,
                image: topProduct.image || 'Imagen no disponible',
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el producto más vendido',
            error: error.message || error
        });
    }
};

export const getTop3 = async (req, res) => {
    try {
        const topProducts = await Product.find({ status: true })
            .sort({ sales: -1 })
            .limit(3);

        if (!topProducts.length) {
            return res.status(404).json({
                success: false,
                msg: "No se encontraron productos con ventas",
            });
        }

        const categoryMap = {};
        const categories = await Category.find({ status: true });
        categories.forEach(cat => {
            categoryMap[cat._id] = cat.name;
        });

        const formattedProducts = topProducts.map((product) => ({
            name: product.name,
            category: categoryMap[product.category] || "Desconocida",
            sales: product.sales,
            price: product.price,
            entryDate: product.entryDate,
            image: product.image || "Imagen no disponible",
        }));

        res.status(200).json({
            success: true,
            msg: "Top 3 productos más vendidos obtenidos correctamente",
            products: formattedProducts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener los productos más vendidos",
            error: error.message || error,
        });
    }
};
