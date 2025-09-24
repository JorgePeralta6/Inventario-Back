import Category from "./category.model.js";

export const saveCategory = async (req, res) => {
    try {
        const authenticatedUser = req.usuario; 
        if (authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: 'You do not have permission to add categories'
            });
        }
        const data = req.body;
        const category = new Category({
            ...data
        });
        await category.save();
        res.status(200).json({
            success: true,
            msg: 'Category added Successfully',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error saving category',
            error
        });
    }
};

export const getCategories = async (req, res) => {
    const {limit = 10, since = 0} = req.query;
    const query = {status: true};
    try {
        const categories = await Category.find(query)
            .skip(Number(since))
            .limit(Number(limit))

        const total = await Category.countDocuments(query)
        res.status(200).json({
            success: true,
            total,
            categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al getting categories',
            error
        })
    }
}

export const updateCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id,...data} = req.body;

        const authenticatedUser = req.usuario; 
        if (authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: 'You do not have permission to update categories'
            });
        }
    
        const category = await Category.findByIdAndUpdate(id, data, {new: true});
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: 'Category not found'
            })
        }
        res.status(200).json({
            success: true,
            msg: 'Category Updated Successfully',
            category
        })
    } catch (error) {
        res.status(500).json({
            succcess: false,
            msg: 'Error Updating Category ',
            error
        })
    }
}


export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const authenticatedUser = req.usuario; 

        await Category.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            msg: 'Category removed successfully'
        })       
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deleting Category',
            error
        })
    }
}

export const createCategory = async () => {
    try {
        const existCategory = await Category.findOne({name: "Varios"})
        if (!existCategory) {
            const newCategory = new Category({
                name: "Varios"
            })
            await newCategory.save()
        }
    } catch (error) {
        console.log(error)
    }
}