export const parseText = (text) => {

  const lines = text.split("\n");
  const list = lines.map(item => {

    const limiterPos = item.indexOf(' ');

    return ({
      year: item.slice(0, limiterPos),
      album: item.slice(limiterPos + 1)
    })
  })

  return list.filter(item => item?.year && !isNaN(item.year) && item.album);
}