// src/middlewares/authorize.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";
import { errorResponse } from "../libs/responseHelper";
import { HttpStatus } from "../constants/enums/status-code";

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        "Unauthorized — chưa đăng nhập",
      );
    }

    if (roles.length === 0) {
      return next();
    }

    // Check role
    const hasRole = roles.includes(req.user.role);

    if (!hasRole) {
      return errorResponse(
        res,
        HttpStatus.FORBIDDEN,
        "Forbidden — không có quyền thực hiện thao tác này",
      );
    }

    next();
  };
}
