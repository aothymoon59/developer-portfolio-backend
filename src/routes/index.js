import adminRoutes from "../modules/admin/admin.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import messageRoutes from "../modules/messages/message.routes.js";
import portfolioRoutes from "../modules/portfolio/portfolio.routes.js";

export const registerRoutes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/portfolio", portfolioRoutes);
  app.use("/api/v1/messages", messageRoutes);
  app.use("/api/v1/admin", adminRoutes);
};
