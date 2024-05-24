import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./stories.scss";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Define mutation function for adding a new story
  const addStoryMutation = useMutation({
    mutationFn: async (newStoryData) => {
      // Make request to add a new story
      const response = await makeRequest.post("/stories", newStoryData);
      return response.data; // Return the newly added story data
    },
    onSuccess: () => {
      // Invalidate and refetch stories query to update the UI
      queryClient.invalidateQueries("stories");
    },
  });

  // Fetch stories data using a query
  const { isLoading, error, data: storiesData } = useQuery({
    queryKey: ["stories"],
    queryFn: () =>
      makeRequest.get("/stories").then((res) => res.data),
  });

  // Function to handle adding a new story
  const handleAddStory = async () => {
    try {
      // Call the mutation function to add a new story
      await addStoryMutation.mutate({
        userId: currentUser.id, // Assuming you need to associate the story with the current user
        // Add other properties of the new story here
      });
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={handleAddStory}>+</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : storiesData.map((story) => (
            <div className="story" key={story.id}>
              <img src={"/upload/" + story.img} alt="" />
              <span>{story.name}</span>
            </div>
          ))}
    </div>
  );
};

export default Stories;
