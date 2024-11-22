//this api must have Accept-Language = id header

export type FitraHiveApiResponse = {
  statuscode: number;
  code: string;
  data: FitraHiveCategories[];
};

export type FitraHiveCategories = {
  name: string;
  slug: string;
  total: number;
};

export type FitraHiveSubCategoryApiResponse = {
  statuscode: number;
  code: string;
  data: FitraHiveSubCategories[];
};

export type FitraHiveSubCategories = {
  id: number;
  title: string;
  category: string;
  categoryName: string;
};

export type FitraHiveContentApiResponse = {
  statuscode: number;
  code: string;
  data: FitraHiveContent[];
};

export type FitraHiveContent = {
  id: number;
  title: string;
  category: string;
  categoryName: string;
  arabic: string;
  latin: string;
  translation: string;
  notes: string;
  fawaid: string;
  source: string;
};

export type FitraHiveCategory = {
  slug: string;
  total: number;
};
