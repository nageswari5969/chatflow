import Sidebar from '../../components/common/Sidebar'
import ChatList from '../../components/chat/ChatList'
import ChatWindow from '../../components/chat/ChatWindow'
import IncomingCallModal from '../../components/call/IncomingCallModal'
import { useChat } from '../../context/ChatContext'
import { useCall } from '../../context/CallContext'

export default function ChatPage() {
  const { activeChat } = useChat()
  const { incomingCall } = useCall()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <ChatList />
      <ChatWindow conversation={activeChat} />
      {incomingCall && <IncomingCallModal />}
    </div>
  )
}
