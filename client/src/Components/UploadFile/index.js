import { useRef } from 'react';
import Button from '@material-ui/core/Button';

const UploadFile = ({ fileContent }) => {
  const fileReader = new FileReader();
  const uploadInputRef = useRef(null);

  const handleFileRead = (e) => {
    const content = fileReader.result;
    fileContent(content);
  };

  const handleFileChosen = (e) => {
    const file = e.target.files[0];
    fileReader.onloadend = handleFileRead;
    if (file instanceof Blob)
     fileReader.readAsText(file);
  };


  return <>
    <input
      ref={uploadInputRef}
      type="file"
      accept=".txt"
      style={{ display: "none" }}
      onChange={handleFileChosen}
    />
    <Button
      onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
      variant="contained"
      color="primary"
    >
      Upload
  </Button>
  </>;
};

export default UploadFile;
