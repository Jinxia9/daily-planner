export type CategoryColor =
  | "red"
  | "orange"
  | "green"
  | "yellow"
  | "pink"
  | "lavender"
  | "blue"
  | "turquoise"

export interface Category {
  id: string
  name: string
  color: CategoryColor
  createdAt: string
}

export interface CategoryInput {
  name: string
  color: CategoryColor
}
