import CategoryPickerSheet from '../common/CategoryPickerSheet'
import type { CategorySheetProps } from '../common/CategoryPickerSheet'
import useScheduleCategoriesApi from '../../hooks/schedules/useScheduleCategoriesApi'
import useRenameCategory from '../../hooks/categories/useRenameCategory'

export default function CategorySheet(props: CategorySheetProps) {
  const categoriesApi = useScheduleCategoriesApi()
  const renameApi = useRenameCategory('schedule')
  return (
    <CategoryPickerSheet
      {...props}
      categoriesApi={categoriesApi}
      renameApi={renameApi}
    />
  )
}
