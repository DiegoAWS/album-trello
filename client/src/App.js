import axios from "axios";
import { useState } from "react";
import UploadFile from "./Components/UploadFile";
import { parseText } from "./utils/parseText";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

const App = () => {
  const [cards, setCards] = useState([])
  const fileContent = (content) => {
    const data = parseText(content);
    console.log(data);
    axios({
      url: "/api/getPictures",
      method: "post",
      data
    }).then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        const cleanData = data.filter(item => item?.album_year && !isNaN(item.album_year) && item.album_name)
        setCards(cleanData)
      }
    }).catch(err => {
      console.log({ err })
    })
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <UploadFile fileContent={fileContent} />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => { setCards([]) }}
          disabled={cards.length === 0}
        >Clean</Button>
      </div>


      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        {cards.map((item, key) =>
          <div key={key} style={{ width: "300px", padding: "10px" }}>

            <Card style={{ height: '100%', border:'1px solid black', borderRadius:'10px',margin:'10px' }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt={item?.album_name}
                  height="140"
                  image={item?.album_picture}
                  title={item?.album_name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3"> {item?.album_name}</Typography>
                  <Typography gutterBottom variant="h5" component="p"> {item?.album_year}</Typography>
                  <Typography variant="body2" color="textSecondary" component="p">{item?.album_artist} </Typography>
                </CardContent>
              </CardActionArea>

            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
