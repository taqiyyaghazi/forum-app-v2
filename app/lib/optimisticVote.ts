export type VoteType = 'UP_VOTE' | 'DOWN_VOTE' | 'NEUTRAL_VOTE';

export interface OptimisticVoteState {
  upVotes: string[];
  downVotes: string[];
}

export interface OptimisticVoteAction {
  type: VoteType;
  userId: string;
}

export const optimisticVoteReducer = (
  state: OptimisticVoteState,
  action: OptimisticVoteAction,
): OptimisticVoteState => {
  switch (action.type) {
    case 'UP_VOTE':
      return {
        upVotes: [
          ...state.upVotes.filter((id) => id !== action.userId),
          action.userId,
        ],
        downVotes: state.downVotes.filter((id) => id !== action.userId),
      };
    case 'DOWN_VOTE':
      return {
        upVotes: state.upVotes.filter((id) => id !== action.userId),
        downVotes: [
          ...state.downVotes.filter((id) => id !== action.userId),
          action.userId,
        ],
      };
    case 'NEUTRAL_VOTE':
      return {
        upVotes: state.upVotes.filter((id) => id !== action.userId),
        downVotes: state.downVotes.filter((id) => id !== action.userId),
      };
    default:
      return state;
  }
};
