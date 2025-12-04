
// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import {
//   createMovie,
//   getMovies,
//   getMovieById,
//   deleteMovie,
// } from "../controllers/moviesController.js";

// const movieRouter = express.Router();

// /* ------------------------------------------
//    Ensure uploads folder exists
// ------------------------------------------- */
// const uploadPath = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// /* ------------------------------------------
//    Multer Storage Config
// ------------------------------------------- */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e5);
//     cb(null, `movie-${unique}${path.extname(file.originalname)}`);
//   },
// });

// /* ------------------------------------------
//    Only these fields accept file uploads
//    (trailerUrl and videoUrl are TEXT fields)
// ------------------------------------------- */
// const upload = multer({ storage }).fields([
//   { name: "poster", maxCount: 1 },
//   { name: "ltThumbnail", maxCount: 1 },

//   // file lists
//   { name: "castFiles", maxCount: 20 },
//   { name: "directorFiles", maxCount: 20 },
//   { name: "producerFiles", maxCount: 20 },
//   { name: "ltDirectorFiles", maxCount: 20 },
//   { name: "ltProducerFiles", maxCount: 20 },
//   { name: "ltSingerFiles", maxCount: 20 },

//   // ❌ DO NOT upload video/trailer here
//   // trailerUrl - text input only
//   // videoUrl   - text input only
// ]);

// /* ------------------------------------------
//    Routes
// ------------------------------------------- */
// movieRouter.post("/", upload, createMovie);
// movieRouter.get("/", getMovies);
// movieRouter.get("/:id", getMovieById);
// movieRouter.delete("/:id", deleteMovie);

// export default movieRouter;


import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

import {
  createMovie,
  getMovies,
  getMovieById,
  deleteMovie,
} from "../controllers/moviesController.js";

const movieRouter = express.Router();

/* ------------------------------------------
   Cloudinary Storage
------------------------------------------- */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "movies",
    resource_type: "image", // we only upload images
  },
});

const upload = multer({ storage }).fields([
  { name: "poster", maxCount: 1 },
  { name: "ltThumbnail", maxCount: 1 },

  { name: "castFiles", maxCount: 20 },
  { name: "directorFiles", maxCount: 20 },
  { name: "producerFiles", maxCount: 20 },
  { name: "ltDirectorFiles", maxCount: 20 },
  { name: "ltProducerFiles", maxCount: 20 },
  { name: "ltSingerFiles", maxCount: 20 },
]);

/* ------------------------------------------
   Routes
------------------------------------------- */
movieRouter.post("/", upload, createMovie);
movieRouter.get("/", getMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.delete("/:id", deleteMovie);

export default movieRouter;
