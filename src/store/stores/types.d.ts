/** Тип блюда */
type CourseItem = {
  VCode: number,
  Name: string,
  CatVCode: number,
  Discount_Price: number,
  Price: number,
}

/** Тип категории с блюдами */
type CategoryCourse = {
  VCode: number,
  Name: string,
  MenuVCode: number,
  CourseList: CourseItem[],
}