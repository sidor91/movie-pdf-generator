export type AllMoviesResultType = {
  link: string;
  original_title: string;
  release_date: string;
  vote_average: number;
};

export type MovieByIdResultType = {
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
};
