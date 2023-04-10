import axios from "axios";

export default async function imageToUrl(image: any): Promise<string> {
  const body = new FormData();
  body.set("key", "045dbaf50d4d17cdea1a463d741bb4ab");
  body.append("image", image);
  const res = await axios.post("https://api.imgbb.com/1/upload", body);
  return res.data.data.display_url;
}
