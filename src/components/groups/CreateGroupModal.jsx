import GroupFormModal from "./GroupFormModal"

export default function CreateGroupModal(props) {
  if (!props.open) return null
  return <GroupFormModal {...props} group={null} />
}
