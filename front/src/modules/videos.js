export const updateVideos = (newVideoStream) => (dispatch) => {
  try {
    dispatch({ type: "UPDATE_VIDEOS", payload: newVideoStream });
  } catch (err) {
    console.error(err);
  }
};

export const deleteVideo = (streamID) => (dispatch) => {
  try {
    dispatch({ type: "DELETE_VIDEO", payload: streamID });
  } catch (err) {
    console.error(err);
  }
};

export const clearVideos = () => (dispatch) => {
  try {
    dispatch({ type: "CLEAR_VIDEOS" });
  } catch (err) {
    console.error(err);
  }
};

const initialState = [];

export const videos = (videos = initialState, action) => {
  switch (action.type) {
    case "UPDATE_VIDEOS":
      return [...videos, action.payload];
    case "DELETE_VIDEO":
      return videos.filter((v) => v.id !== action.payload);
    case "CLEAR_VIDEOS":
      return [];
    default:
      return videos;
  }
};
