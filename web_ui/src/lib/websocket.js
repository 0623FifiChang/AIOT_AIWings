import { io } from 'socket.io-client'

const SOCKET_DOMAIN =
  import.meta.env.NODE_ENV === 'production'
    ? 'https://ai-wings.ga:30110'
    : `${import.meta.env.VITE_APP_BACKEND_SERVICE_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_SERVICE_SERVICE_HOST}:${import.meta.env.VITE_APP_BACKEND_SERVICE_SERVICE_PORT}`

console.log("-- ./web_ui/src/lib/websocket.js -- \nSOCKET_DOMAIN = ",SOCKET_DOMAIN)

const socket = io(SOCKET_DOMAIN)
export default socket
