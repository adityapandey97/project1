/*
===============================================================================
                        📂 FILE UPLOAD USING MULTER
===============================================================================

WHAT IS MULTER?
---------------
Multer is an Express middleware used to handle file uploads like images, PDFs,
documents, videos, etc. Express cannot handle files by default, so multer helps
us process multipart/form-data requests.

WHY WE NEED MULTER?
-------------------
When users upload:
  - profile pictures
  - medical reports
  - prescriptions
  - documents

we need a way to save those files on the server. Multer handles this easily.

-------------------------------------------------------------------------------
HOW THIS CODE WORKS:
-------------------------------------------------------------------------------

1️⃣ diskStorage():
   We configure where and how files will be stored.

2️⃣ destination:
   cb(null, './public/temp')
   → Save uploaded files inside /public/temp folder.

3️⃣ filename:
   cb(null, file.originalname)
   → Save file using its original name.

   Example:
     photo.png → public/temp/photo.png

   NOTE:
   Using original name may overwrite files if names are same.
   Better practice:
     Date.now() + file.originalname

4️⃣ multer({ storage })
   → Creates upload middleware.

5️⃣ export default upload
   → So we can use it in routes.

-------------------------------------------------------------------------------
HOW TO USE IN ROUTES:
-------------------------------------------------------------------------------

Single file:
  upload.single("image")

Multiple files:
  upload.array("images", 5)

Access file info:
  req.file or req.files

-------------------------------------------------------------------------------
WHAT WE GET AFTER UPLOAD:
-------------------------------------------------------------------------------
req.file contains:
{
  filename,
  path,
  size,
  mimetype
}

-------------------------------------------------------------------------------
REAL PROJECT USE CASES:
-------------------------------------------------------------------------------
- Profile pictures
- Patient reports
- Lab PDFs
- Medical documents
- Prescriptions

-------------------------------------------------------------------------------
SUMMARY:
-------------------------------------------------------------------------------
Multer helps upload and store files on the server safely and easily.
===============================================================================
*/

import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
  })
export default upload;