import GroupFormModal from "./GroupFormModal"

export default function EditGroupModal(props) {
  if (!props.open) return null
  return <GroupFormModal {...props} />
}
