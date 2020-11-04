export const updateVideos = (newVideoStream) => (dispatch) => {
  try {
    dispatch({ type: "UPDATE_VIDEOS", payload: newVideoStream });
  } catch (err) {
    console.error(err);
  }
};

const initialState = [];

export const videos = (videos = initialState, action) => {
  switch (action.type) {
    case "UPDATE_VIDEOS":
      return [...videos, action.payload];
    default:
      return videos;
  }
};
