import axios from "axios";

//TODO: whenever this file imported, is it reused or recreated ?
export default axios.create({
  baseURL: "http://localhost:8080",
});
