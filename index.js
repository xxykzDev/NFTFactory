const express = require("express");
const multer = require("multer");
const PinataSDK = require("@pinata/sdk");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

const pinata = new PinataSDK(
  "60d5ab4e232df523b7ab",
  "25ef5b2387b89fea2ad468a916fde4268ae07a62ad0776ee5166e665c4059f3d"
);

app.post("/upload", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;
  try {
    const result = await pinata.pinFileToIPFS(fs.createReadStream(imagePath), {
      pinataMetadata: {
        name: req.file.originalname,
      },
    });
    // Borramos el archivo temporal
    fs.unlinkSync(imagePath);
    res.json({ ipfsHash: result.IpfsHash });
  } catch (error) {
    console.error(error);
    // Borramos el archivo temporal en caso de error
    fs.unlinkSync(imagePath);
    res.status(500).json({ error: "Error al subir a Piñata" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
