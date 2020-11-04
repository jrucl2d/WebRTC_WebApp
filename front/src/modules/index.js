/* Redux Ducks 패턴 사용 */
import { combineReducers } from "redux";
import { videos } from "./videos";

const rootReducer = combineReducers({
  videos,
});
export default rootReducer;
