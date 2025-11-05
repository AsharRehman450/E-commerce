import error from "../middlewares/error.js";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import customRoutes from "./custom.routes.js";
import productRoutes from "./product.routes.js";
import orderRoutes from "./order.routes.js";
import customerRoutes from "./customer.routes.js";
import locationRoutes from "./location.routes.js";
import discountRoutes from "./discount.routes.js";
import checkout from "./checkout.routes.js";
import modifierRoutes from "./modifier.routes.js";
import modifierListRoutes from "./modifierList.routes.js";
import employeeRoutes from "./employee.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import scheduleRouter from "./schedule.routes.js";
import reviewRoutes from "./review.routes.js";
// import reviewRoutes from "./"
const routes = (app) => {
  //User
  app.use("/api", authRoutes);

  //Products
  app.use("/api", productRoutes);

  //Category
  app.use("/api", categoryRoutes);

  //Review
  app.use("/api",reviewRoutes)
  
  //Custom
  app.use("/api", customRoutes);

  //Order
  app.use("/api", orderRoutes);

  //Customer
  app.use("/api", customerRoutes);

  //Location
  app.use("/api", locationRoutes);

  //Discount
  app.use("/api", discountRoutes);

  //Checkout
  app.use("/api", checkout);

  //Modifier
  app.use("/api", modifierRoutes);

  //Modifier List
  app.use("/api", modifierListRoutes);

  //employee 
  app.use("/api", employeeRoutes)

  //attendance
  app.use("/api", attendanceRoutes);

  //schedule
  app.use('/api', scheduleRouter);

  // Error
  app.use(error);
};

export default routes;
