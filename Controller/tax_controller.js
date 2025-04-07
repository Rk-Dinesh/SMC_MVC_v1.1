const TaxService = require("../Service/tax_service");

exports.createTax = async (req, res, next) => {
    try {
        const { taxname, percentage } = req.body;
        const newTax = await TaxService.createTax({ taxname, percentage });

        res.status(200).json({
            success: true,
            message: "Tax created successfully",
            tax: newTax,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateTax = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { taxname, percentage } = req.body;

        const updatedTax = await TaxService.updateTax(id, { taxname, percentage });

        if (!updatedTax) {
            return res.status(404).json({ success: false, message: "Tax not found" });
        }

        res.status(200).json({
            success: true,
            message: "Tax updated successfully",
            tax: updatedTax,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteTax = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedTax = await TaxService.deleteTax(id);

        if (!deletedTax) {
            return res.status(404).json({ success: false, message: "Tax not found" });
        }

        res.status(200).json({
            success: true,
            message: "Tax deleted successfully",
            tax: deletedTax,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllTaxes = async (req, res, next) => {
    try {
        const taxes = await TaxService.getAllTaxes();
        res.status(200).json({ success: true, tax: taxes });
    } catch (error) {
        next(error);
    }
};
