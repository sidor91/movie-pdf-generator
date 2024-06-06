type CommonResultsType = {
  title: string;
  release_date: string;
  vote_average: number;
};

export type AllMoviesResultType = CommonResultsType & {
  link: string;
};

export type MovieByIdResultType = CommonResultsType & {
  poster_path: string;
};
