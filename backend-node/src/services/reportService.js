const Sale = require('../models/Sale');

// Generar reporte de ventas por vendedor
exports.getSalesBySellerReport = async (startDate, endDate) => {
  try {
    const report = await Sale.aggregate([
      {
        $match: {
          fechaVenta: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: "$vendedorId",
          totalVentas: { $sum: 1 },
          totalMonto: { $sum: "$total" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "vendedor"
        }
      },
      {
        $unwind: "$vendedor"
      },
      {
        $project: {
          _id: 0,
          vendedorId: "$_id",
          nombreVendedor: "$vendedor.metadata.nombreCompleto",
          totalVentas: 1,
          totalMonto: 1
        }
      }
    ]);
    
    return report;
  } catch (err) {
    console.error('Error generando reporte:', err);
    throw new Error('Error al generar el reporte');
  }
};