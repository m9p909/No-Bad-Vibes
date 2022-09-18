import "../../css/popup.css";
import { getRules } from "../rpc";

getRules().then(console.log).catch(console.error);
