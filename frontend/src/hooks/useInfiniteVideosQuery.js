import { useInfiniteQuery } from "@tanstack/react-query";
import { useVideoStore } from "../store/videoStore";

export const useInfiniteVideosQuery = (selectedMemberId, groupId) => {
  const getUserVideos = useVideoStore((state) => state.getUserVideos);

  return useInfiniteQuery({
    queryKey: ["videos", selectedMemberId, groupId],
    queryFn: ({ pageParam = 1 }) =>
      getUserVideos(selectedMemberId, groupId, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.userVideos.length === 0) return undefined;
      return pages.length + 1;
    },
    enabled: !!selectedMemberId && !!groupId,
  });
};
