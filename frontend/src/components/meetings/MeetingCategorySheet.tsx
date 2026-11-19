import CategoryPickerSheet from '../common/CategoryPickerSheet'
import type { CategorySheetProps } from '../common/CategoryPickerSheet'
import useMeetingCategoriesApi from '../../hooks/meetings/useMeetingCategoriesApi'
import useRenameCategory from '../../hooks/categories/useRenameCategory'

export default function MeetingCategorySheet(props: CategorySheetProps) {
  const categoriesApi = useMeetingCategoriesApi()
  const renameApi = useRenameCategory('meeting')
  return (
    <CategoryPickerSheet
      {...props}
      categoriesApi={categoriesApi}
      renameApi={renameApi}
    />
  )
}
