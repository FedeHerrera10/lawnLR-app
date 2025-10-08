import Toast from 'react-native-toast-message'

export default function CustomToast({type, title, message}: {type: string, title: string, message: string}) {
    return (
        type === "success" ? ToastSuccess({title, message}) : ToastError({title, message})
    )
}

function ToastError({title, message }: { title: string, message: string }) {
  return (
    Toast.show({
            type: "error",
            text1: title,
            text2: message,
            text1Style: { fontSize: 16 },
            text2Style: { fontSize: 14 },
          })
        )
}

function ToastSuccess   ({title, message }: { title: string, message: string }) {
    return (
      Toast.show({
              type: "success",
              text1: title,
              text2: message,
              text1Style: { fontSize: 16 },
              text2Style: { fontSize: 14 },
            })
          )
  }
