import axios from "axios";
import { useState, useRef } from "react";
import UploadFile from "./Components/UploadFile";
import { parseText } from "./utils/parseText";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Skeleton from '@material-ui/lab/Skeleton';

const App = () => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null)
  const fileContent = (content) => {
    const data = parseText(content);
    setLoading(true);

    const dirtyData = data.map(item => ({
      album_name: item?.album,
      album_year: item?.year
    }))

    setCards(dirtyData);

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
    }).finally(() => {
      setLoading(false)
    })
  }

  const clearListFiles = () => {
    setCards([])
    formRef.current.reset();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <form ref={formRef}>
          <UploadFile fileContent={fileContent} />
        </form>
        <Button
          variant="contained"
          color="secondary"
          onClick={clearListFiles}
          disabled={cards.length === 0}
        >Clean</Button>
      </div>


      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>


        {cards.map((item, key) =>
          <div key={key} style={{ width: "300px", margin: '10px' }}>

            <Card style={{ height: '100%', border: '1px solid black', borderRadius: '10px'}}>
              <CardActionArea>
                {loading
                  ? <Skeleton key={key} variant={'rect'} width={298} height={300} component={'div'} />
                  : <CardMedia
                    component="img"
                    alt={item?.album_name}
                    height="298"
                    image={item?.album_picture}
                    title={item?.album_name}
                  />}
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
