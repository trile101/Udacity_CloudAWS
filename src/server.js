import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async (req, res) => {
    const { image_url } = req.query;

    // Validate image url
    if (  !image_url) {
      return res.status(400).send('image_url parameter is required');
    }
    try {
      // Filter image
      const path = await filterImageFromURL(image_url)
      // Send result file
      res.sendFile(path, () => {
        deleteLocalFiles([path])
      })
    } catch (error) {
      console.error('Error filtering image:', error);
      if (error == "Could not read image.") {
        res.status(500).send('Could not read image.');
      } else {
        res.status(500).send('Error filtering image');
      }
      
    }
  })
  
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
