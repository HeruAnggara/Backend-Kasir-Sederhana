import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { extname as getExtname } from 'path'; // Mengganti nama import untuk menghindari konflik
import * as multer from 'multer';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private upload = multer({
    storage: diskStorage({
      destination: './public/products',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${getExtname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(getExtname(file.originalname).toLowerCase());

      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(new BadRequestException('Invalid file type. Only .jpeg, .jpg, .png, and .gif are allowed.'));
    },
  }).single('image');

  use(req: Request, res: Response, next: () => void) {
    this.upload(req, res, (err) => {
      if (err) {
        return err;
      }
      next();
    });
  }
}
