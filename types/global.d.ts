declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string
        email: string
        amount: number
        ref: string
        access_code?: string

        onClose: () => void

        callback: (response: {
          reference: string
        }) => void
      }) => {
        openIframe: () => void
      }
    }
  }
}

export { }