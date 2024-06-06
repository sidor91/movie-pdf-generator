export type AllMoviesResultType = {
  link: string;
  title: string;
  release_date: string;
  vote_average: number;
};

export type MovieByIdResultType = {
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
};
